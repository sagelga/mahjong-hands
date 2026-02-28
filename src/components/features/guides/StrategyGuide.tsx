import './StrategyGuide.css';
import { CtaCard } from '../../ui/CtaCard';
import { SectionHeader } from '../../ui/SectionHeader';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import LearnPageNav from './LearnPageNav';
import WaitTypePractice from './WaitTypePractice';

// ── DATA ─────────────────────────────────────────────────────────────────────


const STRICT_RULES = [
  {
    icon: '⚖️',
    severity: 'important',
    title: 'Winner claims first',
    body: 'If you will win the hand by claiming a discarded tile, you get priority over anyone else that might need it for chow/pung/kong.',
  },
  {
    icon: '🃏',
    severity: 'important',
    title: 'Chow = Left Player Only',
    body: 'A Chow (sequence of 3) can ONLY be claimed from the discard of your left-hand neighbor. You cannot Chow from the tile discarded by the opposite or right player.',
  },
  {
    icon: '🃏',
    severity: 'important',
    title: 'Pung/Kong = skip player',
    body: 'When a player discard your missing tile to form a Pung or Kong, you can claim it immediately, and its now your turn. You still have to discard a tile to end your turn.',
  },
  {
    icon: '🧮',
    severity: 'important',
    title: 'Always end the turn with 13 tiles',
    body: 'After your turn ends, you must have exactly 13 tiles, including ones you already exposed. Flowers and kongs don\'t count towards the 13 tiles.',
  },
  {
    icon: '🚫',
    severity: 'important',
    title: 'Expose tile immediately',
    body: 'When you choose to pick a tile from discard, you must immediately expose it on the table (known as melded set). You cannot hold it in your hand and discard it later.'
  },
  {
    icon: '🚫',
    severity: 'warning',
    title: 'Discard or wall tile? Choose one.',
    body: 'When you draw, you either take it from discard (to form a valid melded set), or draw a new tile from the wall. You cannot draw both or meld when you don\'t have the tile to form sequence set.'
  },
  {
    icon: '🔒',
    severity: 'warning',
    title: 'No changing minds',
    body: 'Once you claim a tile and expose a meld on the table, those tiles are locked. You cannot break them apart later to form other combinations with your concealed hand.',
  },
  {
    icon: '🎯',
    severity: 'warning',
    title: 'You Can Win From Anyone',
    body: 'Unlike a Chow, you can claim the final tile you need to complete your 14-tile winning hand (Mahjong) from ANY player\'s discard, not just the player to your left.',
  },
  {
    icon: '♻️',
    severity: 'caution',
    title: 'No Immediate Identical Discard',
    body: 'If you claim a discarded tile to complete a Chow (e.g., taking a 3 to make a 1-2-3), you generally cannot immediately discard the exact same tile (a 3) from your hand on that same turn.',
  },
  {
    icon: '🕵️',
    severity: 'warning',
    title: 'Keep Self-Drawn Melds Hidden',
    body: 'If you complete a Chow, Pung, or Kong entirely by drawing from the wall, keep it hidden in your hand! Beginners often expose them early, but doing so gives away free information and may invalidate certain "Concealed Hand" scoring conditions.',
  },
  {
    icon: '🔢',
    severity: 'caution',
    title: 'Kongs Require a Replacement',
    body: 'When you declare a Kong (4-of-a-kind), you must draw a replacement tile from the back end of the wall before discarding. If you forget, your hand will be short a tile and declared dead.',
  },
  {
    icon: '🥷',
    severity: 'warning',
    title: 'Robbing the Kong',
    body: 'If a player draws a tile and adds it to their exposed Pung to promote it to a Kong, and that specific tile is the one you need to win, you can claim it! This rare move is called "Robbing the Kong".',
  },
  {
    icon: '⏱️',
    severity: 'caution',
    title: 'Only the Latest Discard is Valid',
    body: 'You can only claim the last tile that was discarded. The moment the next player touches a tile to draw from the wall, the previous discard is "dead" and can no longer be claimed by anyone.',
  },
  {
    icon: '🌸',
    severity: 'caution',
    title: 'Flower Require a Replacement',
    body: 'When you draw a flower, you must immediately replace it with a tile from the wall. If you forget, your hand will be short a tile and declared dead.',
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
  important: { bg: 'rgba(239, 68, 68, 0.06)', border: 'rgba(239, 68, 68, 0.25)', badge: 'rgba(239,68,68,0.15)', badgeText: '#ef4444' },
  warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)', badge: 'rgba(245,158,11,0.15)', badgeText: '#f59e0b' },
  caution: { bg: 'rgba(99, 102, 241, 0.06)', border: 'rgba(99, 102, 241, 0.25)', badge: 'rgba(99,102,241,0.15)', badgeText: '#818cf8' },
};

// ── SECTION COMPONENTS ────────────────────────────────────────────────────────

function StrictRulesSection() {
  return (
    <div className="strategy-section">
      <SectionHeader icon="⚠️" title="Don't Get Penalized!" />
      <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Breaking these rules, especially in a competitive play results you in score penalties.
        Memorize these rules so you can get along with others well!
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
  );
}

function TipsSection() {
  return (
    <div className="strategy-section">
      <SectionHeader icon="💡" title="Core Principles for Every Player" />
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
  );
}

function WaitsSection() {
  return (
    <div className="strategy-section">
      <SectionHeader icon="🃏" title="Understanding Wait Types (Tenpai)" />
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
  );
}

function DoDontSection() {
  return (
    <div className="strategy-section">
      <SectionHeader icon="⚖️" title="Do's & Don'ts" />
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
  );
}

function StepByStepGuide() {
  return (
    <div className="strategy-section">
      <SectionHeader icon="🗺️" title="Mastery Roadmap" />
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
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function StrategyGuide() {
  return (
    <PageContent className="strategy-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Mahjong Strategy Guide"
        subtitle="Level up your mahjong skills and learn how to score more!"
      />

      {/* ── Sections ── */}

      <StrictRulesSection />
      <TipsSection />
      <WaitsSection />

      {/* ── Interactive wait-type quiz ── */}
      <div className="strategy-section">
        <SectionHeader icon="🎯" title="Test Your Knowledge — Wait Types" />
        <p style={{ marginBottom: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Read the tiles shown and pick the correct wait type. The missing tile(s) will be revealed after you answer.
        </p>
        <WaitTypePractice />
      </div>

      <DoDontSection />
      <StepByStepGuide />

      <CtaCard
        title="Practice makes perfect"
        description="Apply these strategies in the Hand Builder. Construct your Tenpai hand and see if it validates."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Scoring Guide →', href: '/scoring', variant: 'secondary' },
        ]}
      />
      <LearnPageNav />
    </PageContent>
  );
}
