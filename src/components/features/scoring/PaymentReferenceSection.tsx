import '../guides/ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanCard } from '../../ui/FanCard';

interface PaymentRef {
  fan: number;
  discard: string;
  self: string;
}

interface Props {
  items: PaymentRef[];
}

export default function PaymentReferenceSection({ items }: Props) {
  const accents: Array<'green' | 'blue' | 'violet' | 'pink' | 'amber' | 'red' | 'orange' | 'yellow'> = ['green', 'blue', 'violet', 'pink', 'amber', 'red', 'orange', 'yellow'];

  return (
    <div className="scoring-section">
      <SectionHeader icon="💰" title="Fan → Payment Reference" />
      <div className="payment-grid">
        {items.map((ref, idx) => (
          <FanCard
            key={ref.fan}
            fan={ref.fan}
            fanLabel="Fan"
            title="Payment Reference"
            description={`Discard: ${ref.discard} pts | Self: ${ref.self}`}
            accent={accents[idx % 8]}
            showDivider={true}
          />
        ))}
      </div>
      <InfoBox>
        <strong>Note:</strong> Values follow traditional Hong Kong doubling formula. Many house rules cap at 8–10 Fan (Limit). For Self-Draw, each of the three other players pays the listed amount.
      </InfoBox>
    </div>
  );
}
