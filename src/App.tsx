import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';
import type { TileDef, Suit } from './lib/tiles';
import { validateHand } from './lib/validator';
import MahjongHand from './components/MahjongHand';
import TileKeyboard from './components/TileKeyboard';
import MahjongRules from './components/MahjongRules';

function AppContent() {
  const [selectedTiles, setSelectedTiles] = useState<TileDef[]>([]);
  const [activeFilter, setActiveFilter] = useState<Suit | 'All'>('All');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const validation = useMemo(() => validateHand(selectedTiles), [selectedTiles]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (validation.isValid) {
      document.body.classList.add('is-winning');
    } else {
      document.body.classList.remove('is-winning');
    }
  }, [validation.isValid]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addTile = (tile: TileDef) => {
    // Count current occurrences of this tile
    const currentCount = selectedTiles.filter(t => t.id === tile.id).length;

    // Check if adding this tile would exceed the limit of 4
    if (currentCount >= 4) {
      // Don't add the tile if we already have 4 of this type
      return;
    }

    setSelectedTiles([...selectedTiles, tile]);
  };

  const removeTile = (index: number) => {
    const newTiles = [...selectedTiles];
    newTiles.splice(index, 1);
    setSelectedTiles(newTiles);
  };

  const reorderTiles = (oldIndex: number, newIndex: number) => {
    setSelectedTiles((prev) => {
      if (oldIndex < 0 || newIndex < 0) return prev;
      const result = [...prev];
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });
  };

  const clearHand = () => {
    if (confirm('Are you sure you want to clear your hand?')) {
      setSelectedTiles([]);
    }
  };

  const location = useLocation();

  return (
    <div className="app-container">
      <nav style={{
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(var(--bg-secondary-rgb), 0.8)',
        backgroundColor: 'var(--bg-secondary)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: 28,
            height: 28,
            backgroundColor: 'var(--accent-primary)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            color: '#fff',
            boxShadow: validation.isValid ? '0 0 15px var(--accent-primary)' : 'none'
          }}>🀄</div>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', display: 'none' }}>MAHJONG</span>
          <span className="mobile-only" style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>MAHJONG</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link
            to="/"
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: location.pathname === '/' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              background: location.pathname === '/' ? 'var(--accent-primary)' : 'transparent',
              color: location.pathname === '/' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.65rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Builder
          </Link>
          <Link
            to="/rules"
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: location.pathname === '/rules' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              background: location.pathname === '/rules' ? 'var(--accent-primary)' : 'transparent',
              color: location.pathname === '/rules' ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.65rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            Rules
          </Link>
          <div style={{ flex: 1 }}></div> {/* This pushes everything else to the right */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {location.pathname === '/' ? (
          <>
            <header className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <h1 style={{ letterSpacing: '-0.03em' }}>Mahjong Hand Builder</h1>
              <p className="subtitle">Build your winning hand with our tool!</p>
            </header>

            <section style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <MahjongHand
                tiles={selectedTiles}
                onRemoveTile={removeTile}
                onReorderTiles={reorderTiles}
                isValid={validation.isValid}
                invalidTiles={validation.invalidTiles}
              />

              <div style={{
                padding: '0.6rem 0.8rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: validation.isValid ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                border: `1px solid ${validation.isValid ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <span>{validation.isValid ? '✅' : 'ℹ️'}</span>
                <span style={{
                  fontWeight: 600,
                  color: validation.isValid ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}>
                  {validation.reason}
                </span>
              </div>

              <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '0.5rem 0' }}></div>

              <TileKeyboard
                onTileClick={addTile}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                currentTiles={selectedTiles}
                onClearHand={clearHand}
              />
            </section>
          </>
        ) : (
          <MahjongRules />
        )}
      </main>

      <footer style={{
        padding: '2rem 1rem',
        textAlign: 'center',
        color: 'var(--text-primary)',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto',
        backgroundColor: 'var(--bg-tertiary)',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '1.25rem' }}>
          <span>🀇</span><span>🀙</span><span>🀐</span><span>🀀</span><span>🀢</span>
        </div>
        <p style={{ fontSize: '0.75rem' }}>&copy; {new Date().getFullYear()} Mahjong Hands • mahjong.sagelga.com</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/rules" element={<MahjongRules />} />
      </Routes>
    </Router>
  );
}
