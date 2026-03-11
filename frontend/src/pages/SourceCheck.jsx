import { useState } from 'react';
import CONFIG, { TRUSTED_SOURCES, SUSPICIOUS_SOURCES } from '../config/config';
import { checkCredibility } from '../services/api';

export default function SourceCheck({ onToast }) {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSource = async () => {
    let d = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, '');
    if (!d) {
      onToast('Please enter a website domain to check.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      if (CONFIG.DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 500));
        const trusted = TRUSTED_SOURCES.find((s) => s.domain === d);
        const suspicious = SUSPICIOUS_SOURCES.find((s) => s.domain === d);
        if (trusted) {
          setResult({ status: 'trusted', domain: d, message: `${trusted.name} — ${trusted.description}` });
        } else if (suspicious) {
          setResult({ status: 'suspicious', domain: d, message: `${suspicious.name} — ${suspicious.description}` });
        } else {
          setResult({ status: 'unknown', domain: d, message: 'This source is not in our database. Exercise caution and cross-verify news from multiple sources.' });
        }
      } else {
        const data = await checkCredibility(d);
        setResult(data);
      }
    } catch (err) {
      console.error('Credibility error:', err);
      onToast('Could not check source. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') checkSource();
  };

  const statusIcon = {
    trusted: 'fas fa-shield-alt',
    suspicious: 'fas fa-exclamation-triangle',
    unknown: 'fas fa-question-circle',
  };

  const statusLabel = {
    trusted: 'Trusted Source',
    suspicious: 'Suspicious Source',
    unknown: 'Unknown Source',
  };

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-shield-alt"></i> Source Credibility
        </h2>
        <p className="section-desc">
          Check the credibility of a news source to determine its trustworthiness.
        </p>

        {/* Input */}
        <div className="source-check-card">
          <div className="search-bar">
            <i className="fas fa-globe search-icon"></i>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. ndtv.com, thewire.in"
            />
            <button className="btn btn-primary" onClick={checkSource} disabled={loading}>
              {loading ? <><i className="fas fa-circle-notch fa-spin"></i> Checking</> : 'Check'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`source-result ${result.status}`}>
            <div className="source-result-icon">
              <i className={statusIcon[result.status]}></i>
            </div>
            <div className="source-result-info">
              <h3>{statusLabel[result.status]}</h3>
              <span className="source-domain">{result.domain}</span>
              <p>{result.message}</p>
            </div>
          </div>
        )}

        {/* Lists */}
        <div className="source-lists">
          <div className="source-list-card trusted">
            <h3><i className="fas fa-check-circle"></i> Trusted Sources</h3>
            <div className="source-tag-grid">
              {TRUSTED_SOURCES.map((s) => (
                <span
                  className="source-tag trusted"
                  key={s.domain}
                  onClick={() => { setDomain(s.domain); }}
                  title={s.description}
                >
                  {s.domain}
                </span>
              ))}
            </div>
          </div>

          <div className="source-list-card suspicious">
            <h3><i className="fas fa-exclamation-triangle"></i> Suspicious Sources</h3>
            <div className="source-tag-grid">
              {SUSPICIOUS_SOURCES.map((s) => (
                <span
                  className="source-tag suspicious"
                  key={s.domain}
                  onClick={() => { setDomain(s.domain); }}
                  title={s.description}
                >
                  {s.domain}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
