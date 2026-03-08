/**
 * SachCheck - API Configuration & Source Data
 *
 * IMPORTANT: Your friend (backend developer) will provide the actual API URL.
 * Update BASE_URL to point to the Flask backend once it's ready.
 */

const CONFIG = {
  // ===== BACKEND API URL =====
  // Change this to your friend's Flask backend URL when ready
  BASE_URL: "http://localhost:5000/api",

  // API Endpoints (your friend should implement these)
  ENDPOINTS: {
    DETECT: "/detect",           // POST - { text: "..." } → verdict, confidence, reasoning
    TRENDING: "/trending",       // GET  - ?category=general
    SEARCH: "/search",           // GET  - ?q=keyword
    CREDIBILITY: "/credibility", // GET  - ?domain=example.com
  },

  // Set to true to use mock data (no backend needed for demo)
  // Set to false when connecting to actual backend
  DEMO_MODE: true,
};

// ===== TRUSTED SOURCES (JSON Whitelist) =====
export const TRUSTED_SOURCES = [
  { domain: "ndtv.com", name: "NDTV", description: "Established Indian news outlet with fact-checking division" },
  { domain: "thehindu.com", name: "The Hindu", description: "One of India's oldest and most respected newspapers" },
  { domain: "hindustantimes.com", name: "Hindustan Times", description: "Major Indian English-language daily newspaper" },
  { domain: "timesofindia.indiatimes.com", name: "Times of India", description: "Largest-selling English-language daily in the world" },
  { domain: "indianexpress.com", name: "Indian Express", description: "Award-winning investigative journalism" },
  { domain: "bbc.com", name: "BBC News", description: "British public service broadcaster, globally trusted" },
  { domain: "reuters.com", name: "Reuters", description: "International news organization, known for unbiased reporting" },
  { domain: "apnews.com", name: "AP News", description: "Not-for-profit news agency, factual and unbiased" },
  { domain: "theguardian.com", name: "The Guardian", description: "British daily newspaper with reputable journalism" },
  { domain: "aljazeera.com", name: "Al Jazeera", description: "Qatar-based international news network" },
  { domain: "livemint.com", name: "Livemint", description: "Indian financial news outlet by HT Media" },
  { domain: "scroll.in", name: "Scroll.in", description: "Independent Indian news and opinion website" },
  { domain: "thewire.in", name: "The Wire", description: "Independent Indian news website" },
  { domain: "economictimes.indiatimes.com", name: "Economic Times", description: "Indian daily newspaper focused on business" },
  { domain: "pib.gov.in", name: "PIB (Press Information Bureau)", description: "Official Indian government press releases" },
  { domain: "isro.gov.in", name: "ISRO", description: "Indian Space Research Organisation official site" },
  { domain: "who.int", name: "WHO", description: "World Health Organization official site" },
  { domain: "deccanherald.com", name: "Deccan Herald", description: "Indian English-language daily newspaper" },
  { domain: "news18.com", name: "News18", description: "Indian news and entertainment network" },
  { domain: "firstpost.com", name: "Firstpost", description: "Indian digital news publication" },
];

// ===== SUSPICIOUS / BLACKLISTED SOURCES =====
export const SUSPICIOUS_SOURCES = [
  { domain: "fakenewssite.com", name: "Fake News Site", description: "Known for spreading misinformation" },
  { domain: "clickbaitcentral.in", name: "Clickbait Central", description: "Publishes sensational unverified claims" },
  { domain: "whatsappforward.com", name: "WhatsApp Forward", description: "Aggregates unverified WhatsApp forwards" },
  { domain: "conspiracyindia.com", name: "Conspiracy India", description: "Promotes conspiracy theories" },
  { domain: "breakingnewsfake.in", name: "Breaking News Fake", description: "Misleading headlines and fake news" },
  { domain: "viralclaims.net", name: "Viral Claims", description: "Publishes viral but unverified news" },
  { domain: "sensationnews.in", name: "Sensation News", description: "Known for exaggerated and false reporting" },
  { domain: "hoaxalert.com", name: "Hoax Alert", description: "Ironically spreads hoaxes itself" },
];

