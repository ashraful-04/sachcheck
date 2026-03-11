"""
Reasoning / Explainability for ML predictions.

Generates human-readable explanations from the top TF-IDF feature
contributions returned by the model.
"""

from __future__ import annotations


def build_reasoning(
    label: str,
    top_features: list[tuple[str, float]],
) -> str:
    """
    Produce a short explanation string from the model's top features.

    Parameters
    ----------
    label : str
        The predicted label (e.g. "Fake", "Likely Real").
    top_features : list of (word, contribution_score) tuples
        Signed contribution scores — positive pushes toward REAL,
        negative pushes toward FAKE.
    """
    if not top_features:
        return f"Prediction: {label}. No dominant keywords detected."

    # Separate features pushing toward fake vs. real
    fake_kw = [w for w, c in top_features if c < 0]
    real_kw = [w for w, c in top_features if c > 0]

    parts: list[str] = []

    if fake_kw:
        parts.append(
            f"Keywords suggesting fake: {', '.join(fake_kw[:5])}"
        )
    if real_kw:
        parts.append(
            f"Keywords suggesting real: {', '.join(real_kw[:5])}"
        )

    if not parts:
        return f"Prediction: {label}."

    return f"Prediction: {label}. " + ". ".join(parts) + "."
