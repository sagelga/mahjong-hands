import { SUITS } from '../../../lib/tiles';
import type { Suit } from '../../../lib/tiles';
import './TileKeyboard.css';

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
        >
          {filter === 'Characters' ? 'Characters' :
           filter === 'Dots' ? 'Dots' :
           filter === 'Bamboo' ? 'Bamboo' :
           filter.split(' ')[0]}
        </button>
      ))}
    </div>
  );
}
