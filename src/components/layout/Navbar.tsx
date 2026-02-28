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
  const [learnDropdownOpen, setLearnDropdownOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const learnDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close Learn dropdown on outside click
  useEffect(() => {
    if (!learnDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (learnDropdownRef.current && !learnDropdownRef.current.contains(e.target as Node)) {
        setLearnDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [learnDropdownOpen]);

  // Close on route change
  const location = useLocation();
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
        
        <div className="nav-dropdown-container" ref={learnDropdownRef}>
          <button
            className={`nav-link nav-dropdown-toggle ${location.pathname.startsWith('/learn') ? 'active' : ''}`}
            onClick={() => setLearnDropdownOpen(prev => !prev)}
          >
            Learn
            <svg className="nav-dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          
          <div className={`nav-dropdown-menu ${learnDropdownOpen || menuOpen ? 'open' : ''}`}>
            <Link to="/learn/rules"    className={`nav-dropdown-item ${location.pathname === '/learn/rules' ? 'active' : ''}`}>Rules</Link>
            <Link to="/learn/starting" className={`nav-dropdown-item ${location.pathname === '/learn/starting' ? 'active' : ''}`}>Starting</Link>
            <Link to="/learn/strategy" className={`nav-dropdown-item ${location.pathname === '/learn/strategy' ? 'active' : ''}`}>Strategy</Link>
            <Link to="/learn/scoring"  className={`nav-dropdown-item ${location.pathname === '/learn/scoring' ? 'active' : ''}`}>Scoring</Link>
          </div>
        </div>
        
        <Link to="/glossary" className={`nav-link ${location.pathname === '/glossary' ? 'active' : ''}`}>Glossary</Link>
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
