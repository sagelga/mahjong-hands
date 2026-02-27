import './StrategyGuide.css';

// ── DATA ─────────────────────────────────────────────────────────────────────

const HAND_TYPES = [
  {
    name: 'Pair',
    chinese: '對 Duì',
    count: 2,
    tiles: ['🀇', '🀇'],
    color: 'var(--accent-primary)',
    role: 'Eyes (pair)',
    desc: 'Two identical tiles. Every winning hand needs exactly one pair — called the "eyes." Pairs cannot form a set; they exist alongside the four meld sets.',
    rules: [
      'Exactly one pair per winning hand',
      'Must be two of the same tile',
      'Cannot be made from partial sequences',
    ],
  },
  {
    name: 'Chow',
    chinese: '吃 Chī',
    count: 3,
    tiles: ['4', '5', '6'],
    color: '#3b82f6',
    role: 'Sequence set',
    desc: 'Three tiles of consecutive numbers in the same suit (e.g. 4-5-6 of Bamboo). Chows can only be claimed from the player to your left.',
    rules: [
      'Must be the same suit',
      'Must be consecutive numbers (1–9 only)',
      'Cannot use Honor tiles (Winds/Dragons)',
      'Can only be claimed from the left player\'s discard',
    ],
  },
  {
    name: 'Pung',
    chinese: '碰 Pèng',
    count: 3,
    tiles: ['🀄', '🀄', '🀄'],
    color: '#f59e0b',
    role: 'Triplet set',
    desc: 'Three identical tiles. Can be formed from any suit or honor tile. A Pung can be claimed from any player\'s discard (not just your left neighbor).',
    rules: [
      'Three of the exact same tile',
      'Can use any tile including Winds and Dragons',
      'Can be claimed from any player\'s discard',
      'Becomes exposed (visible to all) when claimed',
    ],
  },
  {
    name: 'Kong',
    chinese: '槓 Gàng',
    count: 4,
    tiles: ['⬛', '🀄', '🀄', '🀄'],
    color: '#ef4444',
    role: 'Quadruplet set',
    desc: 'Four identical tiles. A Kong counts as one set (like a Pung) for hand completion but grants a bonus replacement tile draw. Must be declared explicitly.',
    rules: [
      'Four of the exact same tile',
      'Must be declared — grants one extra tile draw',
      'Counts as a single set (3 tiles) for winning purposes',
      'Three types: Concealed Kong (4 self-drawn), Exposed Kong (3-Pung + claimed 4th), Upgraded Kong (add to own Pung)',
    ],
  },
];

const STRICT_RULES = [
  {
    icon: '🚫',
    severity: 'error',
    title: 'No Illegal Claims',
    body: 'You may only claim a discarded tile to form a Chow from the player to your left. Pungs and Kongs can be claimed from any player. Claiming incorrectly is a penalty.',
  },
  {
    icon: '🃏',
    severity: 'error',
    title: 'Chow = Left Player Only',
    body: 'A Chow can ONLY be claimed from the discard of your left-hand neighbor. You cannot Chow from the tile discarded by the opposite or right player.',
  },
  {
    icon: '🔢',
    severity: 'error',
    title: 'Exact 14-Tile Hand',
    body: 'A winning hand is exactly 14 tiles: 4 sets × 3 tiles + 1 pair × 2 tiles = 14. Kongs don\'t break this because the extra draw compensates for the 4th tile.',
  },
  {
    icon: '🌸',
    severity: 'warning',
    title: 'Declare Flowers Immediately',
    body: 'When you draw a Flower or Season tile, you MUST declare and replace it before your next discard. Failing to declare is a rule violation in formal play.',
  },
  {
    icon: '🏆',
    severity: 'warning',
    title: 'Minimum Fan Requirement',
    body: 'In Hong Kong Mahjong, you need a minimum of 3 Fan to declare a winning hand. Declaring with fewer Fan is a "false win" (诈和) and incurs a penalty.',
  },
  {
    icon: '🔇',
    severity: 'warning',
    title: 'No Forced Discard Reveals',
    body: 'You may not show other players your hand tiles to ask for advice during play. Your concealed tiles must stay face-down until you win or the round ends.',
  },
  {
    icon: '⚠️',
    severity: 'caution',
    title: 'Discard Order Matters',
    body: 'After claiming a tile to form a Pung or Kong, the turn skips clockwise to the player after the discarding player — not to you. Play order must be maintained.',
  },
  {
    icon: '🎴',
    severity: 'caution',
    title: 'Concealed Kongs Are Secret',
    body: 'A Concealed Kong (drawn entirely from the wall) may show only the two center tiles to reveal the tile type. The outer two tiles remain face-down.',
  },
];

