import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
    <div className="app-container">
      <nav className="nav-container">
        <div className="nav-logo-container">
          <div className="nav-logo">🀄</div>
          <span className="nav-hidden-title">MAHJONG</span>
          <span className="nav-mobile-title">MAHJONG</span>
        </div>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Builder
          </Link>
          <Link
            to="/rules"
            className={`nav-link ${location.pathname === '/rules' ? 'active' : ''}`}
          >
            Rules
          </Link>
          <div className="nav-link-flex-spacer"></div> {/* This pushes everything else to the right */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer-container">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Mahjong Hands • mahjong.sagelga.com</p>
        <p className="footer-attribution">
          Mahjong tile images sourced from Wikipedia under CC BY-SA 3.0
        </p>
      </footer>
    </div>
  );
}
