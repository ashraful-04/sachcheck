import { useState } from 'react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'fa-home' },
  { id: 'detect', label: 'Detect News', icon: 'fa-search-plus' },
  { id: 'trending', label: 'Trending', icon: 'fa-fire' },
  { id: 'search', label: 'Search News', icon: 'fa-newspaper' },
  { id: 'credibility', label: 'Source Check', icon: 'fa-check-circle' },
];

export default function Navbar({ activePage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo" onClick={() => handleNav('home')}>
          <i className="fas fa-shield-alt"></i>
          <span>Sach<span className="highlight">Check</span></span>
        </div>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link${activePage === item.id ? ' active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <i className={`fas ${item.icon}`}></i> {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
