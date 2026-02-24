import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import type { TileDef, Suit } from './lib/tiles';
import { validateHand } from './lib/validator';
import MahjongHand from './components/MahjongHand';
import TileKeyboard from './components/TileKeyboard';
import MahjongRules from './components/MahjongRules';
import Layout from './components/Layout';

function Typewriter({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
      }
    }, 30);
    return () => clearInterval(intervalId);
  }, [text]);

  return <>{displayedText}<span className="cursor-blink validation-cursor">|</span></>;
}

function AppContent() {
  const [selectedTiles, setSelectedTiles] = useState<TileDef[]>([]);
  const [activeFilter, setActiveFilter] = useState<Suit | 'All'>('All');
  const validation = useMemo(() => validateHand(selectedTiles), [selectedTiles]);

  useEffect(() => {
    if (validation.isValid) {
      document.body.classList.add('is-winning');
    } else {
      document.body.classList.remove('is-winning');
    }
  }, [validation.isValid]);

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
    <>
      {location.pathname === '/' ? (
        <>
          <header className="animate-fade-in header-centered">
            <h1 className="header-title">Mahjong Hand Builder</h1>
            <p className="subtitle">Build your winning hand with our tool!</p>
          </header>

          <section className="section-full-width">
            <MahjongHand
              tiles={selectedTiles}
              onRemoveTile={removeTile}
              onReorderTiles={reorderTiles}
              isValid={validation.isValid}
              invalidTiles={validation.invalidTiles}
              onClearHand={clearHand}
            />

            <div className={`validation-message ${validation.isValid ? 'valid' : 'invalid'}`}>
              <span className={`validation-message-icon ${validation.isValid ? 'valid' : 'invalid'}`}>{validation.isValid ? '✅' : 'ℹ️'}</span>
              <span className={`validation-message-text ${validation.isValid ? 'valid' : 'invalid'}`}>
                <Typewriter text={validation.reason} />
              </span>
            </div>

            <div className="separator"></div>

            <TileKeyboard
              onTileClick={addTile}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              currentTiles={selectedTiles}
            />
          </section>
        </>
      ) : (
        <MahjongRules />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/rules" element={<MahjongRules />} />
        </Routes>
      </Layout>
    </Router>
  );
}
