import { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import DetectNews from './pages/DetectNews';
import Trending from './pages/Trending';
import SearchNews from './pages/SearchNews';
import SourceCheck from './pages/SourceCheck';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [toast, setToast] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('sachcheck-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('sachcheck-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = useCallback(() => setDarkMode((prev) => !prev), []);

  const navigate = useCallback((page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = useCallback((msg) => {
    setToast('');
    // Small delay so component re-mounts when firing consecutive toasts
    setTimeout(() => setToast(msg), 50);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={navigate} />;
      case 'detect':
        return <DetectNews onToast={showToast} />;
      case 'trending':
        return <Trending />;
      case 'search':
        return <SearchNews onToast={showToast} />;
      case 'credibility':
        return <SourceCheck onToast={showToast} />;
      default:
        return <Home onNavigate={navigate} />;
    }
  };

  return (
    <>
      <Navbar activePage={activePage} onNavigate={navigate} darkMode={darkMode} onToggleTheme={toggleTheme} />
      <main>{renderPage()}</main>
      <Footer onNavigate={navigate} />
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </>
  );
}
