import { formatDate } from '../utils/helpers';

export default function NewsCard({ article }) {
  const handleClick = () => {
    window.open(article.url, '_blank', 'noopener');
  };

  return (
    <div className="news-card" onClick={handleClick}>
      <img
        className="news-card-img"
        src={article.urlToImage || 'https://placehold.co/400x200/1E293B/64748B?text=No+Image'}
        alt={article.title}
        onError={(e) => {
          e.target.src = 'https://placehold.co/400x200/1E293B/64748B?text=No+Image';
        }}
      />
      <div className="news-card-body">
        <div className="news-card-source">{article.source || 'Unknown'}</div>
        <h3 className="news-card-title">{article.title}</h3>
        <p className="news-card-desc">{article.description || ''}</p>
        <div className="news-card-meta">
          <span className="news-card-date">
            <i className="fas fa-clock"></i>
            {formatDate(article.publishedAt)}
          </span>
          <span className="news-card-read">Read more →</span>
        </div>
      </div>
    </div>
  );
}
