import { useState, useEffect } from 'react';

const DEMO_EXAMPLES = [
  {
    text: '"PM announces free laptops for all students"',
    type: 'fake',
    verdict: 'Likely Fake',
    confidence: 87,
    icon: 'fas fa-times-circle',
    reason: 'Keywords: "free", "all students" — No verified sources found',
  },
  {
    text: '"India\'s GDP growth projected at 7.2% for FY2026"',
    type: 'real',
    verdict: 'Verified Real',
    confidence: 91,
    icon: 'fas fa-check-circle',
    reason: 'Confirmed by RBI, Economic Times, Livemint',
  },
];

export default function Home({ onNavigate }) {
  const [currentExample, setCurrentExample] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentExample((prev) => (prev + 1) % DEMO_EXAMPLES.length);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setFade(true));
        });
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const ex = DEMO_EXAMPLES[currentExample];

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Verification</div>
          <h1>
            Don't Spread It.<br />
            Verify It with <span className="highlight">SachCheck</span>
          </h1>
          <p className="hero-subtitle">
            India's smart fake news detection system that combines trusted journalism
            sources and machine learning to help you separate facts from fiction on
            social media.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => onNavigate('detect')}>
              <i className="fas fa-search-plus"></i> Check News Now
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => onNavigate('trending')}>
              <i className="fas fa-fire"></i> View Trending
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">15,000+</div>
              <div className="stat-label">News Checked</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Trusted Sources</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-header-demo">
              <i className="fas fa-robot"></i> AI Analysis
              <div className="demo-dots">
                {DEMO_EXAMPLES.map((_, i) => (
                  <span
                    key={i}
                    className={`demo-dot ${i === currentExample ? 'active' : ''}`}
                    onClick={() => { setFade(false); setTimeout(() => { setCurrentExample(i); setFade(true); }, 200); }}
                  ></span>
                ))}
              </div>
            </div>
            <div className={`card-body-demo ${fade ? 'demo-fade-in' : 'demo-fade-out'}`}>
              <div className="demo-input">
                {ex.text}
              </div>
              <div className={`demo-result ${ex.type}`}>
                <i className={ex.icon}></i>
                <span>{ex.verdict}</span>
                <span className="confidence">Confidence: {ex.confidence}%</span>
              </div>
              <div className="demo-reason">
                <i className="fas fa-info-circle"></i>
                {ex.reason}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon"><i className="fas fa-keyboard"></i></div>
            <div className="step-number">1</div>
            <h3>Paste News</h3>
            <p>Enter any news headline or social media message you want to verify</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><i className="fas fa-satellite-dish"></i></div>
            <div className="step-number">2</div>
            <h3>Source Verification</h3>
            <p>System checks trusted journalism sources like Reuters, BBC, The Hindu via NewsAPI</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><i className="fas fa-brain"></i></div>
            <div className="step-number">3</div>
            <h3>AI Classification</h3>
            <p>If not found in sources, ML model classifies using TF-IDF + Logistic Regression</p>
          </div>
          <div className="step-card">
            <div className="step-icon"><i className="fas fa-chart-pie"></i></div>
            <div className="step-number">4</div>
            <h3>Get Results</h3>
            <p>Receive prediction with confidence score, reasoning, and verified source links</p>
          </div>
        </div>
      </div>
    </div>
  );
}
