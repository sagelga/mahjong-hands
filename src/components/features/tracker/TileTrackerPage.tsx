import { useState, useMemo, useCallback, useEffect } from 'react';
import { MAHJONG_TILES, type TileDef } from '../../../lib/tiles';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import './TileTrackerPage.css';

type TrackerSuit = 'Characters' | 'Dots' | 'Bamboo' | 'Honors';

const TRACKER_SUITS: { key: TrackerSuit; label: string }[] = [
  { key: 'Characters', label: 'Characters' },
  { key: 'Dots', label: 'Dots' },
  { key: 'Bamboo', label: 'Bamboo' },
  { key: 'Honors', label: 'Honors' },
];

const SUIT_PREFIX: Record<TrackerSuit, string> = {
  Characters: 'c',
  Dots: 'd',
  Bamboo: 'b',
  Honors: 'h',
};

const HONOR_LABELS: Record<number, string> = {
  1: '東',
  2: '南',
  3: '西',
  4: '北',
  5: '白',
  6: '發',
  7: '中',
};

// All non-flower tiles, grouped by suit for the tracker board
const BOARD_TILES: { suit: TrackerSuit; tiles: TileDef[] }[] = TRACKER_SUITS.map(({ key }) => ({
  suit: key,
  tiles: MAHJONG_TILES.filter(t => t.suit === key),
}));

// ─── TrackerTile ────────────────────────────────────────────────────────────
function TrackerTile({ tile, remaining }: { tile: TileDef; remaining: number }) {
  const stateClass =
    remaining === 0 ? 'tracker-tile--exhausted' :
    remaining === 1 ? 'tracker-tile--danger' :
    remaining === 2 ? 'tracker-tile--warning' :
    remaining === 3 ? 'tracker-tile--dim' :
    '';

  return (
    <div className={`tracker-tile ${stateClass}`}>
      <img src={tile.image} alt={tile.name} className="tracker-tile-img" />
      <span className="tracker-tile-count">{remaining}</span>
    </div>
  );
}

// ─── TrackerBoard ───────────────────────────────────────────────────────────
function TrackerBoard({ seenCounts }: { seenCounts: Record<string, number> }) {
  return (
    <div className="tracker-board">
      {BOARD_TILES.map(({ suit, tiles }) => (
        <div key={suit} className="tracker-suit-row">
          <span className="tracker-suit-label">{suit}</span>
          <div className="tracker-suit-tiles">
            {tiles.map(tile => (
              <TrackerTile
                key={tile.id}
                tile={tile}
                remaining={4 - (seenCounts[tile.id] ?? 0)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SuitSelector ───────────────────────────────────────────────────────────
function SuitSelector({
  activeSuit,
  onSuitChange,
}: {
  activeSuit: TrackerSuit;
  onSuitChange: (suit: TrackerSuit) => void;
}) {
  return (
    <div className="tracker-suit-selector">
      {TRACKER_SUITS.map(({ key, label }) => (
        <button
          key={key}
          className={`tracker-suit-btn ${activeSuit === key ? 'active' : ''}`}
          onClick={() => onSuitChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Numpad ─────────────────────────────────────────────────────────────────
function Numpad({
  activeSuit,
  seenCounts,
  onRecord,
}: {
  activeSuit: TrackerSuit;
  seenCounts: Record<string, number>;
  onRecord: (tileId: string) => void;
}) {
  const isHonors = activeSuit === 'Honors';
  const prefix = SUIT_PREFIX[activeSuit];

  const buttons = useMemo(() =>
    Array.from({ length: 9 }, (_, i) => {
      const num = i + 1;
      const tileId = `${prefix}${num}`;
      const isHidden = isHonors && num > 7;
      const remaining = 4 - (seenCounts[tileId] ?? 0);

      return {
        num,
        tileId,
        label: isHonors ? (HONOR_LABELS[num] ?? '') : String(num),
        disabled: isHidden || remaining <= 0,
        isHidden,
      };
    }),
    [prefix, isHonors, seenCounts],
  );

  return (
    <div className="tracker-numpad">
      {buttons.map(btn => (
        <button
          key={btn.num}
          className={`tracker-numpad-btn ${btn.isHidden ? 'tracker-numpad-btn--hidden' : ''}`}
          disabled={btn.disabled}
          onClick={() => onRecord(btn.tileId)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}

// ─── ActionBar ──────────────────────────────────────────────────────────────
function ActionBar({
  onUndo,
  onReset,
  canUndo,
}: {
  onUndo: () => void;
  onReset: () => void;
  canUndo: boolean;
}) {
  return (
    <div className="tracker-action-bar">
      <button className="tracker-btn-undo" onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>
      <button className="tracker-btn-reset" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function TileTrackerPage() {
  useEffect(() => {
    document.title = 'Tile Tracker - Mahjong Hand Builder';
  }, []);

  const [seenCounts, setSeenCounts] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [activeSuit, setActiveSuit] = useState<TrackerSuit>('Characters');

  const lastAction = useMemo(() => {
    if (history.length === 0) return null;
    const lastId = history[history.length - 1];
    return MAHJONG_TILES.find(t => t.id === lastId) ?? null;
  }, [history]);

  const recordTile = useCallback((tileId: string) => {
    setSeenCounts(prev => {
      const current = prev[tileId] ?? 0;
      if (current >= 4) return prev;
      return { ...prev, [tileId]: current + 1 };
    });
    setHistory(prev => [...prev, tileId]);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const lastId = history[history.length - 1];
    setSeenCounts(prev => {
      const current = prev[lastId] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[lastId];
        return next;
      }
      return { ...prev, [lastId]: current - 1 };
    });
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  const reset = useCallback(() => {
    setSeenCounts({});
    setHistory([]);
  }, []);

  return (
    <PageContent className="tracker-page">
      <PageHeader
        title="Tile Tracker"
        subtitle="Track discarded tiles during a live game."
      />

      <TrackerBoard seenCounts={seenCounts} />

      <div className="tracker-controls">
        <div className="tracker-last-action">
          {lastAction ? (
            <>Last: <span className="tracker-last-action-tile">{lastAction.name}</span></>
          ) : (
            'Select a suit and tap a tile number'
          )}
        </div>

        <SuitSelector activeSuit={activeSuit} onSuitChange={setActiveSuit} />
        <Numpad activeSuit={activeSuit} seenCounts={seenCounts} onRecord={recordTile} />
        <ActionBar onUndo={undo} onReset={reset} canUndo={history.length > 0} />
      </div>
    </PageContent>
  );
}
