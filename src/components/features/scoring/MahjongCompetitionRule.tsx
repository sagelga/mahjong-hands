import '../guides/ScoringGuide.css';
import { CtaCard } from '../../ui/CtaCard';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import { HouseRuleSelector } from '../builder/HouseRuleSelector';

// ── DATA ─────────────────────────────────────────────────────────────────────
// Based on World Mahjong Organization (WMO) official competition rules.
// Minimum score to win: 8 points. Patterns can stack unless otherwise noted.

const LIMIT_HANDS = [
  { name: 'Big Four Winds',        fan: 88, note: 'Pungs/Kongs of all four Wind tiles' },
  { name: 'Big Three Dragons',     fan: 88, note: 'Pungs/Kongs of all three Dragon tiles' },
  { name: 'All Honors',            fan: 88, note: 'Hand composed entirely of Wind and Dragon tiles' },
  { name: 'Four Concealed Pungs',  fan: 88, note: 'Four Pungs/Kongs, all drawn without calling' },
  { name: 'Pure Terminal Chows',   fan: 88, note: '1-2-3 and 7-8-9 in all three suits + matching pair' },
  { name: 'Quadruple Chow',        fan: 88, note: 'Four identical sequences in the same suit' },
  { name: 'Four Kongs',            fan: 88, note: 'Hand built from four Kongs' },
  { name: 'Nine Gates',            fan: 88, note: '1-1-1-2-3-4-5-6-7-8-9-9-9 in one suit, closed only' },
  { name: 'Thirteen Orphans',      fan: 88, note: 'One of each terminal and honor tile + any duplicate' },
];

const HIGH_VALUE = [
  { name: 'All Terminals',         fan: 64, note: 'Hand made only of terminal tiles (1s and 9s)' },
  { name: 'Little Four Winds',     fan: 64, note: 'Three Wind Pungs/Kongs + a pair of the fourth Wind' },
  { name: 'Little Three Dragons',  fan: 40, note: 'Two Dragon Pungs/Kongs + a pair of the third Dragon' },
  { name: 'All Even Pungs',        fan: 24, note: 'Four Pungs of 2, 4, 6, 8 tiles' },
  { name: 'Seven Pairs',           fan: 24, note: 'Seven pairs, each tile used exactly twice' },
  { name: 'Pure One-Suit',         fan: 24, note: 'Full flush — entire hand in one suit, no honors' },
  { name: 'Three-Suited Terminal Chows', fan: 16, note: '1-2-3 and 7-8-9 across all three suits' },
  { name: 'Mixed One-Suit',        fan: 8,  note: 'Half flush — one suit plus any honor tiles' },
  { name: 'Reversible Tiles',      fan: 8,  note: 'All tiles in hand are rotationally symmetrical' },
  { name: 'All Pungs',             fan: 6,  note: 'Hand composed entirely of Pungs and Kongs' },
  { name: 'Half Flush',            fan: 6,  note: 'Alias for Mixed One-Suit in some rule texts' },
];

