import './ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { FanCard } from '../../ui/FanCard';

export default function PaymentGridSection() {
  return (
    <div className="scoring-section">
      <SectionHeader icon="💰" title="Paying a price for being a loser" />
      <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
        When the player calls a win, the other players will have to pay the winner. The discard player must pay more when they make the winner wins the game.
        This is only to discourage players from playing games without caring about the game.
      </p>

      <div className="payment-grid" style={{ marginTop: '1rem' }}>
        <FanCard
          fan="15"
          fanLabel="Points"
          title="Simple Win"
          description="Paid by only discard player"
          accent="green"
        />
        <FanCard
          fan="10"
          fanLabel="Points"
          title="Simple Win"
          description="Paid by everyone else"
          accent="blue"
        />
      </div>
    </div>
  );
}
