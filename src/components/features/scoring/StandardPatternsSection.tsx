import '../guides/ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function StandardPatternsSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon="🃏" title="Standard Patterns & Bonuses — 1 to 4 Points" />
      <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Small but stackable bonuses. Self-draw, flower tiles, and wind pungs are common ways to push a 6-point hand over the 8-point threshold.
      </p>
      <FanGallery items={items} accent="green" fanLabel="pts" />
      <InfoBox accent="amber">
        <strong>Stacking example:</strong> All Chows (2) + All Simples (2) + Concealed Hand (2) + Self-Drawn (1) + Seat Wind Pung (2) = <strong>9 pts</strong> — a valid win with room for more.
      </InfoBox>
    </div>
  );
}
