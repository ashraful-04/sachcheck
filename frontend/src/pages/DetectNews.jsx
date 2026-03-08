import { useState, useEffect, useRef } from 'react';
import CONFIG, { MOCK_DETECTIONS } from '../config/config';
import { sleep, getMockResult } from '../utils/helpers';

const SAMPLES = [
  'ISRO launches Chandrayaan-4 mission',
  'NASA confirms aliens discovered in Himalayan cave',
  'India launches new satellite for climate monitoring',
  'WhatsApp will start charging ₹50/month from next week',
  'Government secretly installing surveillance chips in Aadhaar cards',
];

export default function DetectNews({ onToast }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([0, 0, 0]); // 0 = idle, 1 = active, 2 = done
  const resultRef = useRef(null);

  const charCount = input.length;

  const handleInputChange = (e) => {
    const val = e.target.value.slice(0, 1000);
    setInput(val);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  const useSample = (text) => {
    setInput(text);
    setResult(null);
  };

  const handleDetect = async () => {
    const text = input.trim();
    if (!text) {
      onToast('Please enter a news headline or text to analyze.');
      return;
    }

    setLoading(true);
    setResult(null);
    setSteps([1, 0, 0]);

    // Animate loading steps
    setTimeout(() => setSteps([2, 1, 0]), 800);
    setTimeout(() => setSteps([2, 2, 1]), 1600);
    setTimeout(() => setSteps([2, 2, 2]), 2200);

    try {
      let data;

      if (CONFIG.DEMO_MODE) {
        await sleep(2500);
        data = getMockResult(text, MOCK_DETECTIONS);
      } else {
        const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.ENDPOINTS.DETECT}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error('Backend error');
        data = await response.json();
      }

      setResult(data);
    } catch (err) {
      console.error('Detection error:', err);
      onToast('Could not connect to backend. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to result when it appears
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleShare = () => {
    if (!result) return;
    const shareText = `🔍 SachCheck Result:\n"${input}"\n\n📊 Verdict: ${result.verdict}\n💯 Confidence: ${Math.round(result.confidence * 100)}%\n\nCheck your news at SachCheck!`;
    if (navigator.share) {
      navigator.share({ title: 'SachCheck Result', text: shareText });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      onToast('Result copied to clipboard!');
    }
  };

  const getStepIcon = (state) => {
    if (state === 2) return 'fas fa-check-circle';
    if (state === 1) return 'fas fa-circle-notch fa-spin';
    return 'fas fa-circle-notch';
  };

  const getStepClass = (state) => {
    if (state === 2) return 'loading-step done';
    if (state === 1) return 'loading-step active';
    return 'loading-step';
  };

  const confPercent = result ? Math.round(result.confidence * 100) : 0;
  const type = result?.type || 'uncertain';

  const iconMap = {
    real: 'fas fa-check-circle',
    fake: 'fas fa-times-circle',
    uncertain: 'fas fa-question-circle',
  };

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-search-plus"></i> Detect Fake News
        </h2>
        <p className="section-desc">
          Paste any news headline or social media message below to check if it's real or fake.
        </p>

        <div className="detect-wrapper">
          {/* Left: Input Area */}
          <div className="detect-input-area">
            <div className="input-card">
              <div className="input-header">
                <i className="fas fa-edit"></i> Enter News Text
              </div>
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="e.g. Government secretly installing surveillance chips in new Aadhaar cards..."
                rows={5}
              />
              <div className="input-footer">
                <span className="char-count">
                  <span>{charCount}</span> / 1000 characters
                </span>
                <div className="input-actions">
                  <button className="btn btn-secondary" onClick={handleClear}>
                    <i className="fas fa-eraser"></i> Clear
                  </button>
                  <button className="btn btn-primary" onClick={handleDetect} disabled={loading}>
                    <i className="fas fa-search"></i> Analyze
                  </button>
                </div>
              </div>
            </div>

            <div className="samples-card">
              <div className="samples-header">
                <i className="fas fa-lightbulb"></i> Try these examples:
              </div>
              <div className="sample-chips">
                {SAMPLES.map((s) => (
                  <button className="chip" key={s} onClick={() => useSample(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Result Area */}
          <div className="detect-result-area">
            {/* Loading */}
            {loading && (
              <div className="result-loading">
                <div className="loader">
                  <div className="loader-ring"></div>
                  <i className="fas fa-robot loader-icon"></i>
                </div>
                <p>Analyzing news article...</p>
                <div className="loading-steps">
                  <div className={getStepClass(steps[0])}>
                    <i className={getStepIcon(steps[0])}></i> Checking trusted sources...
                  </div>
                  <div className={getStepClass(steps[1])}>
                    <i className={getStepIcon(steps[1])}></i> Running AI classification...
                  </div>
                  <div className={getStepClass(steps[2])}>
                    <i className={getStepIcon(steps[2])}></i> Generating report...
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div className="result-card" ref={resultRef}>
                <div className={`result-header ${type}`}>
                  <div className="result-icon">
                    <i className={iconMap[type]}></i>
                  </div>
                  <div className="result-verdict">
                    <h3>{result.verdict}</h3>
                    <span className="result-method">{result.method}</span>
                  </div>
                </div>

                <div className="result-body">
                  {/* Confidence */}
                  <div className="confidence-section">
                    <div className="confidence-label">
                      <span>Confidence Score</span>
                      <span>{confPercent}%</span>
                    </div>
                    <div className="confidence-bar">
                      <div
                        className={`confidence-fill ${type}`}
                        style={{ width: `${confPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="reasoning-section">
                    <h4><i className="fas fa-brain"></i> Reasoning</h4>
                    <p>{result.reasoning}</p>
                  </div>

                  {/* Keywords */}
                  {result.keywords && result.keywords.length > 0 && (
                    <div className="keywords-section">
                      <h4><i className="fas fa-tags"></i> Influential Keywords</h4>
                      <div className="keyword-tags">
                        {result.keywords.map((k) => (
                          <span className="keyword-tag" key={k}>{k}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sources */}
                  {result.sources && result.sources.length > 0 && (
                    <div className="sources-section">
                      <h4><i className="fas fa-link"></i> Verified Sources</h4>
                      <div className="source-list">
                        {result.sources.map((s) => (
                          <div className="source-item" key={s.name}>
                            <i className="fas fa-check-circle"></i>
                            <span>{s.name}</span>
                            <a href={s.url} target="_blank" rel="noopener noreferrer">
                              Visit <i className="fas fa-external-link-alt"></i>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="result-footer">
                  <button className="btn btn-secondary" onClick={() => { setResult(null); }}>
                    <i className="fas fa-redo"></i> Check Another
                  </button>
                  <button className="btn btn-outline" onClick={handleShare}>
                    <i className="fas fa-share-alt"></i> Share Result
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
