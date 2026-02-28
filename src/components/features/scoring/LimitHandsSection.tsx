import '../guides/ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function LimitHandsSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon="👑" title="Limit Hands — 88 Points" />
      <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        These are the most prestigious hands in MCR. Each is worth the maximum 88 points alone — no stacking needed.
      </p>
      <FanGallery items={items} accent="violet" fanLabel="pts" />
    </div>
  );
}
