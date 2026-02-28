import '../guides/ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function WholeHandSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon="✨" title="Whole Hand Patterns" />
      <FanGallery items={items} accent="blue" />
      <InfoBox accent="blue">
        <strong>Thirteen Orphans</strong> is the ultimate limit hand at 13 Fan. <strong>One Suit Only</strong> (Full Flush) at 6 Fan is the highest regular hand pattern.
      </InfoBox>
    </div>
  );
}
