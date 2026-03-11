"""
Stage 2 – Machine Learning Classification.

Trains a Logistic Regression classifier on TF-IDF features extracted from
the IFND (Indian Fake News Dataset).  Provides helpers to train, persist,
load, and run inference.

Classification buckets (based on sigmoid probability of REAL class):
    >=0.85  →  Real
    >=0.78  →  Likely Real
    >=0.55  →  Uncertain
    >=0.20  →  Likely Fake
    < 0.20  →  Fake
"""

from __future__ import annotations

import logging
import os
import pickle
from dataclasses import dataclass

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from config.settings import DATA_DIR, MODEL_DIR

logger = logging.getLogger(__name__)

# ── File paths for persisted artifacts ──────────────────────────
_VECTORIZER_PATH = os.path.join(MODEL_DIR, "tfidf_vectorizer.pkl")
_CLASSIFIER_PATH = os.path.join(MODEL_DIR, "logistic_model.pkl")

# ── Cached runtime objects ──────────────────────────────────────
_vectorizer: TfidfVectorizer | None = None
_classifier: LogisticRegression | None = None


# ── Data class for prediction result ───────────────────────────

@dataclass
class MLPrediction:
    label: str          # Fake / Likely Fake / Uncertain / Likely Real / Real
    confidence: float   # sigmoid probability (0–1)
    top_features: list[tuple[str, float]]  # (word, weight) pairs


# ── Probability → label mapping ────────────────────────────────

def _prob_to_label(prob_real: float) -> str:
    """Map the sigmoid probability of REAL class to a human-readable label."""
    if prob_real >= 0.85:
        return "Real"
    if prob_real >= 0.78:
        return "Likely Real"
    if prob_real >= 0.55:
        return "Uncertain"
    if prob_real >= 0.20:
        return "Likely Fake"
    return "Fake"


# ── Training ────────────────────────────────────────────────────

def train_model() -> dict:
    """
    Train and persist a TF-IDF + Logistic Regression pipeline.

    Uses 80/20 train/test split with a fixed random seed for
    reproducibility.  Returns a dict with evaluation metrics.
    """
    csv_path = os.path.join(DATA_DIR, "IFND.csv")
    df = pd.read_csv(csv_path, encoding="latin-1")

    # Drop rows with missing text
    df = df.dropna(subset=["Statement"])

    X = df["Statement"]
    # Normalise labels — dataset uses "TRUE"/"True" for real and "Fake"/"fake" for fake
    y = df["Label"].astype(str).str.strip().str.upper().map(
        {"TRUE": "REAL", "FAKE": "FAKE"}
    )
    mask = y.notna()
    X, y = X[mask], y[mask]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y,
    )

    # TF-IDF vectorisation
    vectorizer = TfidfVectorizer(
        max_features=10_000,
        stop_words="english",
        ngram_range=(1, 2),
        sublinear_tf=True,
    )
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    # Logistic Regression with sigmoid probabilities
    classifier = LogisticRegression(
        max_iter=1000,
        solver="lbfgs",
        class_weight="balanced",
        random_state=42,
    )
    classifier.fit(X_train_tfidf, y_train)

    # Evaluation
    y_pred = classifier.predict(X_test_tfidf)
    report = classification_report(y_test, y_pred, output_dict=True)

    accuracy = report["accuracy"]
    logger.info("Model accuracy: %.4f", accuracy)
    logger.info(
        "Classification report:\n%s",
        classification_report(y_test, y_pred),
    )

    # Persist artifacts
    os.makedirs(MODEL_DIR, exist_ok=True)
    with open(_VECTORIZER_PATH, "wb") as f:
        pickle.dump(vectorizer, f)
    with open(_CLASSIFIER_PATH, "wb") as f:
        pickle.dump(classifier, f)

    logger.info("Model and vectorizer saved to %s", MODEL_DIR)

    return {
        "accuracy": round(accuracy, 4),
        "report": report,
        "train_size": len(X_train),
        "test_size": len(X_test),
    }


# ── Loading ─────────────────────────────────────────────────────

def _load_artifacts() -> None:
    """Load persisted vectorizer and classifier into module-level cache."""
    global _vectorizer, _classifier

    if _vectorizer is not None and _classifier is not None:
        return  # already loaded

    if not os.path.exists(_VECTORIZER_PATH) or not os.path.exists(_CLASSIFIER_PATH):
        raise FileNotFoundError(
            "Trained model artifacts not found. Run `python -m app.model` to train first."
        )

    with open(_VECTORIZER_PATH, "rb") as f:
        _vectorizer = pickle.load(f)  # noqa: S301
    with open(_CLASSIFIER_PATH, "rb") as f:
        _classifier = pickle.load(f)  # noqa: S301

    logger.info("ML model loaded from %s", MODEL_DIR)


def is_model_ready() -> bool:
    """Return True if trained artifacts exist on disk."""
    return os.path.exists(_VECTORIZER_PATH) and os.path.exists(_CLASSIFIER_PATH)


# ── Prediction ──────────────────────────────────────────────────

def predict(text: str) -> MLPrediction:
    """
    Classify a single piece of text.

    Returns an MLPrediction with the human-readable label, the sigmoid
    confidence score, and the top influential TF-IDF features.
    """
    _load_artifacts()
    assert _vectorizer is not None and _classifier is not None

    tfidf_vec = _vectorizer.transform([text])
    proba = _classifier.predict_proba(tfidf_vec)[0]

    # Map class indices to labels
    classes = list(_classifier.classes_)
    real_idx = classes.index("REAL")
    prob_real = float(proba[real_idx])

    label = _prob_to_label(prob_real)
    confidence = prob_real if prob_real >= 0.5 else 1.0 - prob_real

    # Extract top influential features for explainability
    feature_names = _vectorizer.get_feature_names_out()
    coef = _classifier.coef_[0]
    tfidf_array = tfidf_vec.toarray()[0]

    # Contribution = tfidf_weight × model_coefficient
    contributions = tfidf_array * coef
    # Sort by absolute contribution
    top_indices = sorted(
        range(len(contributions)),
        key=lambda i: abs(contributions[i]),
        reverse=True,
    )

    top_features: list[tuple[str, float]] = []
    for idx in top_indices:
        if tfidf_array[idx] == 0.0:
            continue
        top_features.append((feature_names[idx], round(float(contributions[idx]), 4)))
        if len(top_features) >= 10:
            break

    return MLPrediction(
        label=label,
        confidence=round(confidence, 4),
        top_features=top_features,
    )


# ── Public loader ───────────────────────────────────────────────

def load_model() -> None:
    """Load persisted artifacts into memory (public wrapper around _load_artifacts)."""
    _load_artifacts()


# ── CLI entry-point for training ────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    metrics = train_model()
    print(f"\nTraining complete — accuracy: {metrics['accuracy']}")
    print(f"Train size: {metrics['train_size']}, Test size: {metrics['test_size']}")
