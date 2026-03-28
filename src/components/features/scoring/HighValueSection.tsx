import '../guides/ScoringGuide.css';
import { Flame } from 'lucide-react';
import { SectionHeader } from '../../ui/SectionHeader';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function HighValueSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon={<Flame size={20} />} title="High-Value Patterns — 6 to 64 Points" />
      <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        These hands form the backbone of competitive MCR strategy. Combine them with standard bonuses to reach 8+ points.
      </p>
      <FanGallery items={items} accent="amber" fanLabel="pts" />
    </div>
  );
}
