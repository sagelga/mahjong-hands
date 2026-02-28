import '../guides/ScoringGuide.css';
import { CtaCard } from '../../ui/CtaCard';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanCard } from '../../ui/FanCard';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import { HouseRuleSelector } from '../builder/HouseRuleSelector';

// ── DATA ─────────────────────────────────────────────────────────────────────
// Traditional Hong Kong Old Style scoring rules

const BASIC_SETS = [
  { name: 'Pung of Dragons',                 fan: 1, note: '' },
  { name: 'Kong of Dragons',                 fan: 1, note: '' },
  { name: "Pung of Player's Own Wind",       fan: 1, note: 'Scoring for Pung of Winds' },
  { name: "Kong of Player's Own Wind",       fan: 1, note: "Kong of Player's Own Wind" },
  { name: 'Pung of the Wind of the Round',   fan: 1, note: 'Scoring for Pung of Winds' },
  { name: 'Kong of the Wind of the Round',   fan: 1, note: 'Scoring for Pung of Winds' },
];

const FLOWERS_SEASONS = [
  { name: 'Flower of Own Wind',    fan: 1, note: '' },
  { name: 'Season of Own Wind',    fan: 1, note: '' },
  { name: 'All Flowers',           fan: 2, note: '' },
  { name: 'All Seasons',           fan: 2, note: '' },
  { name: 'No Flowers or Seasons', fan: 1, note: '' },
];

const PUNG_KONG_PATTERNS = [
  { name: 'Little Three Dragons', fan: 4, note: 'Two Dragon Pungs/Kongs + a pair of the third Dragon' },
  { name: 'Big Three Dragons',    fan: 8, note: 'Three Dragon Pungs/Kongs (Limit Hand in some rules)' },
  { name: 'All Pungs',            fan: 3, note: 'Hand composed entirely of Pungs and Kongs' },
];

const WHOLE_HAND_PATTERNS = [
  { name: 'Chow Hand',           fan: 1, note: '' },
  { name: 'Pung Hand',           fan: 3, note: '' },
  { name: 'One Suit and Honors', fan: 3, note: '' },
  { name: 'Seven Pairs',         fan: 4, note: '' },
  { name: 'One Suit Only',       fan: 6, note: '' },
  { name: 'Thirteen Orphans',    fan: 13, note: 'Limit Hand - 13 unique terminals and honors' },
];

const WINNING_CONDITIONS = [
  { name: 'Self-Drawn Last Tile',          fan: 1, note: '' },
  { name: 'Out on Last Tile of the Wall',  fan: 1, note: '' },
  { name: 'Out on Last Discard',           fan: 1, note: '' },
  { name: 'Out by Robbing a Kong',         fan: 1, note: '' },
  { name: 'Out on Replacement Tile',       fan: 1, note: '' },
];

const PAYMENT_REFS = [
  { fan: 3,  discard: '8',   self: '4 ea.' },
  { fan: 4,  discard: '16',  self: '8 ea.' },
  { fan: 5,  discard: '24',  self: '12 ea.' },
  { fan: 6,  discard: '32',  self: '16 ea.' },
  { fan: 7,  discard: '48',  self: '24 ea.' },
  { fan: 8,  discard: '64',  self: '32 ea.' },
  { fan: 9,  discard: '96',  self: '48 ea.' },
  { fan: 10, discard: '128', self: '64 ea.' },
];

// ── HELPER ──────────────────────────────────────────────────────────────────

type Accent = 'green' | 'pink' | 'amber' | 'blue' | 'violet';
interface FanItem { name: string; fan: number; note: string; }

