import '../guides/ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function BasicSetsSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon="🀄" title="Basic Sets" />
      <FanGallery items={items} accent="green" />
      <InfoBox>
        <strong>Tip:</strong> Dragon Pungs and Wind Pungs stack with each other. Scoring two Dragon Pungs in the same hand earns 2 extra Fan before counting any hand patterns.
      </InfoBox>
    </div>
  );
}
