import './ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';

export default function VariantsSection() {
  return (
    <div className="scoring-section">
      <SectionHeader icon="🚀" title="Upgrade the game to the next level" />
      <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
        There are so many variants of mahjong in the world, some might contain additional rulesets or even new tiles.
      </p>
      <InfoBox accent="violet">
        <p style={{ margin: 0, marginBottom: '0.5rem' }}>
          But people in Reddit suggest you to go for <strong>Hong Kong Old Style (HKOS)</strong>, as they focus on having a good hand first and do not reward a weak winning hand.
        </p>
        <p style={{ margin: 0 }}>
          And there's Guangzhou, New Hong Kong Style, and more. So send us the guide and we will add it here!
        </p>
      </InfoBox>
    </div>
  );
}
