import { MAHJONG_TILES, SUITS } from '../lib/tiles';
import type { TileDef, Suit } from '../lib/tiles';

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
      <div className="glass-panel keyboard-grid">
        {filteredTiles.map(tile => {
          const currentCount = currentTiles.filter(t => t.id === tile.id).length;
          const isAtLimit = currentCount >= 4;

          return (
            <button
              key={tile.id}
              onClick={() => !isAtLimit && onTileClick(tile)} // Disable click if at limit
              title={`${tile.name}${isAtLimit ? ' (Limit reached: 4)' : ''}`}
              className={`keyboard-tile-button ${isAtLimit ? 'at-limit' : ''}`}
            >
              <img
                src={tile.image}
                alt={tile.name}
                className={`keyboard-tile-image ${isAtLimit ? 'at-limit' : ''}`}
              />
              <span className={`keyboard-tile-label ${isAtLimit ? 'at-limit' : ''}`}>
                {tile.name}{isAtLimit && ' (4)'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
