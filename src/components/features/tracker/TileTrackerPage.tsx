import { useState, useMemo, useCallback, useEffect, useRef, memo } from 'react';
import { MAHJONG_TILES, type TileDef } from '../../../lib/tiles';
import './TileTrackerPage.css';

type TrackerSuit = 'Characters' | 'Dots' | 'Bamboo' | 'Honors';

const TRACKER_SUITS: { key: TrackerSuit; char: string; label: string }[] = [
  { key: 'Characters', char: '万', label: 'Characters' },
  { key: 'Dots',       char: '筒', label: 'Dots' },
  { key: 'Bamboo',     char: '条', label: 'Bamboo' },
  { key: 'Honors',     char: '字', label: 'Honors' },
];

// O(1) tile lookup
const TILE_MAP = new Map(MAHJONG_TILES.map(t => [t.id, t]));

const BOARD_TILES: { suit: TrackerSuit; char: string; tiles: TileDef[] }[] =
  TRACKER_SUITS.map(({ key, char }) => ({
    suit: key,
    char,
    tiles: MAHJONG_TILES.filter(t => t.suit === key),
  }));

// ─── TrackerTile ─────────────────────────────────────────────────────────────
const TrackerTile = memo(function TrackerTile({
  tile,
  remaining,
  onRecord,
}: {
  tile: TileDef;
  remaining: number;
  onRecord: (id: string) => void;
}) {
  const stateClass =
    remaining === 0 ? 'tracker-tile--exhausted' :
    remaining === 1 ? 'tracker-tile--danger' :
    remaining === 2 ? 'tracker-tile--warning' :
    remaining === 3 ? 'tracker-tile--dim' : '';

  const stateAria =
    remaining === 0 ? ', exhausted' :
    remaining === 1 ? ', final copy' :
    remaining === 2 ? ', running rare' : '';

  return (
    <button
      className={`tracker-tile ${stateClass}`}
      onClick={() => onRecord(tile.id)}
      disabled={remaining <= 0}
      aria-label={`${tile.name}: ${remaining} remaining${stateAria}`}
    >
      <img src={tile.image} alt="" aria-hidden="true" className="tracker-tile-img" />
      <div className="tracker-tile-dots" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <span
            key={i}
            className={`tracker-dot ${i < remaining ? 'tracker-dot--filled' : 'tracker-dot--empty'}`}
          />
        ))}
      </div>
    </button>
  );
});

// ─── TrackerBoard ─────────────────────────────────────────────────────────────
function TrackerBoard({
  seenCounts,
  onRecord,
}: {
  seenCounts: Record<string, number>;
  onRecord: (id: string) => void;
}) {
  return (
    <div className="tracker-board">
      {BOARD_TILES.map(({ suit, char, tiles }) => (
        <div
          key={suit}
          className="tracker-suit-row"
          role="group"
          aria-label={`${suit} tiles`}
        >
          <span className="tracker-suit-label" aria-hidden="true">{char}</span>
          <div className="tracker-suit-tiles">
            {tiles.map(tile => (
              <TrackerTile
                key={tile.id}
                tile={tile}
                remaining={4 - (seenCounts[tile.id] ?? 0)}
                onRecord={onRecord}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── WallStats ────────────────────────────────────────────────────────────────
function WallStats({ seenCounts }: { seenCounts: Record<string, number> }) {
  const { exhausted, danger, warning, totalSeen } = useMemo(() => {
    let exhausted = 0, danger = 0, warning = 0, totalSeen = 0;
    for (const { tiles } of BOARD_TILES) {
      for (const tile of tiles) {
        const r = 4 - (seenCounts[tile.id] ?? 0);
        const seen = seenCounts[tile.id] ?? 0;
        totalSeen += seen;
        if (r === 0) exhausted++;
        else if (r === 1) danger++;
        else if (r === 2) warning++;
      }
    }
    return { exhausted, danger, warning, totalSeen };
  }, [seenCounts]);

  if (exhausted === 0 && danger === 0 && warning === 0) {
    // Show seen count once tiles have been recorded; nothing at fresh start
    if (totalSeen === 0) return null;
    return (
      <span className="wall-stats-empty" aria-live="polite" aria-atomic="true">
        Seen {totalSeen}
      </span>
    );
  }

  return (
    <div className="wall-stats" aria-live="polite" aria-atomic="true">
      {exhausted > 0 && (
        <span className="wall-stat wall-stat--exhausted">Gone {exhausted}</span>
      )}
      {danger > 0 && (
        <span className="wall-stat wall-stat--danger">Final {danger}</span>
      )}
      {warning > 0 && (
        <span className="wall-stat wall-stat--warning">Rare {warning}</span>
      )}
    </div>
  );
}

// ─── BottomBar ────────────────────────────────────────────────────────────────
function BottomBar({
  lastAction,
  canUndo,
  onUndo,
  onReset,
}: {
  lastAction: TileDef | null;
  canUndo: boolean;
  onUndo: () => void;
  onReset: () => void;
}) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleReset = () => {
    if (armed) {
      onReset();
      setArmed(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    } else {
      setArmed(true);
      timerRef.current = setTimeout(() => setArmed(false), 3000);
    }
  };

  return (
    <div className="tracker-bottom-bar">
      {/* Screen-reader announcement for armed state */}
      <div aria-live="assertive" aria-atomic="true" className="tracker-sr-only">
        {armed ? 'Clear all armed. Tap Confirm to erase all tracked tiles.' : ''}
      </div>

      <div
        className="tracker-last-action"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {lastAction ? (
          <>
            <img
              src={lastAction.image}
              alt=""
              aria-hidden="true"
              className="tracker-last-action-img"
            />
            <span className="tracker-last-action-name">{lastAction.name}</span>
          </>
        ) : (
          <span className="tracker-hint">Tap any tile to record it</span>
        )}
      </div>

      <div className="tracker-bottom-actions">
        <button
          className="tracker-btn tracker-btn--undo"
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo last recorded tile"
        >
          ↩ Undo
        </button>
        <button
          className={`tracker-btn tracker-btn--reset${armed ? ' armed' : ''}`}
          onClick={handleReset}
          aria-label={armed ? 'Confirm — tap to erase all tracked tiles' : 'Clear all tracked tiles'}
        >
          {armed ? 'Confirm' : 'Clear'}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TileTrackerPage() {
  useEffect(() => {
    document.title = 'Tile Tracker - Mahjong Hand Builder';
  }, []);

  const [seenCounts, setSeenCounts] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<string[]>([]);

  const lastAction = useMemo(() => {
    if (history.length === 0) return null;
    return TILE_MAP.get(history[history.length - 1]) ?? null;
  }, [history]);

  // Debounce prevents double-tap recording the same tile twice
  const recordDebounceRef = useRef(false);
  const recordTile = useCallback((tileId: string) => {
    if (recordDebounceRef.current) return;
    recordDebounceRef.current = true;
    setTimeout(() => { recordDebounceRef.current = false; }, 150);

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
    <div className="tracker-page">
      <div className="tracker-status-bar">
        <span className="tracker-status-title">Tile Tracker</span>
        <WallStats seenCounts={seenCounts} />
      </div>

      <div className="tracker-board-wrap">
        <TrackerBoard seenCounts={seenCounts} onRecord={recordTile} />
      </div>

      <BottomBar
        lastAction={lastAction}
        canUndo={history.length > 0}
        onUndo={undo}
        onReset={reset}
      />
    </div>
  );
}
