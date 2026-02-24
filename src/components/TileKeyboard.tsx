import { MAHJONG_TILES, SUITS } from '../lib/tiles';
import type { TileDef, Suit } from '../lib/tiles';

interface Props {
  onTileClick: (tile: TileDef) => void;
  activeFilter: Suit | 'All';
  onFilterChange: (filter: Suit | 'All') => void;
  currentTiles: TileDef[];
  onClearHand: () => void;
}

export default function TileKeyboard({ onTileClick, activeFilter, onFilterChange, currentTiles, onClearHand }: Props) {
  const filteredTiles = activeFilter === 'All'
    ? MAHJONG_TILES
    : MAHJONG_TILES.filter(t => t.suit === activeFilter);

  return (
    <div style={{ width: '100%' }}>
      {/* Filter Bar */}
      <div className="glass-panel" style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.35rem',
        marginBottom: '0.75rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'sticky',
        top: '60px',
        zIndex: 90,
        backgroundColor: 'var(--bg-secondary)'
      }}>
        {['All', ...SUITS].map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter as Suit | 'All')}
            style={{
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: activeFilter === filter ? 'var(--accent-primary)' : 'transparent',
              color: activeFilter === filter ? '#fff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.7rem',
              transition: 'all var(--transition-fast)'
            }}
          >
            {filter.split(' ')[0]}
          </button>
        ))}
        <button
          onClick={onClearHand}
          style={{
            padding: '0.4rem 0.6rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--accent-danger)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.7rem',
            transition: 'all var(--transition-fast)',
            marginLeft: '0.25rem'
          }}
        >
          Clear Hands
        </button>
      </div>

      {/* Keyboard Grid */}
      <div className="glass-panel" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
        gap: '0.4rem',
        padding: '0.75rem',
        maxHeight: '45vh',
        overflowY: 'auto'
      }}>
        {filteredTiles.map(tile => {
          const currentCount = currentTiles.filter(t => t.id === tile.id).length;
          const isAtLimit = currentCount >= 4;

          return (
            <button
              key={tile.id}
              onClick={() => !isAtLimit && onTileClick(tile)} // Disable click if at limit
              title={`${tile.name}${isAtLimit ? ' (Limit reached: 4)' : ''}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.35rem',
                backgroundColor: isAtLimit ? 'var(--bg-tertiary)' : 'var(--bg-tertiary)',
                border: `1px solid ${isAtLimit ? 'var(--accent-danger)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: isAtLimit ? 'not-allowed' : 'pointer',
                color: isAtLimit ? 'var(--text-disabled)' : 'var(--text-primary)',
                transition: 'all var(--transition-fast)',
                aspectRatio: '3/4',
                overflow: 'hidden',
                opacity: isAtLimit ? 0.6 : 1
              }}
            >
              <img
                src={tile.image}
                alt={tile.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  flex: 1,
                  filter: isAtLimit ? 'grayscale(100%) brightness(0.8)' : 'none'
                }}
              />
              <span style={{
                fontSize: '0.7rem',
                color: isAtLimit ? 'var(--text-disabled)' : 'var(--text-primary)',
                marginTop: '0.2rem',
                textAlign: 'center',
                width: '100%',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.2',
                wordBreak: 'break-word'
              }}>
                {tile.name}{isAtLimit && ' (4)'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
