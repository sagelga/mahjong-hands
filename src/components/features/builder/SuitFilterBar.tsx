import { SUITS } from '../../../lib/tiles';
import type { Suit } from '../../../lib/tiles';
import { LayoutGrid } from 'lucide-react';
import './TileKeyboard.css';

const SUIT_LABELS: Record<string, string> = {
  Characters: '万',
  Dots: '筒',
  Bamboo: '条',
  Honors: '字',
  Flowers: '花',
};

interface Props {
  activeFilter: Suit | 'All';
  onFilterChange: (filter: Suit | 'All') => void;
}

export default function SuitFilterBar({ activeFilter, onFilterChange }: Props) {
  return (
    <div className="glass-panel filter-bar">
      {['All', ...SUITS].map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter as Suit | 'All')}
          className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
          aria-pressed={activeFilter === filter}
        >
          <span className="filter-icon">{filter === 'All' ? <LayoutGrid size={14} /> : SUIT_LABELS[filter]}</span>
          {filter === 'Characters' ? 'Characters' :
           filter === 'Dots' ? 'Dots' :
           filter === 'Bamboo' ? 'Bamboo' :
           filter.split(' ')[0]}
        </button>
      ))}
    </div>
  );
}
