import '../guides/ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function WinningConditionsSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon="🏆" title="Winning Conditions" />
      <FanGallery items={items} accent="violet" />
      <InfoBox accent="violet">
        These bonuses apply on top of your hand score. Self-draw (Tsumo) is the most impactful — all three players pay, and with each payer responsible for the full amount in many house rules.
      </InfoBox>
    </div>
  );
}
