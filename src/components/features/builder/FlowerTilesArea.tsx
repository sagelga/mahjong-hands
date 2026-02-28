import type { TileDef } from '../../../lib/tiles';
import SortableTile from './SortableTile';
import './MahjongHand.css';

interface Props {
  flowerTiles: { tile: TileDef; index: number }[];
  onRemoveTile: (index: number) => void;
  isValid: boolean;
}

export default function FlowerTilesArea({ flowerTiles, onRemoveTile, isValid }: Props) {
  if (flowerTiles.length === 0) return null;

  return (
    <div className="hand-flowers-area">
      <div className="flower-area-label">Flowers</div>
      <div className="flower-tiles-row">
        {flowerTiles.map(({ tile, index }) => (
          <SortableTile
            key={`tile-${index}-${tile.id}`}
            id={`tile-${index}-${tile.id}`}
            tile={tile}
            index={index}
            onRemove={onRemoveTile}
            isValid={isValid}
            isInvalidTile={false}
          />
        ))}
      </div>
    </div>
  );
}
