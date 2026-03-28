import { memo, useMemo } from 'react';
import type { TileDef } from '../../../lib/tiles';
import type { Suit } from '../../../lib/tiles';
import './TileKeyboard.css';

interface Props {
  filteredTiles: TileDef[];
  activeFilter: Suit | 'All';
  currentTiles: TileDef[];
  onTileClick: (tile: TileDef) => void;
}

export default memo(function TileGrid({ filteredTiles, activeFilter, currentTiles, onTileClick }: Props) {
  const tileCountMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const tile of currentTiles) {
      map.set(tile.id, (map.get(tile.id) ?? 0) + 1);
    }
    return map;
  }, [currentTiles]);

  return (
    <div key={activeFilter} className="glass-panel keyboard-grid">
      {filteredTiles.map((tile, i) => {
        const currentCount = tileCountMap.get(tile.id) ?? 0;
        const maxLimit = tile.id.startsWith('f') ? 1 : 4;
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
});
