import { useState, useEffect } from 'react';
import CONFIG, { MOCK_TRENDING_NEWS } from '../config/config';
import NewsCard from '../components/NewsCard';
import { getTopNews } from '../services/api';

const CATEGORIES = [
  { id: 'general', label: 'General', icon: 'fas fa-newspaper' },
  { id: 'technology', label: 'Technology', icon: 'fas fa-laptop-code' },
  { id: 'sports', label: 'Sports', icon: 'fas fa-futbol' },
  { id: 'health', label: 'Health', icon: 'fas fa-heartbeat' },
  { id: 'business', label: 'Business', icon: 'fas fa-chart-line' },
  { id: 'science', label: 'Science', icon: 'fas fa-flask' },
];

export default function Trending() {
  const [category, setCategory] = useState('general');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrending = async (cat) => {
    setLoading(true);
    try {
      if (CONFIG.DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 600));
        const filtered =
          cat === 'general'
            ? MOCK_TRENDING_NEWS
            : MOCK_TRENDING_NEWS.filter(
                (a) => a.category?.toLowerCase() === cat
              );
        setNews(filtered.length ? filtered : MOCK_TRENDING_NEWS);
      } else {
        // Backend /top-news uses a keyword query; pass category as the query term
        const articles = await getTopNews(cat === 'general' ? 'india' : cat);
        setNews(articles);
      }
    } catch (err) {
      console.error('Trending error:', err);
      setNews(MOCK_TRENDING_NEWS); // fallback to mock on error
      onToast?.('Could not load trending news. Showing cached data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending(category);
  }, [category]);

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">
          <i className="fas fa-fire"></i> Trending News
        </h2>
        <p className="section-desc">
          Browse the latest trending news from verified Indian sources.
        </p>

        {/* Category filters */}
        <div className="category-filters">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`category-btn ${category === c.id ? 'active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              <i className={c.icon}></i> {c.label}
            </button>
          ))}
        </div>

        {/* News grid */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="skeleton-card" key={i}>
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-inbox"></i>
            <p>No trending news found for this category.</p>
          </div>
        ) : (
          <div className="news-grid">
            {news.map((article, idx) => (
              <NewsCard key={idx} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
