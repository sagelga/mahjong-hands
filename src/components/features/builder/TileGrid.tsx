import type { TileDef } from '../../../lib/tiles';
import type { Suit } from '../../../lib/tiles';
import './TileKeyboard.css';

interface Props {
  filteredTiles: TileDef[];
  activeFilter: Suit | 'All';
  currentTiles: TileDef[];
  onTileClick: (tile: TileDef) => void;
}

export default function TileGrid({ filteredTiles, activeFilter, currentTiles, onTileClick }: Props) {
  const isFlowerTile = (tileId: string): boolean => tileId.startsWith('f');

  return (
    <div key={activeFilter} className="glass-panel keyboard-grid">
      {filteredTiles.map((tile, i) => {
        const currentCount = currentTiles.filter(t => t.id === tile.id).length;
        const maxLimit = isFlowerTile(tile.id) ? 1 : 4;
        const isAtLimit = currentCount >= maxLimit;

        return (
          <button
            key={tile.id}
            onClick={() => !isAtLimit && onTileClick(tile)}
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
  );
}
