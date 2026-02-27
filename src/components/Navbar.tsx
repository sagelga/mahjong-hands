import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Close on route change
  const location = useLocation();
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <nav className="nav-container" ref={navRef}>
      <div className="nav-logo-container">
        <div className="nav-logo">MH</div>
        <span className="nav-hidden-title">MAHJONG</span>
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
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
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
