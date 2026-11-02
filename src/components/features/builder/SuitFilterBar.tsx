import { MAHJONG_TILES, SUITS } from '../../../lib/tiles';
import type { Suit } from '../../../lib/tiles';
import './TileKeyboard.css';

const SUIT_LABELS: Record<Suit, { mark: string; label: string }> = {
  Characters: { mark: '万', label: 'Characters' },
  Dots: { mark: '筒', label: 'Dots' },
  Bamboo: { mark: '条', label: 'Bamboo' },
  Honors: { mark: '字', label: 'Honors' },
  Flowers: { mark: '花', label: 'Flowers' },
};

const FILTERS: Array<{ id: Suit | 'All'; mark: string; label: string }> = [
  { id: 'All', mark: '全', label: 'All' },
  ...SUITS.map(suit => ({ id: suit, ...SUIT_LABELS[suit] })),
];

interface Props {
  activeFilter: Suit | 'All';
  onFilterChange: (filter: Suit | 'All') => void;
}

export default function SuitFilterBar({ activeFilter, onFilterChange }: Props) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tiles by suit">
      {FILTERS.map(filter => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterChange(filter.id)}
            className={`filter-button ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
          >
            <span className="filter-mark" aria-hidden="true">{filter.mark}</span>
            <span className="filter-label">{filter.label}</span>
            {filter.id === 'All' && (
              <span className="filter-count" aria-hidden="true">{MAHJONG_TILES.length}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
