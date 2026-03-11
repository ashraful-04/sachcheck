import { useState } from 'react';
import CONFIG, { MOCK_TRENDING_NEWS } from '../config/config';
import NewsCard from '../components/NewsCard';
import { searchNews } from '../services/api';

const SUGGESTIONS = [
  'Chandrayaan Mission',
  'Indian Economy 2025',
  'Cricket World Cup',
  'ISRO Launch',
  'Digital India',
  'Artificial Intelligence',
];

export default function SearchNews({ onToast }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = async (q) => {
    const term = q || query.trim();
    if (!term) {
      onToast('Please enter a search term.');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      if (CONFIG.DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 700));
        const lower = term.toLowerCase();
        const filtered = MOCK_TRENDING_NEWS.filter(
          (a) =>
            a.title.toLowerCase().includes(lower) ||
            (a.description && a.description.toLowerCase().includes(lower))
        );
        setResults(filtered.length ? filtered : MOCK_TRENDING_NEWS.slice(0, 3));
      } else {
        const articles = await searchNews(term);
        setResults(articles);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      onToast('Search failed. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') doSearch();
  };

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-search"></i> Search News
        </h2>
        <p className="section-desc">
          Search for specific news topics and verify their authenticity.
        </p>

        {/* Search bar */}
        <div className="search-bar-wrap">
          <div className="search-bar">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for news topics..."
            />
            <button className="btn btn-primary" onClick={() => doSearch()}>
              Search
            </button>
          </div>
        </div>

        {/* Quick suggestions */}
        {!searched && (
          <div className="search-suggestions">
            <span>Quick search:</span>
            <div className="suggestion-chips">
              {SUGGESTIONS.map((s) => (
                <button
                  className="chip"
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    doSearch(s);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map((i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-search"></i>
            <p>No results found for "{query}". Try different keywords.</p>
          </div>
        ) : (
          results.length > 0 && (
            <div className="news-grid">
              {results.map((article, idx) => (
                <NewsCard key={idx} article={article} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
