import '../guides/ScoringGuide.css';
import { Flower2 } from 'lucide-react';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function FlowersSeasonsSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon={<Flower2 size={20} />} title="Flowers & Seasons" />
      <FanGallery items={items} accent="pink" />
      <InfoBox accent="pink">
        <strong>Note:</strong> Your seat's own Flower/Season is worth 1 Fan. Collecting all four Flowers or all four Seasons each add 2 Fan — independent of each other.
      </InfoBox>
    </div>
  );
}