function FanGallery({ items, accent }: { items: FanItem[]; accent: Accent }) {
  return (
    <div className="fan-gallery">
      {items.map(item => (
        <div key={item.name} className="fan-card" data-accent={accent}>
          <div className="fan-badge" data-accent={accent}>
            {item.fan} Fan
          </div>
          <div className="fan-card-name">{item.name}</div>
          {item.note && <div className="fan-card-note">{item.note}</div>}
        </div>
      ))}
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function HongKongOldStyle() {
  const totalEntries =
    BASIC_SETS.length +
    FLOWERS_SEASONS.length +
    PUNG_KONG_PATTERNS.length +
    WHOLE_HAND_PATTERNS.length +
    WINNING_CONDITIONS.length;

  const maxFan = Math.max(
    ...WHOLE_HAND_PATTERNS.map(x => x.fan),
    ...PUNG_KONG_PATTERNS.map(x => x.fan),
  );

  return (
    <PageContent className="scoring-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Hong Kong Old Style Scoring"
        subtitle="Traditional Hong Kong Mahjong scoring with classic fan values and limit hands."
      />

      <HouseRuleSelector />

      <div className="scoring-stats">
          <div className="stat-pill" style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
            <div className="stat-pill-value" style={{ color: '#10b981' }}>{totalEntries}</div>
            <div className="stat-pill-label">Scoring Rules</div>
          </div>
          <div className="stat-pill" style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
            <div className="stat-pill-value" style={{ color: '#f59e0b' }}>{maxFan}</div>
            <div className="stat-pill-label">Max Fan (Limit)</div>
          </div>
          <div className="stat-pill" style={{ borderColor: 'rgba(59,130,246,0.4)' }}>
            <div className="stat-pill-value" style={{ color: '#3b82f6' }}>3</div>
            <div className="stat-pill-label">Min Fan to Win</div>
          </div>
          <div className="stat-pill" style={{ borderColor: 'rgba(139,92,246,0.4)' }}>
            <div className="stat-pill-value" style={{ color: '#8b5cf6' }}>13</div>
            <div className="stat-pill-label">Thirteen Orphans</div>
          </div>
        </div>

      {/* ── 1. Basic Sets ── */}
      <div className="scoring-section">
        <SectionHeader icon="🀄" title="Basic Sets" />
        <FanGallery items={BASIC_SETS} accent="green" />
        <InfoBox>
          <strong>Tip:</strong> Dragon Pungs and Wind Pungs stack with each other. Scoring two Dragon Pungs in the same hand earns 2 extra Fan before counting any hand patterns.
        </InfoBox>
      </div>

      {/* ── 2. Flowers & Seasons ── */}
      <div className="scoring-section">
        <SectionHeader icon="🌸" title="Flowers & Seasons" />
        <FanGallery items={FLOWERS_SEASONS} accent="pink" />
        <InfoBox accent="pink">
          <strong>Note:</strong> Your seat's own Flower/Season is worth 1 Fan. Collecting all four Flowers or all four Seasons each add 2 Fan — independent of each other.
        </InfoBox>
      </div>

      {/* ── 3. Pung / Kong Patterns ── */}
      <div className="scoring-section">
        <SectionHeader icon="🐉" title="Pung & Kong Patterns" />
        <FanGallery items={PUNG_KONG_PATTERNS} accent="amber" />
        <InfoBox accent="amber">
          <strong>Big Three Dragons</strong> is a limit hand in many traditional rules, capping at 13 Fan regardless of other bonuses.
        </InfoBox>
      </div>

      {/* ── 4. Whole Hand Patterns ── */}
      <div className="scoring-section">
        <SectionHeader icon="✨" title="Whole Hand Patterns" />
        <FanGallery items={WHOLE_HAND_PATTERNS} accent="blue" />
        <InfoBox accent="blue">
          <strong>Thirteen Orphans</strong> is the ultimate limit hand at 13 Fan. <strong>One Suit Only</strong> (Full Flush) at 6 Fan is the highest regular hand pattern.
        </InfoBox>
      </div>

      {/* ── 5. Winning Conditions ── */}
      <div className="scoring-section">
        <SectionHeader icon="🏆" title="Winning Conditions" />
        <FanGallery items={WINNING_CONDITIONS} accent="violet" />
        <InfoBox accent="violet">
          These bonuses apply on top of your hand score. Self-draw (Tsumo) is the most impactful — all three players pay, and with each payer responsible for the full amount in many house rules.
        </InfoBox>
      </div>

      {/* ── 6. Payment Quick-Reference ── */}
      <div className="scoring-section">
        <SectionHeader icon="💰" title="Fan → Payment Reference" />
        <div className="payment-grid">
          {PAYMENT_REFS.map((ref, idx) => {
            const accents: Array<'green' | 'blue' | 'violet' | 'pink' | 'amber' | 'red' | 'orange' | 'yellow'> = ['green', 'blue', 'violet', 'pink', 'amber', 'red', 'orange', 'yellow'];
            return (
              <FanCard 
                key={ref.fan} 
                fan={ref.fan} 
                fanLabel="Fan" 
                title="Payment Reference"
                description={`Discard: ${ref.discard} pts | Self: ${ref.self}`}
                accent={accents[idx % 8]}
                showDivider={true}
              />
            );
          })}
        </div>
        <InfoBox>
          <strong>Note:</strong> Values follow traditional Hong Kong doubling formula. Many house rules cap at 8–10 Fan (Limit). For Self-Draw, each of the three other players pays the listed amount.
        </InfoBox>
      </div>

      {/* ── CTA ── */}
      <CtaCard
        title="Build a high-Fan hand now"
        description="Use the Hand Builder to construct and validate scoring patterns like Pung Hand or Seven Pairs."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Strategy Guide →', href: '/strategy', variant: 'secondary' },
        ]}
      />

    </PageContent>
  );
}
