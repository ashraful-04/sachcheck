"""
News verification via NewsAPI + semantic similarity matching.

Flow:
1. Take user-submitted news text
2. Query NewsAPI /everything endpoint for related articles
3. Compute cosine similarity (sentence-transformers) between user text
   and each article's title+description
4. Return matched articles sorted by relevance
"""

import logging
from dataclasses import dataclass, field

import requests
from sentence_transformers import SentenceTransformer, util

from config.settings import NEWS_API_KEY, NEWS_API_BASE_URL

logger = logging.getLogger(__name__)

# Load model once at module level (cached after first import)
_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        logger.info("Loading sentence-transformer model …")
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


# ── Data classes ────────────────────────────────────────────────


@dataclass
class MatchedArticle:
    title: str
    description: str | None
    url: str
    source: str
    similarity: float
    image_url: str | None = None


@dataclass
class VerificationResult:
    verified: bool
    confidence: float
    matched_articles: list[MatchedArticle] = field(default_factory=list)


# ── NewsAPI helpers ─────────────────────────────────────────────


def _search_articles(query: str, page_size: int = 10) -> list[dict]:
    """Search NewsAPI /everything for articles matching *query*."""
    if not NEWS_API_KEY:
        logger.warning("NEWS_API_KEY not set – skipping NewsAPI search")
        return []

    params = {
        "q": query,
        "pageSize": page_size,
        "sortBy": "relevancy",
        "language": "en",
        "apiKey": NEWS_API_KEY,
    }
    try:
        resp = requests.get(
            f"{NEWS_API_BASE_URL}/everything",
            params=params,
            timeout=10,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("articles", [])
    except requests.RequestException as exc:
        logger.error("NewsAPI request failed: %s", exc)
        return []


def _get_top_headlines(
    country: str = "in",
    category: str | None = None,
    page_size: int = 20,
) -> list[dict]:
    """Fetch top headlines from NewsAPI."""
    if not NEWS_API_KEY:
        return []

    params: dict = {
        "country": country,
        "pageSize": page_size,
        "apiKey": NEWS_API_KEY,
    }
    if category:
        params["category"] = category
    try:
        resp = requests.get(
            f"{NEWS_API_BASE_URL}/top-headlines",
            params=params,
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json().get("articles", [])
    except requests.RequestException as exc:
        logger.error("NewsAPI top-headlines failed: %s", exc)
        return []


def _fetch_latest_news(query: str = "india", page_size: int = 20) -> list[dict]:
    """Fetch latest news via /everything with sortBy=publishedAt."""
    if not NEWS_API_KEY:
        return []

    params: dict = {
        "q": query,
        "sortBy": "publishedAt",
        "pageSize": page_size,
        "language": "en",
        "apiKey": NEWS_API_KEY,
    }
    try:
        resp = requests.get(
            f"{NEWS_API_BASE_URL}/everything",
            params=params,
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json().get("articles", [])
    except requests.RequestException as exc:
        logger.error("NewsAPI latest-news failed: %s", exc)
        return []


# ── Semantic matching ───────────────────────────────────────────

SIMILARITY_THRESHOLD = 0.7  # articles above this are considered a match


def _compute_similarities(
    user_text: str,
    articles: list[dict],
) -> list[MatchedArticle]:
    """Rank articles by cosine similarity to user_text."""
    if not articles:
        return []

    model = _get_model()

    # Build candidate texts from title + description
    candidates: list[str] = []
    valid_articles: list[dict] = []
    for art in articles:
        title = art.get("title") or ""
        desc = art.get("description") or ""
        combined = f"{title}. {desc}".strip(". ")
        if combined:
            candidates.append(combined)
            valid_articles.append(art)

    if not candidates:
        return []

    user_emb = model.encode(user_text, convert_to_tensor=True)
    cand_embs = model.encode(candidates, convert_to_tensor=True)
    scores = util.cos_sim(user_emb, cand_embs)[0]

    matched: list[MatchedArticle] = []
    for idx, art in enumerate(valid_articles):
        sim = float(scores[idx])
        if sim >= SIMILARITY_THRESHOLD:
            matched.append(
                MatchedArticle(
                    title=art.get("title", ""),
                    description=art.get("description"),
                    url=art.get("url", ""),
                    source=art.get("source", {}).get("name", "Unknown"),
                    similarity=round(sim, 4),
                    image_url=art.get("urlToImage"),
                )
            )

    matched.sort(key=lambda m: m.similarity, reverse=True)
    return matched


# ── Public API ──────────────────────────────────────────────────


def verify_news(text: str) -> VerificationResult:
    """
    Stage 1 of the detection pipeline.

    Returns a VerificationResult indicating whether the claim was
    corroborated by trusted journalism sources.
    """
    articles = _search_articles(text)
    matched = _compute_similarities(text, articles)

    if matched:
        best = matched[0].similarity
        return VerificationResult(
            verified=True,
            confidence=best,
            matched_articles=matched[:5],  # top-5 sources
        )

    return VerificationResult(verified=False, confidence=0.0)


def get_top_news(query: str = "india") -> list[dict]:
    """Return latest headlines for the /top-news endpoint via /everything."""
    raw = _fetch_latest_news(query=query)
    return [
        {
            "title": a.get("title"),
            "description": a.get("description"),
            "url": a.get("url"),
            "source": a.get("source", {}).get("name"),
            "publishedAt": a.get("publishedAt"),
            "imageUrl": a.get("urlToImage"),
        }
        for a in raw
    ]


def search_news(query: str) -> list[dict]:
    """Return articles matching a free-text query for the /search endpoint."""
    raw = _search_articles(query, page_size=20)
    return [
        {
            "title": a.get("title"),
            "description": a.get("description"),
            "url": a.get("url"),
            "source": a.get("source", {}).get("name"),
            "publishedAt": a.get("publishedAt"),
            "imageUrl": a.get("urlToImage"),
        }
        for a in raw
    ]