const STANDARD_PATTERNS = [
  { name: 'Outside Hand',          fan: 4,  note: 'Every set and the pair contain a terminal or honor' },
  { name: 'Fully Concealed Self-Draw', fan: 4, note: 'Win by self-draw with a completely closed hand' },
  { name: 'Last Tile Draw',        fan: 4,  note: 'Win by drawing the last tile of the wall' },
  { name: 'Last Tile Claim',       fan: 4,  note: 'Win by claiming the very last discard' },
  { name: 'Out by Kong',           fan: 4,  note: 'Win by drawing the replacement tile after a Kong' },
  { name: 'Robbing a Kong',        fan: 4,  note: 'Win by claiming a tile added to an opponent\'s Kong' },
  { name: 'All Chows',             fan: 2,  note: 'Hand composed entirely of Chow sequences' },
  { name: 'Dragon Pung',           fan: 2,  note: 'Pung or Kong of any Dragon tile (per Dragon)' },
  { name: 'Prevalent Wind Pung',   fan: 2,  note: 'Pung or Kong of the round wind tile' },
  { name: 'Seat Wind Pung',        fan: 2,  note: 'Pung or Kong of your own seat wind' },
  { name: 'All Simples',           fan: 2,  note: 'No terminals (1 or 9) or honor tiles in hand' },
  { name: 'Concealed Hand',        fan: 2,  note: 'Won by claiming a discard with a fully closed hand' },
  { name: 'Flower Tile',           fan: 1,  note: '1 point per flower or season tile (up to 8 total)' },
  { name: 'Self-Drawn',            fan: 1,  note: 'Won by drawing the winning tile yourself' },
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
            {item.fan} pts
          </div>
          <div className="fan-card-name">{item.name}</div>
          {item.note && <div className="fan-card-note">{item.note}</div>}
        </div>
      ))}
    </div>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function MahjongCompetitionRule() {
  const totalPatterns = LIMIT_HANDS.length + HIGH_VALUE.length + STANDARD_PATTERNS.length;

  return (
    <PageContent className="scoring-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Mahjong Competition Rules"
        subtitle="The World Mahjong Organization's official competitive standard — 81 patterns, points-based scoring."
      />

      <HouseRuleSelector />

      <div className="scoring-stats">
        <div className="stat-pill" style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
          <div className="stat-pill-value" style={{ color: '#10b981' }}>81</div>
          <div className="stat-pill-label">Patterns</div>
        </div>
        <div className="stat-pill" style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
          <div className="stat-pill-value" style={{ color: '#f59e0b' }}>88</div>
          <div className="stat-pill-label">Limit Points</div>
        </div>
        <div className="stat-pill" style={{ borderColor: 'rgba(59,130,246,0.4)' }}>
          <div className="stat-pill-value" style={{ color: '#3b82f6' }}>8</div>
          <div className="stat-pill-label">Min to Win</div>
        </div>
        <div className="stat-pill" style={{ borderColor: 'rgba(139,92,246,0.4)' }}>
          <div className="stat-pill-value" style={{ color: '#8b5cf6' }}>{totalPatterns}</div>
          <div className="stat-pill-label">Shown Here</div>
        </div>
      </div>

      <InfoBox accent="blue">
        <strong>How MCR works:</strong> Patterns stack — you score every qualifying pattern in your winning hand and add them together. You need at least <strong>8 points</strong> to declare a win. The 88-point limit hands are the ceiling; no hand can score above 88.
      </InfoBox>

      {/* ── 1. Limit Hands ── */}
      <div className="scoring-section">
        <SectionHeader icon="👑" title="Limit Hands — 88 Points" />
        <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          These are the most prestigious hands in MCR. Each is worth the maximum 88 points alone — no stacking needed.
        </p>
        <FanGallery items={LIMIT_HANDS} accent="violet" />
      </div>

      {/* ── 2. High-Value Patterns ── */}
      <div className="scoring-section">
        <SectionHeader icon="🔥" title="High-Value Patterns — 6 to 64 Points" />
        <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          These hands form the backbone of competitive MCR strategy. Combine them with standard bonuses to reach 8+ points.
        </p>
        <FanGallery items={HIGH_VALUE} accent="amber" />
      </div>

      {/* ── 3. Standard Patterns ── */}
      <div className="scoring-section">
        <SectionHeader icon="🃏" title="Standard Patterns & Bonuses — 1 to 4 Points" />
        <p style={{ margin: '0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Small but stackable bonuses. Self-draw, flower tiles, and wind pungs are common ways to push a 6-point hand over the 8-point threshold.
        </p>
        <FanGallery items={STANDARD_PATTERNS} accent="green" />
        <InfoBox accent="amber">
          <strong>Stacking example:</strong> All Chows (2) + All Simples (2) + Concealed Hand (2) + Self-Drawn (1) + Seat Wind Pung (2) = <strong>9 pts</strong> — a valid win with room for more.
        </InfoBox>
      </div>

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
