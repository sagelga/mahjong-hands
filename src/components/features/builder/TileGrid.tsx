import { memo, useMemo } from 'react';
import type { TileDef, Suit } from '../../../lib/tiles';
import './TileKeyboard.css';

const SUIT_GROUPS: Array<{ suit: Suit; mark: string; label: string }> = [
  { suit: 'Characters', mark: '万', label: 'Characters' },
  { suit: 'Dots', mark: '筒', label: 'Dots' },
  { suit: 'Bamboo', mark: '条', label: 'Bamboo' },
  { suit: 'Honors', mark: '字', label: 'Honors' },
  { suit: 'Flowers', mark: '花', label: 'Flowers' },
];

const SHORT_LABELS: Record<string, string> = {
  h1: 'East',
  h2: 'South',
  h3: 'West',
  h4: 'North',
  h5: 'White',
  h6: 'Green',
  h7: 'Red',
  f1: 'Plum',
  f2: 'Orchid',
  f3: 'Chrys.',
  f4: 'Bamboo',
  f5: 'Spring',
  f6: 'Summer',
  f7: 'Autumn',
  f8: 'Winter',
};

function getShortLabel(tile: TileDef): string {
  return SHORT_LABELS[tile.id] ?? String(tile.value);
}

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

  const groups = useMemo(
    () => activeFilter === 'All'
      ? SUIT_GROUPS
      : SUIT_GROUPS.filter(group => group.suit === activeFilter),
    [activeFilter]
  );

  return (
    <div className={`tray-groups ${activeFilter !== 'All' ? 'tray-groups--single' : ''}`}>
      {groups.map((group, groupIndex) => {
        const tiles = filteredTiles.filter(tile => tile.suit === group.suit);

        return (
          <section
            key={group.suit}
            className={`tray-suit ${group.suit === 'Flowers' ? 'tray-suit--flowers' : ''}`}
            aria-label={group.label}
          >
            <div className="tray-suit__head">
              <span className="tray-suit__han" aria-hidden="true">{group.mark}</span>
              <span className="tray-suit__name">{group.label}</span>
            </div>
            <div className="tray-suit__tiles">
              {tiles.map(tile => {
                const currentCount = tileCountMap.get(tile.id) ?? 0;
                const maxLimit = tile.id.startsWith('f') ? 1 : 4;
                const isAtLimit = currentCount >= maxLimit;

                return (
                  <button
                    key={tile.id}
                    type="button"
                    onClick={() => { if (!isAtLimit) onTileClick(tile); }}
                    title={`${tile.name}${isAtLimit ? ' (Limit reached)' : ''}`}
                    aria-label={`Add ${tile.name}`}
                    aria-disabled={isAtLimit || undefined}
                    className={`tray-tile ${isAtLimit ? 'tray-tile--at-limit' : ''}`}
                  >
                    <img
                      src={tile.image}
                      alt=""
                      className="tray-tile__img"
                      width={54}
                      height={74}
                      decoding="async"
                      loading={groupIndex < 2 ? 'eager' : 'lazy'}
                    />
                    {currentCount > 0 && (
                      <span className="tray-tile__count" aria-hidden="true">{currentCount}</span>
                    )}
                    <span className="tray-tile__short" aria-hidden="true">{getShortLabel(tile)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
});