const TIPS = [
  { icon: '🎯', title: 'Focus on One Suit', body: 'Building around a single suit drastically reduces the tiles you need to track and makes sequences and triplets easier to form.' },
  { icon: '🔍', title: 'Watch the Discards', body: 'The discard pile is free information. If three 5-Dots are discarded, a 5-Dot Pung is impossible — adjust your targets.' },
  { icon: '🧩', title: 'Keep Flexible Tiles', body: 'Middle tiles (4–6) fit into more sequences than terminals (1, 9). Prefer tiles with multiple options in the early game.' },
  { icon: '🛡️', title: 'Play Defensively', body: "If an opponent is in Tenpai, discard safe tiles — tiles already discarded by others or tiles clearly outside their visible sets." },
  { icon: '⚡', title: 'Win Fast, Win Often', body: "Don't chase a 6-Fan hand when 3 Fan will win. A fast modest win beats a slow ambitious loss every session." },
  { icon: '🌸', title: 'Claim Flowers Early', body: 'Declare bonus tiles immediately — they earn Fan at game end and give a replacement draw. Never delay!' },
];

const WAITS = [
  {
    name: 'Two-Sided Wait',
    tiles: ['6', '7'],
    waits: ['5', '8'],
    desc: 'Holds two consecutive tiles, waits for either end. 2 winning tiles — always prefer this.',
  },
  {
    name: 'Middle Wait',
    tiles: ['5', '·', '7'],
    waits: ['6'],
    desc: 'A gap in the middle. Only 1 winning tile — avoid when a two-sided wait is possible.',
  },
  {
    name: 'Edge Wait',
    tiles: ['1', '2', '·'],
    waits: ['3'],
    desc: 'Sequence at the edge (1-2 or 8-9). Only 1 possible tile. Weakest wait type.',
  },
  {
    name: 'Pair Wait',
    tiles: ['8', '8', '·'],
    waits: ['8'],
    desc: 'Waiting for a third tile to complete a Pung. 1 winning tile.',
  },
  {
    name: 'Double-Pair Wait',
    tiles: ['4', '4', '7', '7'],
    waits: ['4', '7'],
    desc: 'Two pairs — either completes a Pung while the other becomes the pair. 2 winning tiles.',
  },
];

const DOS = [
  'Keep two-sided waits over middle or edge waits',
  'Turn pairs into Pungs when safe tiles are available',
  'Discard "dangerous" tiles early in the game',
  'Pay attention to what each player is collecting',
  'Claim flowers and seasons right away',
  'Stay flexible in the first 5–6 draw turns',
];

const DONTS = [
  "Don't chase a hand requiring too many specific tiles",
  "Don't claim a Chow from the wrong player (only left!)",
  "Don't hold terminals hoping for a specific sequence",
  "Don't ignore the discard pile — it's free information",
  "Don't declare a win with fewer than 3 Fan",
  "Don't play defensively so early that you can't win",
];

const MASTERY = [
  { n: 1, title: 'Learn the Tile Suits', desc: 'Understand Characters, Dots, Bamboo + Winds and Dragons. Memorizing their sequences is your foundation.' },
  { n: 2, title: 'Master the Four Hand Types', desc: 'Know Pair, Chow, Pung, Kong by instinct. You need 4 sets + 1 pair to win — drill this until it\'s automatic.' },
  { n: 3, title: 'Build Complete Hands', desc: 'Practice constructing full 14-tile winning hands. Use the Hand Builder to validate your constructions.' },
  { n: 4, title: 'Recognize Tenpai', desc: "Spot when you're one tile away and identify your wait type and winning tiles." },
  { n: 5, title: 'Read the Discards', desc: "Count which tiles have been discarded, and calculate the probability of drawing your winning tile." },
  { n: 6, title: 'Study Scoring', desc: 'Learn which hand structures earn Fan and guide your hand toward higher-value completions without sacrificing speed.' },
  { n: 7, title: 'Master Defensive Play', desc: "Recognize when opponents are close to winning and discard safely. The best players know when not to push." },
];

