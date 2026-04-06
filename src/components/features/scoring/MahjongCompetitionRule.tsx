import '../guides/ScoringGuide.css';
import { CtaCard } from '../../ui/CtaCard';
import { InfoBox } from '../../ui/InfoBox';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import HouseRuleSelector from '../builder/HouseRuleSelector';
import { ScoringStatsBar } from './ScoringStatsBar';
import LimitHandsSection from './LimitHandsSection';
import HighValueSection from './HighValueSection';
import StandardPatternsSection from './StandardPatternsSection';

// ── DATA ─────────────────────────────────────────────────────────────────────

const LIMIT_HANDS = [
  { name: 'Big Four Winds',        fan: 88, note: 'Pungs or Kongs of all four Wind tiles' },
  { name: 'Big Three Dragons',     fan: 88, note: 'Pungs or Kongs of all three Dragon tiles' },
  { name: 'All Green',             fan: 88, note: 'Hand made entirely of green tiles (2, 3, 4, 6, 8 of Bamboo and Green Dragon)' },
  { name: 'Nine Gates',            fan: 88, note: '1-1-1-2-3-4-5-6-7-8-9-9-9 in one suit, closed only' },
  { name: 'Four Kongs',            fan: 88, note: 'Any hand that includes four Kongs' },
  { name: 'Seven Shifted Pairs',   fan: 88, note: 'Seven pairs of the same suit, each shifted up one number from the last' },
  { name: 'Thirteen Orphans',      fan: 88, note: 'One of each terminal and honor tile plus a matching pair' },
];

const HIGH_VALUE = [
  { name: 'All Terminals',                fan: 64, note: 'Hand made only of terminal tiles (1s and 9s)' },
  { name: 'Little Four Winds',            fan: 64, note: 'Three Wind Pungs/Kongs and a pair of the fourth Wind' },
  { name: 'Little Three Dragons',         fan: 64, note: 'Two Dragon Pungs/Kongs and a pair of the third Dragon' },
  { name: 'All Honors',                   fan: 64, note: 'Hand made entirely of Honor tiles (Winds and Dragons)' },
  { name: 'Four Concealed Pungs',         fan: 64, note: 'Four Pungs achieved without claiming discards' },
  { name: 'Pure Terminal Chows',          fan: 64, note: 'Two sets of 1-2-3, two sets of 7-8-9 in one suit, and a pair of 5s in that suit' },
  { name: 'Quadruple Chow',               fan: 48, note: 'Four identical chows in the same suit' },
  { name: 'All Even Pungs',               fan: 24, note: 'Pungs of 2, 4, 6, and 8 tiles with a pair of the same' },
  { name: 'Seven Pairs',                  fan: 24, note: 'Seven pairs, each tile used exactly twice' },
  { name: 'Pure One-Suit',                fan: 24, note: 'Full flush — entire hand in one suit, no honors' },
  { name: 'Three-Suited Terminal Chows',  fan: 16, note: '1-2-3 and 7-8-9 in two suits and a pair of 5s in the third' },
  { name: 'Last Tile Draw',               fan: 8,  note: 'Winning on the very last tile of the wall' },
  { name: 'Last Tile Claim',              fan: 8,  note: 'Winning on the very last discarded tile of the game' },
  { name: 'Out by Kong',                  fan: 8,  note: 'Winning on a tile drawn after declaring a Kong' },
  { name: 'Robbing a Kong',               fan: 8,  note: 'Winning on a tile another player adds to a Pung to make a Kong' },
  { name: 'Reversible Tiles',             fan: 8,  note: 'All tiles in hand are rotationally symmetrical' },
  { name: 'All Pungs',                    fan: 6,  note: 'Four Pungs/Kongs and a pair' },
  { name: 'Mixed One-Suit',               fan: 6,  note: 'Half flush — one suit plus any honor tiles' },
];

const STANDARD_PATTERNS = [
  { name: 'Outside Hand',          fan: 4,  note: 'Every set and the pair contain a terminal or honor' },
  { name: 'Fully Concealed Hand',  fan: 4,  note: 'Hand completed without any melds and won by self-draw' },
  { name: 'All Chows',             fan: 2,  note: 'Hand composed entirely of Chow sequences' },
  { name: 'Dragon Pung',           fan: 2,  note: 'Pung or Kong of any Dragon tile (per Dragon)' },
  { name: 'Prevalent Wind Pung',   fan: 2,  note: 'Pung or Kong of the round wind tile' },
  { name: 'Seat Wind Pung',        fan: 2,  note: 'Pung or Kong of your own seat wind' },
  { name: 'All Simples',           fan: 2,  note: 'No terminals (1 or 9) or honor tiles in hand' },
  { name: 'Concealed Hand',        fan: 2,  note: 'Won by claiming a discard with a fully closed hand' },
  { name: 'Flower Tile',           fan: 1,  note: '1 point per flower or season tile (up to 8 total)' },
  { name: 'Self-Drawn',            fan: 1,  note: 'Won by drawing the winning tile yourself' },
];

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function MahjongCompetitionRule() {
  const totalPatterns = LIMIT_HANDS.length + HIGH_VALUE.length + STANDARD_PATTERNS.length;

  const stats = [
    { value: 81,           label: 'Patterns',     color: '#10b981', borderColor: 'rgba(16,185,129,0.4)' },
    { value: 88,           label: 'Limit Points', color: '#f59e0b', borderColor: 'rgba(245,158,11,0.4)' },
    { value: '8 pts',      label: 'Min to Win',   color: '#3b82f6', borderColor: 'rgba(59,130,246,0.4)' },
    { value: totalPatterns, label: 'Shown (of 81)', color: '#8b5cf6', borderColor: 'rgba(139,92,246,0.4)' },
  ];

  return (
    <PageContent className="scoring-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Mahjong Competition Rules"
        subtitle="The World Mahjong Organization's official competitive standard — 81 patterns, points-based scoring."
      />


      <HouseRuleSelector />
      <ScoringStatsBar stats={stats} />

      <InfoBox accent="blue">
        <strong>How MCR works:</strong> Patterns stack — you score every qualifying pattern in your winning hand and add them together. You need at least <strong>8 points</strong> to declare a win. The 88-point limit hands are the ceiling; no hand can score above 88.
      </InfoBox>

      <LimitHandsSection items={LIMIT_HANDS} />
      <HighValueSection items={HIGH_VALUE} />
      <StandardPatternsSection items={STANDARD_PATTERNS} />

      {/* ── CTA ── */}
      <CtaCard
        title="Build a competition-ready hand"
        description="Use the Hand Builder to construct and validate high-scoring MCR patterns like Seven Pairs or Pure One-Suit."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Strategy Guide →', href: '/learn/strategy', variant: 'secondary' },
        ]}
      />

    </PageContent>
  );
}
