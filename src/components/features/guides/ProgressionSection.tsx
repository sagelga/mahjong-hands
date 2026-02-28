import './ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { FanCard } from '../../ui/FanCard';

export default function ProgressionSection() {
  return (
    <div className="scoring-section">
      <SectionHeader icon="🎓" title="After getting the grip" />
      <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
        When you understand how to win, you can start this additional scoring.
      </p>

      <div className="payment-grid" style={{ marginTop: '1rem' }}>
        <FanCard
          fan="30"
          fanLabel="Points"
          title="One Suit Only"
          description="Hands are made out of one suit only, with honors allowed."
          accent="green"
        />
        <FanCard
          fan="30"
          fanLabel="Points"
          title="All Chows"
          description="Hands are made out of chows (sequence melds) only."
          accent="blue"
        />
        <FanCard
          fan="30"
          fanLabel="Points"
          title="All Pung"
          description="Hands are made out of pungs (triplet melds) only."
          accent="violet"
        />
        <FanCard
          fan="5"
          fanLabel="more Points"
          title="Matching Flower"
          description="For each drawn flower tile that matches your seat wind."
          accent="pink"
        />
        <FanCard
          fan="5"
          fanLabel="more Points"
          title="Discarder"
          description="Discarder still pays 5 more points"
          accent="red"
        />
      </div>
    </div>
  );
}
