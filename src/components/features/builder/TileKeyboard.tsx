import { Link } from 'react-router-dom';
import { BookOpen, Scale, Lightbulb, ArrowRight } from 'lucide-react';
import { MAHJONG_TILES, SUITS } from '../../../lib/tiles';
import './TileKeyboard.css';

import type { TileDef, Suit } from '../../../lib/tiles';

interface Props {
  onTileClick: (tile: TileDef) => void;
  activeFilter: Suit | 'All';
  onFilterChange: (filter: Suit | 'All') => void;
  currentTiles: TileDef[];
}

export default function TileKeyboard({ onTileClick, activeFilter, onFilterChange, currentTiles }: Props) {
  const filteredTiles = activeFilter === 'All'
    ? MAHJONG_TILES
    : MAHJONG_TILES.filter(t => t.suit === activeFilter);

  // Helper function to determine if a tile is a flower
  const isFlowerTile = (tileId: string): boolean => {
    return tileId.startsWith('f');
  };

  return (
    <div className="keyboard-container">
      {/* Filter Bar */}
      <div className="glass-panel filter-bar">
        {['All', ...SUITS].map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter as Suit | 'All')}
            className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
          >
            {filter === 'Characters' ? 'Characters' :
             filter === 'Dots' ? 'Dots' :
             filter === 'Bamboo' ? 'Bamboo' :
             filter.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Keyboard Grid */}
      <div key={activeFilter} className="glass-panel keyboard-grid">
        {filteredTiles.map((tile, i) => {
          const currentCount = currentTiles.filter(t => t.id === tile.id).length;

          // Flowers have a limit of 1, other tiles have a limit of 4
          const maxLimit = isFlowerTile(tile.id) ? 1 : 4;
          const isAtLimit = currentCount >= maxLimit;

          return (
            <button
              key={tile.id}
              onClick={() => !isAtLimit && onTileClick(tile)} // Disable click if at limit
              title={`${tile.name}${isAtLimit ? ' (Limit reached)' : ''}`}
              className={`keyboard-tile-button ${isAtLimit ? 'at-limit' : ''}`}
              style={{ animationDelay: `${i * 18}ms` }}
            >
              <img
                src={tile.image}
                alt={tile.name}
                className={`keyboard-tile-image ${isAtLimit ? 'at-limit' : ''}`}
              />
              <span className={`keyboard-tile-label ${isAtLimit ? 'at-limit' : ''}`}>
                {tile.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="learn-promo">
        <div className="learn-promo-inner">
          <div className="learn-promo-text">
            <p className="learn-promo-eyebrow">New to Mahjong?</p>
            <p className="learn-promo-headline">Learn to play — tiles, rules, and strategy</p>
          </div>
          <div className="learn-promo-links">
            <Link to="/learn/rules" className="learn-promo-chip">
              <BookOpen size={13} />
              Rules
            </Link>
            <Link to="/learn/scoring" className="learn-promo-chip">
              <Scale size={13} />
              Scoring
            </Link>
            <Link to="/learn/strategy" className="learn-promo-chip">
              <Lightbulb size={13} />
              Strategy
            </Link>
          </div>
          <Link to="/learn" className="learn-promo-cta">
            Start Learning
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
