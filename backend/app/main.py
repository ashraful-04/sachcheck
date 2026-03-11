import logging
import asyncio
import concurrent.futures
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.news_verifier import verify_news, get_top_news, search_news
from app.credibility_checker import check_credibility as _check_credibility
from app.model import predict as ml_predict, is_model_ready, train_model, load_model
from app.reasoning import build_reasoning

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Background ML initialisation ────────────────────────────────

_training_done = False          # set to True once model is in memory
_training_in_progress = False   # guard against double-starting


def _init_model() -> None:
    """
    Run in a thread-pool worker so FastAPI startup is never blocked.

    • If .pkl files already exist  → load them (~0.1 s).
    • If not                       → train from IFND.csv, then load.
    """
    global _training_done, _training_in_progress
    _training_in_progress = True
    try:
        if is_model_ready():
            logger.info("ML artifacts found — loading model…")
            load_model()
            logger.info("ML model loaded and ready.")
        else:
            logger.info("No trained model found — starting training on IFND.csv…")
            metrics = train_model()
            load_model()
            logger.info(
                "Training complete — accuracy: %.4f  (train=%d, test=%d)",
                metrics["accuracy"],
                metrics["train_size"],
                metrics["test_size"],
            )
        _training_done = True
    except Exception as exc:
        logger.error("Model initialisation failed: %s", exc)
    finally:
        _training_in_progress = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Start ML init in a background thread; yield; shut down thread pool."""
    executor = concurrent.futures.ThreadPoolExecutor(max_workers=1, thread_name_prefix="ml-init")
    loop = asyncio.get_event_loop()
    loop.run_in_executor(executor, _init_model)
    yield
    executor.shutdown(wait=False)


app = FastAPI(
    title="AI-Based Fake News Detection",
    description="Detects fake news in Indian social media content using NewsAPI verification and ML classification.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response schemas ──────────────────────────────────

class NewsInput(BaseModel):
    text: str


class SourceInfo(BaseModel):
    title: str
    url: str
    source: str
    similarity: float
    image_url: str | None = None


class PredictionResponse(BaseModel):
    status: str          # Real / Fake / Likely Fake / Likely Real / Uncertain
    confidence: float | None = None
    sources: list[SourceInfo] | None = None
    reasoning: str | None = None


class CredibilityInput(BaseModel):
    domain: str


class CredibilityResponse(BaseModel):
    domain: str
    trusted: bool
    suspicious: bool = False
    label: str = "unknown"


# ── Routes ──────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "AI-Based Fake News Detection API is running."}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(news: NewsInput):
    """
    Two-stage fake news detection.

    Stage 1 — NewsAPI verification with semantic matching.
    Stage 2 — ML classification using TF-IDF + Logistic Regression.
    """
    result = verify_news(news.text)

    if result.verified:
        sources = [
            SourceInfo(
                title=m.title,
                url=m.url,
                source=m.source,
                similarity=m.similarity,
                image_url=m.image_url,
            )
            for m in result.matched_articles
        ]
        source_names = ", ".join(dict.fromkeys(m.source for m in result.matched_articles))
        return PredictionResponse(
            status="Real",
            confidence=result.confidence,
            sources=sources,
            reasoning=f"Verified by trusted sources: {source_names}",
        )

    # Stage 2 — ML classification
    if not is_model_ready():
        msg = (
            "Model is still training in the background — please retry in a moment."
            if _training_in_progress
            else "ML model not trained yet. Place IFND.csv in backend/data/ and restart the server."
        )
        return PredictionResponse(
            status="Uncertain",
            confidence=0.5,
            reasoning=msg,
        )

    prediction = ml_predict(news.text)
    reasoning = build_reasoning(prediction.label, prediction.top_features)

    return PredictionResponse(
        status=prediction.label,
        confidence=prediction.confidence,
        reasoning=reasoning,
    )


@app.get("/top-news")
def top_news_route(q: str = "india"):
    """Latest news via NewsAPI /everything, sorted by publish date."""
    articles = get_top_news(query=q)
    return {"articles": articles}


@app.get("/search")
def search_news_route(q: str):
    """Search for articles matching a query via NewsAPI."""
    articles = search_news(q)
    return {"articles": articles}


@app.post("/credibility", response_model=CredibilityResponse)
def credibility_route(payload: CredibilityInput):
    """Check whether a news domain is trusted or suspicious."""
    info = _check_credibility(payload.domain)
    return CredibilityResponse(**info)
