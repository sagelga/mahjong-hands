import './ScoringGuide.css';

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
];

const WHOLE_HAND_PATTERNS = [
  { name: 'Chow Hand',           fan: 1, note: '' },
  { name: 'Pung Hand',           fan: 3, note: '' },
  { name: 'One Suit and Honors', fan: 3, note: '' },
  { name: 'Seven Pairs',         fan: 4, note: '' },
  { name: 'One Suit Only',       fan: 6, note: '' },
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

export default function ScoringGuide() {
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
    <main className="scoring-container">

      {/* ── Hero ── */}
      <div className="scoring-hero">
        <h1>Mahjong Scoring Guide</h1>
        <p>
          How Fan (番) is earned in Hong Kong standard Mahjong — organized by set type, patterns, and winning conditions.
        </p>
        <div className="scoring-stats">
          <div className="stat-pill" style={{ borderColor: 'rgba(16,185,129,0.4)' }}>
            <div className="stat-pill-value" style={{ color: '#10b981' }}>{totalEntries}</div>
            <div className="stat-pill-label">Scoring Rules</div>
          </div>
          <div className="stat-pill" style={{ borderColor: 'rgba(245,158,11,0.4)' }}>
            <div className="stat-pill-value" style={{ color: '#f59e0b' }}>{maxFan}</div>
            <div className="stat-pill-label">Max Regular Fan</div>
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
      </div>

      {/* ── 1. Basic Sets ── */}
      <div className="scoring-section">
        <div className="section-header">
          <span className="section-icon">🀄</span>
          <h2 className="section-title">Basic Sets</h2>
        </div>
        <FanGallery items={BASIC_SETS} accent="green" />
        <div className="info-box">
          <strong>Tip:</strong> Dragon Pungs and Wind Pungs stack with each other. Scoring two Dragon Pungs in the same hand earns 2 extra Fan before counting any hand patterns.
        </div>
      </div>

      {/* ── 2. Flowers & Seasons ── */}
      <div className="scoring-section">
        <div className="section-header">
          <span className="section-icon">🌸</span>
          <h2 className="section-title">Flowers & Seasons</h2>
        </div>
        <FanGallery items={FLOWERS_SEASONS} accent="pink" />
        <div className="info-box" data-accent="pink">
          <strong>Note:</strong> Your seat's own Flower/Season is worth 1 Fan. Collecting all four Flowers or all four Seasons each add 2 Fan — independent of each other.
        </div>
      </div>

      {/* ── 3. Pung / Kong Patterns ── */}
      <div className="scoring-section">
        <div className="section-header">
          <span className="section-icon">🐉</span>
          <h2 className="section-title">Pung & Kong Patterns</h2>
        </div>
        <FanGallery items={PUNG_KONG_PATTERNS} accent="amber" />
      </div>

      {/* ── 4. Whole Hand Patterns ── */}
      <div className="scoring-section">
        <div className="section-header">
          <span className="section-icon">✨</span>
          <h2 className="section-title">Whole Hand Patterns</h2>
        </div>
        <FanGallery items={WHOLE_HAND_PATTERNS} accent="blue" />
        <div className="info-box" data-accent="blue">
          <strong>One Suit Only</strong> (Full Flush) is the highest regular hand at 6 Fan.
          <strong> Seven Pairs</strong> at 4 Fan is a popular route to a fast win.
          These patterns apply to the entire hand structure — not individual sets.
        </div>
      </div>

      {/* ── 5. Winning Conditions ── */}
      <div className="scoring-section">
        <div className="section-header">
          <span className="section-icon">🏆</span>
          <h2 className="section-title">Winning Conditions</h2>
        </div>
        <FanGallery items={WINNING_CONDITIONS} accent="violet" />
        <div className="info-box" data-accent="violet">
          These bonuses apply on top of your hand score. Self-draw (Tsumo) is the most impactful — all three players pay, and with each payer responsible for the full amount in many house rules.
        </div>
      </div>

      {/* ── 6. Payment Quick-Reference ── */}
      <div className="scoring-section">
        <div className="section-header">
          <span className="section-icon">💰</span>
          <h2 className="section-title">Fan → Payment Reference</h2>
        </div>
        <div className="payment-grid">
          {PAYMENT_REFS.map(ref => (
            <div key={ref.fan} className="payment-card">
              <div className="payment-fan">{ref.fan}</div>
              <div className="payment-fan-label">Fan</div>
              <div className="payment-divider" />
              <div className="payment-row">
                <span className="payment-type">Discard</span>
                <span className="payment-amount">{ref.discard} pts</span>
              </div>
              <div className="payment-row" style={{ marginTop: '0.35rem' }}>
                <span className="payment-type">Self-draw</span>
                <span className="payment-amount">{ref.self}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="info-box">
          <strong>Note:</strong> Values follow Hong Kong standard doubling formula. A cap (上限) at 8–10 Fan is common in house rules. For Self-Draw, each of the three other players pays the listed amount.
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="scoring-cta">
        <h3>Build a high-Fan hand now</h3>
        <p>Use the Hand Builder to construct and validate scoring patterns like Pung Hand or Seven Pairs.</p>
        <div className="cta-buttons">
          <a href="/" className="btn-primary">Open Hand Builder</a>
          <a href="/strategy" className="btn-secondary">Strategy Guide →</a>
        </div>
      </div>

    </main>
  );
}