const SEVERITY_STYLE: Record<string, { bg: string; border: string; badge: string; badgeText: string }> = {
  error:   { bg: 'rgba(239, 68, 68, 0.06)',  border: 'rgba(239, 68, 68, 0.25)',  badge: 'rgba(239,68,68,0.15)',  badgeText: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.06)',    border: 'rgba(245,158,11,0.25)',    badge: 'rgba(245,158,11,0.15)', badgeText: '#f59e0b' },
  caution: { bg: 'rgba(99, 102, 241, 0.06)', border: 'rgba(99, 102, 241, 0.25)', badge: 'rgba(99,102,241,0.15)', badgeText: '#818cf8' },
};

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function StrategyGuide() {
  return (
    <main className="strategy-container">

      {/* ── Hero ── */}
      <div className="strategy-hero">
        <h1>Mahjong Strategy Guide</h1>
        <p>From beginner principles to advanced wait reading — level up your game.</p>
      </div>

      {/* ── 0. Hand Types ── */}
      <div className="strategy-section">
        <div className="section-header">
          <span className="section-icon">🀄</span>
          <h2 className="section-title">The Four Hand Types</h2>
        </div>
        <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          A winning hand is <strong style={{ color: 'var(--text-primary)' }}>4 sets + 1 pair</strong> (14 tiles total).
          Every set is one of these four types — learn them cold before anything else.
        </p>
        <div className="hand-types-grid">
          {HAND_TYPES.map(ht => (
            <div key={ht.name} className="hand-type-card" style={{ '--ht-color': ht.color } as React.CSSProperties}>
              <div className="ht-header">
                <div className="ht-name">{ht.name}</div>
                <div className="ht-chinese">{ht.chinese}</div>
                <div className="ht-role-badge">{ht.role}</div>
              </div>
              <div className="ht-tiles">
                {ht.tiles.map((t, i) => (
                  <div key={i} className="ht-tile">{t}</div>
                ))}
                <span className="ht-count">×{ht.count}</span>
              </div>
              <div className="ht-desc">{ht.desc}</div>
              <ul className="ht-rules">
                {ht.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── 1. Strict Rules ── */}
      <div className="strategy-section">
        <div className="section-header">
          <span className="section-icon">⚠️</span>
          <h2 className="section-title">Strict Rules — Don't Get Penalized</h2>
        </div>
        <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Breaking these rules in formal or competitive play results in penalties, voided hands, or point deductions.
          Memorize them before sitting at any table.
        </p>
        <div className="strict-rules-grid">
          {STRICT_RULES.map(rule => {
            const s = SEVERITY_STYLE[rule.severity];
            return (
              <div key={rule.title} className="strict-rule-card"
                style={{ background: s.bg, borderColor: s.border }}>
                <div className="strict-rule-top">
                  <span className="strict-icon">{rule.icon}</span>
                  <span className="strict-badge" style={{ background: s.badge, color: s.badgeText }}>
                    {rule.severity}
                  </span>
                </div>
                <div className="strict-title">{rule.title}</div>
                <div className="strict-body">{rule.body}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Core Tips ── */}
      <div className="strategy-section">
        <div className="section-header">
          <span className="section-icon">💡</span>
          <h2 className="section-title">Core Principles for Every Player</h2>
        </div>
        <div className="tip-grid">
          {TIPS.map(tip => (
            <div key={tip.title} className="tip-card">
              <div className="tip-icon">{tip.icon}</div>
              <div className="tip-title">{tip.title}</div>
              <div className="tip-body">{tip.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Wait Types ── */}
      <div className="strategy-section">
        <div className="section-header">
          <span className="section-icon">🃏</span>
          <h2 className="section-title">Understanding Wait Types (Tenpai)</h2>
        </div>
        <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          When your hand is one tile away from winning, you're in <strong style={{ color: 'var(--text-primary)' }}>Tenpai</strong>.
          Always aim for the wait type with the most winning tiles.
        </p>
        <div className="wait-gallery">
          {WAITS.map(w => (
            <div key={w.name} className="wait-card">
              <div className="wait-header">
                <div className="wait-header-name">{w.name}</div>
              </div>
              <div className="wait-body">
                <div className="wait-tiles">
                  {w.tiles.map((t, i) => (
                    <div key={i} className={`wt ${t === '·' ? 'wait' : ''}`}>{t === '·' ? '?' : t}</div>
                  ))}
                  <span className="wait-arrow">→</span>
                  <span className="wait-label">
                    waits for <strong>{w.waits.join(' or ')}</strong>
                  </span>
                </div>
                <div className="wait-desc">{w.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Do / Don't ── */}
      <div className="strategy-section">
        <div className="section-header">
          <span className="section-icon">⚖️</span>
          <h2 className="section-title">Do's & Don'ts</h2>
        </div>
        <div className="do-dont-wrapper">
          <div className="do-column">
            <div className="do-header">✓ Do</div>
            {DOS.map((d, i) => (
              <div key={i} className="do-item">
                <span className="mark">✓</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
          <div className="dont-column">
            <div className="dont-header">✗ Don't</div>
            {DONTS.map((d, i) => (
              <div key={i} className="dont-item">
                <span className="mark">✗</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. Mastery Roadmap ── */}
      <div className="strategy-section">
        <div className="section-header">
          <span className="section-icon">🗺️</span>
          <h2 className="section-title">Mastery Roadmap</h2>
        </div>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Improving at Mahjong is a step-by-step journey. This is the recommended order for deliberate practice:
        </p>
        <div className="mastery-list">
          {MASTERY.map((step, i) => (
            <div key={step.n} className="mastery-item">
              <div className="mastery-spine">
                <div className="mastery-dot">{step.n}</div>
                {i < MASTERY.length - 1 && <div className="mastery-line" />}
              </div>
              <div className="mastery-content">
                <div className="mastery-title">{step.title}</div>
                <div className="mastery-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="strategy-cta">
        <h3>Practice makes perfect</h3>
        <p>Apply these strategies in the Hand Builder. Construct your Tenpai hand and see if it validates.</p>
        <div className="cta-buttons">
          <a href="/" className="btn-primary">Open Hand Builder</a>
          <a href="/scoring" className="btn-secondary">Scoring Guide →</a>
        </div>
      </div>

    </main>
  );
}
