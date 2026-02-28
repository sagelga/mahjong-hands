import '../guides/ScoringGuide.css';
import { CtaCard } from '../../ui/CtaCard';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import HouseRuleSelector from '../builder/HouseRuleSelector';
import { ScoringStatsBar } from './ScoringStatsBar';
import BasicSetsSection from './BasicSetsSection';
import FlowersSeasonsSection from './FlowersSeasonsSection';
import PungKongSection from './PungKongSection';
import WholeHandSection from './WholeHandSection';
import WinningConditionsSection from './WinningConditionsSection';
import PaymentReferenceSection from './PaymentReferenceSection';

// ── DATA ─────────────────────────────────────────────────────────────────────

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

  const stats = [
    { value: totalEntries, label: 'Scoring Rules',    color: '#10b981', borderColor: 'rgba(16,185,129,0.4)' },
    { value: maxFan,       label: 'Max Fan (Limit)',  color: '#f59e0b', borderColor: 'rgba(245,158,11,0.4)' },
    { value: 3,            label: 'Min Fan to Win',   color: '#3b82f6', borderColor: 'rgba(59,130,246,0.4)' },
    { value: 13,           label: 'Thirteen Orphans', color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.4)' },
  ];

  return (
    <PageContent className="scoring-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Hong Kong Old Style Scoring"
        subtitle="Traditional Hong Kong Mahjong scoring with classic fan values and limit hands."
      />

      <HouseRuleSelector />

      <ScoringStatsBar stats={stats} />

      <BasicSetsSection items={BASIC_SETS} />
      <FlowersSeasonsSection items={FLOWERS_SEASONS} />
      <PungKongSection items={PUNG_KONG_PATTERNS} />
      <WholeHandSection items={WHOLE_HAND_PATTERNS} />
      <WinningConditionsSection items={WINNING_CONDITIONS} />
      <PaymentReferenceSection items={PAYMENT_REFS} />

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
