import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const location = useLocation();

  return (
    <nav className="nav-container">
      <div className="nav-logo-container">
        <div className="nav-logo">MH</div>
        <span className="nav-hidden-title">MAHJONG</span>
      </div>

      <div className="nav-links">
        <Link to="/"         className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Builder</Link>
        <Link to="/rules"    className={`nav-link ${location.pathname === '/rules' ? 'active' : ''}`}>Rules</Link>
        <Link to="/glossary" className={`nav-link ${location.pathname === '/glossary' ? 'active' : ''}`}>Glossary</Link>
        <Link to="/scoring"  className={`nav-link ${location.pathname === '/scoring' ? 'active' : ''}`}>Scoring</Link>
        <Link to="/strategy" className={`nav-link ${location.pathname === '/strategy' ? 'active' : ''}`}>Strategy</Link>
        <Link to="/about"    className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
      </div>

      <div className="nav-right">
        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>
    </nav>
  );
}
