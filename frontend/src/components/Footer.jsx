export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>
            <i className="fas fa-shield-alt"></i> Sach
            <span className="highlight">Check</span>
          </h3>
          <p>AI-Based Fake News Detection for Indian Social Media Content</p>
         
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <button className="footer-link" onClick={() => onNavigate('home')}>Home</button>
          <button className="footer-link" onClick={() => onNavigate('detect')}>Detect News</button>
          <button className="footer-link" onClick={() => onNavigate('trending')}>Trending</button>
          <button className="footer-link" onClick={() => onNavigate('credibility')}>Source Check</button>
        </div>
        <div className="footer-tech">
          <h4>Technology</h4>
          <p>Frontend: React, Vite</p>
          <p>Backend: Python, Flask</p>
          <p>ML: Scikit-learn, TF-IDF</p>
          <p>Dataset: BharatFakeNewsKosh</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 SachCheck.</p>
      </div>
    </footer>
  );
}
