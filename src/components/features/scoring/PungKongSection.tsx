import '../guides/ScoringGuide.css';
import { Layers } from 'lucide-react';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanGallery } from '../../ui/FanGallery';
import type { FanItem } from '../../ui/FanGallery';

interface Props {
  items: FanItem[];
}

export default function PungKongSection({ items }: Props) {
  return (
    <div className="scoring-section">
      <SectionHeader icon={<Layers size={20} />} title="Pung & Kong Patterns" />
      <FanGallery items={items} accent="amber" />
      <InfoBox accent="amber">
        <strong>Big Three Dragons</strong> is a limit hand in many traditional rules, capping at 13 Fan regardless of other bonuses.
      </InfoBox>
    </div>
  );
}
