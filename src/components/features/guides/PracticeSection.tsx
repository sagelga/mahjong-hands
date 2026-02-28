import './ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';

export default function PracticeSection() {
  return (
    <div className="scoring-section">
      <SectionHeader icon="🧠" title="Hone your skills" />
      <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
        I understand that you can't win with only the theory alone. It requires a strategy, managing risks, cutting losses, and the most important thing: recognizing the tile patterns.
      </p>
      <InfoBox accent="amber">
        <p style={{ margin: 0 }}>
          Practice the pattern by playing the game alone. Start with the standard 13 tiles, and with your strategy, try to be 1 tile off from winning within 17 wall draws.
        </p>
      </InfoBox>
    </div>
  );
}
