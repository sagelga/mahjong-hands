import './MahjongRules.css';
import { useState } from 'react';
import TileKeyboard from '../builder/TileKeyboard';
import type { Suit } from '../../../lib/tiles';

export default function TileSetViewer() {
  const [activeFilter, setActiveFilter] = useState<Suit | 'All'>('Dots');
  return (
    <div className="tile-set-viewer">
      <TileKeyboard
        onTileClick={() => {}}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        currentTiles={[]}
      />
    </div>
  );
}
