/**
 * Utility / helper functions
 */

export function formatDate(dateStr) {
  if (!dateStr) return "Unknown date";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getMockResult(input, MOCK_DETECTIONS) {
  // Exact match
  if (MOCK_DETECTIONS[input]) {
    return MOCK_DETECTIONS[input];
  }

  // Keyword-based fake detection
  const fakeKeywords = [
    "secret", "shocking", "free", "virus", "alien", "conspiracy",
    "hidden", "banned", "exposed", "scam", "urgent", "forward",
  ];
  const lowerInput = input.toLowerCase();
  const foundFake = fakeKeywords.filter((k) => lowerInput.includes(k));

  if (foundFake.length > 0) {
    const conf = Math.min(0.65 + foundFake.length * 0.08, 0.96);
    return {
      verdict: conf > 0.8 ? "Fake" : "Likely Fake",
      confidence: conf,
      method: "AI Classification (Logistic Regression)",
      reasoning:
        "The text contains sensational keywords commonly associated with misinformation. No credible news sources found reporting this claim.",
      keywords: foundFake,
      sources: [],
      type: "fake",
    };
  }

  // Default: uncertain
  return {
    verdict: "Uncertain",
    confidence: 0.52,
    method: "AI Classification (Logistic Regression)",
    reasoning:
      "The AI model could not determine with high confidence whether this news is real or fake. Consider verifying with official sources or trusted news outlets.",
    keywords: [],
    sources: [],
    type: "uncertain",
  };
}