// ===== MOCK TRENDING NEWS (Demo Mode) =====
export const MOCK_TRENDING_NEWS = [
  {
    title: "ISRO Successfully Tests Next-Gen Rocket Engine for Gaganyaan",
    description: "The Indian Space Research Organisation has completed a crucial test of its CE-20 cryogenic engine, marking a significant milestone for the Gaganyaan human spaceflight program.",
    source: "The Hindu",
    publishedAt: "2026-03-08T10:30:00Z",
    url: "https://thehindu.com/sci-tech",
    urlToImage: "https://placehold.co/400x200/1E293B/818CF8?text=ISRO+Gaganyaan",
    category: "science",
  },
  {
    title: "India's GDP Growth Projected at 7.2% for FY2026",
    description: "The Reserve Bank of India projects robust economic growth driven by strong domestic consumption and increasing digital adoption across sectors.",
    source: "Economic Times",
    publishedAt: "2026-03-07T14:00:00Z",
    url: "https://economictimes.com",
    urlToImage: "https://placehold.co/400x200/1E293B/10B981?text=GDP+Growth",
    category: "business",
  },
  {
    title: "Indian Cricket Team Announces T20 World Cup Squad",
    description: "BCCI reveals the 15-member squad for the upcoming ICC T20 World Cup with some surprise inclusions and notable omissions.",
    source: "NDTV Sports",
    publishedAt: "2026-03-07T18:00:00Z",
    url: "https://ndtv.com/sports",
    urlToImage: "https://placehold.co/400x200/1E293B/F59E0B?text=T20+World+Cup",
    category: "sports",
  },
  {
    title: "New AI Healthcare Platform Launched for Rural India",
    description: "A government-backed AI platform will provide diagnostic support to healthcare workers in remote villages, leveraging mobile technology and machine learning.",
    source: "Livemint",
    publishedAt: "2026-03-06T09:00:00Z",
    url: "https://livemint.com",
    urlToImage: "https://placehold.co/400x200/1E293B/EF4444?text=AI+Healthcare",
    category: "health",
  },
  {
    title: "India Launches 5G-Enabled Smart City Projects in 10 Cities",
    description: "The Ministry of Electronics and IT announces the rollout of 5G-enabled smart infrastructure projects in 10 tier-2 cities across India.",
    source: "Indian Express",
    publishedAt: "2026-03-06T12:00:00Z",
    url: "https://indianexpress.com",
    urlToImage: "https://placehold.co/400x200/1E293B/818CF8?text=Smart+City",
    category: "technology",
  },
  {
    title: "Union Budget 2026: Key Highlights for Education Sector",
    description: "Finance Minister announces increased allocation for digital education infrastructure and AI research centers in universities.",
    source: "NDTV",
    publishedAt: "2026-03-05T16:00:00Z",
    url: "https://ndtv.com",
    urlToImage: "https://placehold.co/400x200/1E293B/10B981?text=Budget+2026",
    category: "general",
  },
];

// ===== MOCK DETECTION RESULTS (Demo Mode) =====
export const MOCK_DETECTIONS = {
  "ISRO launches Chandrayaan-4 mission": {
    verdict: "Real",
    confidence: 0.94,
    method: "Verified via trusted news sources",
    reasoning: "This news has been reported by multiple credible sources including NDTV, The Hindu, and Reuters. ISRO's Chandrayaan program is well-documented and verified.",
    keywords: [],
    sources: [
      { name: "NDTV", url: "https://ndtv.com" },
      { name: "The Hindu", url: "https://thehindu.com" },
      { name: "Reuters", url: "https://reuters.com" },
    ],
    type: "real",
  },
  "NASA confirms aliens discovered in Himalayan cave": {
    verdict: "Fake",
    confidence: 0.91,
    method: "AI Classification (Logistic Regression)",
    reasoning: "This is a sensational claim with no credible sources. Keywords like 'aliens discovered' and 'confirms' combined with the extraordinary nature of the claim indicate high probability of misinformation.",
    keywords: ["aliens", "discovered", "confirms", "Himalayan cave"],
    sources: [],
    type: "fake",
  },
  "India launches new satellite for climate monitoring": {
    verdict: "Real",
    confidence: 0.89,
    method: "Verified via trusted news sources",
    reasoning: "India's satellite-launching activities are regularly reported by credible journalism outlets. The claim is consistent with ISRO's ongoing programs.",
    keywords: [],
    sources: [
      { name: "BBC News", url: "https://bbc.com" },
      { name: "Reuters", url: "https://reuters.com" },
      { name: "The Hindu", url: "https://thehindu.com" },
    ],
    type: "real",
  },
  "WhatsApp will start charging ₹50/month from next week": {
    verdict: "Fake",
    confidence: 0.95,
    method: "AI Classification (Logistic Regression)",
    reasoning: "This is a commonly circulated hoax on WhatsApp itself. Meta (WhatsApp's parent company) has never announced any plans to charge individual users. The urgent language and specific pricing are classic misinformation patterns.",
    keywords: ["charging", "₹50/month", "next week", "WhatsApp"],
    sources: [],
    type: "fake",
  },
  "Government secretly installing surveillance chips in Aadhaar cards": {
    verdict: "Likely Fake",
    confidence: 0.82,
    method: "AI Classification (Logistic Regression)",
    reasoning: "Keywords influencing classification – secretly, surveillance chips, government hiding. This claim has no verification from any official or credible source. Aadhaar cards use QR codes, not embedded chips.",
    keywords: ["secretly", "surveillance", "chips", "government"],
    sources: [],
    type: "fake",
  },
};

export default CONFIG;
