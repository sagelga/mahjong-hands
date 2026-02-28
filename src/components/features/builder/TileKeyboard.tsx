import { MAHJONG_TILES } from '../../../lib/tiles';
import type { TileDef, Suit } from '../../../lib/tiles';
import './TileKeyboard.css';
import SuitFilterBar from './SuitFilterBar';
import TileGrid from './TileGrid';
import LearnPromo from './LearnPromo';

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
      <SuitFilterBar activeFilter={activeFilter} onFilterChange={onFilterChange} />
      <TileGrid
        key={activeFilter}
        filteredTiles={filteredTiles}
        activeFilter={activeFilter}
        currentTiles={currentTiles}
        onTileClick={onTileClick}
      />
      <LearnPromo />
    </div>
  );
}
