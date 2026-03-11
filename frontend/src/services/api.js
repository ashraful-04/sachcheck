/**
 * SachCheck – API Service Layer
 *
 * All calls to the FastAPI backend go through here.
 * Responses are normalised to match the shape the React pages expect.
 */

const BASE_URL = 'http://localhost:8000';

// ── Helpers ─────────────────────────────────────────────────────

function statusToType(status) {
  if (['Real', 'Likely Real'].includes(status)) return 'real';
  if (['Fake', 'Likely Fake'].includes(status)) return 'fake';
  return 'uncertain';
}

// Backend returns `imageUrl`; NewsCard expects `urlToImage`
function normalizeArticle(a) {
  return {
    ...a,
    urlToImage: a.imageUrl || a.urlToImage || null,
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Server error ${res.status}${text ? ': ' + text : ''}`);
  }
  return res.json();
}

// ── Endpoints ────────────────────────────────────────────────────

/**
 * POST /predict
 * Detect whether a news text is real or fake.
 * Returns a shape the DetectNews page can use directly.
 */
export async function detectNews(text) {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const data = await handleResponse(res);

  return {
    verdict: data.status,
    type: statusToType(data.status),
    confidence: data.confidence ?? 0.5,
    reasoning: data.reasoning || 'No reasoning available.',
    method: data.sources?.length ? 'Source Verification' : 'AI Classification',
    keywords: [],                        // backend surfaces keywords inside reasoning text
    sources: (data.sources || []).map((s) => ({
      name: s.source || s.title || 'Source',
      url: s.url,
      title: s.title,
    })),
  };
}

/**
 * GET /top-news?q=<query>
 * Fetch trending / latest news articles.
 */
export async function getTopNews(query = 'india') {
  const res = await fetch(`${BASE_URL}/top-news?q=${encodeURIComponent(query)}`);
  const data = await handleResponse(res);
  return (data.articles || []).map(normalizeArticle);
}

/**
 * GET /search?q=<query>
 * Full-text search for news articles.
 */
export async function searchNews(query) {
  const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(query)}`);
  const data = await handleResponse(res);
  return (data.articles || []).map(normalizeArticle);
}

/**
 * POST /credibility
 * Check the credibility of a news domain.
 * Returns { status, domain, message } as the SourceCheck page expects.
 */
export async function checkCredibility(domain) {
  const res = await fetch(`${BASE_URL}/credibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ domain }),
  });

  const data = await handleResponse(res);

  const messages = {
    trusted: 'This domain is verified as a trusted news source with a strong track record.',
    suspicious: 'This domain is flagged as a known misinformation source. Exercise extreme caution.',
    unknown: 'This source is not in our database. Exercise caution and cross-verify from multiple trusted sources.',
  };

  return {
    status: data.label,          // 'trusted' | 'suspicious' | 'unknown'
    domain: data.domain,
    message: messages[data.label] || messages.unknown,
  };
}
