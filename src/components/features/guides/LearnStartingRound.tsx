import './MahjongRules.css';
import './LearnStartingRound.css';
import type React from 'react';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import LearnPageNav from './LearnPageNav';
import { FanCard } from '../../ui/FanCard';
import { InfoBox } from '../../ui/InfoBox';
import { CtaCard } from '../../ui/CtaCard';

const WINDS = [
  { name: 'East',  chinese: '東 Dōng', role: 'Dealer — goes first',  color: '#ef4444', order: 1 },
  { name: 'South', chinese: '南 Nán',  role: 'Second player',        color: '#3b82f6', order: 2 },
  { name: 'West',  chinese: '西 Xī',   role: 'Third player',         color: '#10b981', order: 3 },
  { name: 'North', chinese: '北 Běi',  role: 'Fourth player',        color: '#f59e0b', order: 4 },
];

const CLAIMS = [
  {
    name: 'Chow',
    chinese: '吃 Chī',
    color: '#3b82f6',
    from: 'Left player only',
    example: ['4', '5', '6'],
    desc: 'Claim a discard to complete a sequence of 3 consecutive tiles in the same suit.',
    rules: [
      'Only from the player directly on your left',
      'Must form a consecutive sequence (e.g. 4-5-6)',
      'Numbers only — no Winds or Dragons',
      'Set is exposed (visible to all)',
    ],
  },
  {
    name: 'Pung',
    chinese: '碰 Pèng',
    color: '#f59e0b',
    from: 'Any player',
    example: ['7', '7', '7'],
    desc: 'Claim a discard to complete a triplet of 3 identical tiles.',
    rules: [
      'From any player at the table',
      'You must already hold 2 matching tiles',
      'Works with any tile type including honors',
      'Set is exposed (visible to all)',
    ],
  },
  {
    name: 'Kong',
    chinese: '槓 Gàng',
    color: '#ef4444',
    from: 'Any player',
    example: ['9', '9', '9', '9'],
    desc: 'Claim a discard to complete a quadruplet of 4 identical tiles. Grants one extra draw.',
    rules: [
      'From any player at the table',
      'You must already hold 3 matching tiles',
      'Declare Kong, then draw an extra tile from the back of the wall',
      'Counts as one set of 3 when winning',
    ],
  },
  {
    name: 'Win',
    chinese: '和 Hú',
    color: '#10b981',
    from: 'Any player',
    example: ['Hú'],
    desc: 'Claim the discard that completes your winning 14-tile hand. Announce your win!',
    rules: [
      'From any player at the table',
      'The tile must complete a valid 14-tile hand',
      'Declare "Hú!" to win the round',
      'Highest priority — beats all other claims',
    ],
  },
];

export default function LearnStartingRound() {
  return (
    <PageContent className="rules-container">
      <PageHeader
        title="Starting the Round"
        subtitle="How to build the wall, assign wind seats, and kick off a round of Mahjong."
      />

      {/* ── Before you play ── */}
      <div className="rules-section">
        <h2>Before you play</h2>
        <p className="rules-body">
          Get comfortable — grab your snacks, seat everyone around the table, and tip all 144 tiles face-down into the center. Then each player builds their section of the wall.
        </p>
        <div className="rules-fan-grid">
          <FanCard fan={4} fanLabel="players" title="Seats" description="One player per side — East, South, West, North." accent="green" />
          <FanCard fan={144} fanLabel="tiles" title="Full tile set" description="Shuffle everything face-down before building." accent="blue" />
          <FanCard fan="18×2" title="Wall per player" description="Each player stacks 18 tiles wide, 2 tiles tall in front of them." accent="amber" />
        </div>
      </div>

      {/* ── Building the wall ── */}
      <div className="rules-section">
        <h2>Building the wall</h2>
        <p className="rules-body">
          After shuffling, each player pushes tiles into a row of <strong>18 tiles wide, 2 tiles tall</strong>, face-down. The four wall sections form a closed square — your drawing pile for the round.
        </p>

        <div className="starting-wall-demo">
          <div className="wall-row">
            {Array.from({ length: 18 }).map((_, i) => <div key={i} className="wall-tile" />)}
          </div>
          <div className="wall-row">
            {Array.from({ length: 18 }).map((_, i) => <div key={i} className="wall-tile" />)}
          </div>
          <p className="wall-caption">Your wall section — 18 × 2 tiles, face-down</p>
        </div>

        <p className="rules-body">
          All four sections connect end-to-end. Tiles are drawn from the open end during the game. When the wall runs out, the round ends in a draw.
        </p>
      </div>

      {/* ── Wind positions ── */}
      <div className="rules-section">
        <h2>Wind positions</h2>
        <p className="rules-body">
          Roll the dice to determine the first dealer — they take the <strong>East</strong> seat. Positions then go counter-clockwise: East → South → West → North.
        </p>
        <div className="starting-winds-grid">
          {WINDS.map(w => (
            <div
              key={w.name}
              className="starting-wind-card"
              style={{ '--wind-color': w.color } as React.CSSProperties}
            >
              <div className="wind-order">{w.order}</div>
              <div className="wind-name">{w.name}</div>
              <div className="wind-chinese">{w.chinese}</div>
              <div className="wind-role">{w.role}</div>
            </div>
          ))}
        </div>
        <InfoBox accent="amber">
          After each round, wind positions rotate counter-clockwise — the player who was South becomes the new East (dealer). A full game ends when every player has held the East seat at least once.
        </InfoBox>
      </div>

      {/* ── Game flow ── */}
      <div className="rules-section">
        <h2>How a round begins</h2>
        <p className="rules-body">
          Once the wall is built and seats are assigned, follow these steps to start:
        </p>
        <ol className="rules-steps">
          <li className="rules-step">
            <span className="rules-step-text">
              <strong>Deal 13 tiles each.</strong> Starting with East and going counter-clockwise, each player draws 13 tiles from the wall.
            </span>
          </li>
          <li className="rules-step">
            <span className="rules-step-text">
              <strong>East draws the 14th tile.</strong> The dealer immediately draws one extra tile to begin their first turn.
            </span>
          </li>
          <li className="rules-step">
            <span className="rules-step-text">
              <strong>Reveal any flower tiles.</strong> Flowers are placed face-up and immediately replaced by drawing from the back of the wall.
            </span>
          </li>
          <li className="rules-step">
            <span className="rules-step-text">
              <strong>East discards.</strong> The dealer chooses one tile to discard face-up to the center, ending their turn.
            </span>
          </li>
          <li className="rules-step">
            <span className="rules-step-text">
              <strong>Play continues clockwise.</strong> Each player either claims the last discard (to form a set) or draws from the wall, then discards one tile.
            </span>
          </li>
        </ol>
      </div>

      {/* ── Claiming discards ── */}
      <div className="rules-section">
        <h2>Claiming a discarded tile</h2>
        <p className="rules-body">
          Instead of drawing from the wall, you can claim the most recent discard — but only if it completes a valid set or wins your hand. There are four ways to claim:
        </p>
        <div className="hand-types-grid">
          {CLAIMS.map(c => (
            <div
              key={c.name}
              className="hand-type-card"
              style={{ '--ht-color': c.color } as React.CSSProperties}
            >
              <div className="ht-header">
                <div className="ht-name">{c.name}</div>
                <div className="ht-chinese">{c.chinese}</div>
                <div className="ht-role-badge">{c.from}</div>
              </div>
              <div className="ht-tiles">
                {c.example.map((t, i) => <div key={i} className="ht-tile">{t}</div>)}
              </div>
              <div className="ht-desc">{c.desc}</div>
              <ul className="ht-rules">
                {c.rules.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <InfoBox accent="blue">
          <strong>Claim priority:</strong> Win &gt; Kong &gt; Pung &gt; Chow. If multiple players want the same discard, the higher-priority claim wins. Chow has the lowest priority and is only available from the left player.
        </InfoBox>
      </div>

      {/* ── Key rules ── */}
      <div className="rules-section">
        <h2>Rules to keep in mind</h2>
        <ol className="rules-steps">
          <li className="rules-step">
            <span className="rules-step-text">
              Always end your turn with exactly <strong>13 tiles</strong> in your hand (flowers and Kongs don't count toward this limit).
            </span>
          </li>
          <li className="rules-step">
            <span className="rules-step-text">
              When you draw a flower tile, <strong>reveal it immediately</strong> and draw a replacement from the back of the wall.
            </span>
          </li>
          <li className="rules-step">
            <span className="rules-step-text">
              Claimed sets are <strong>exposed</strong> — lay them face-up in front of you so all players can see them.
            </span>
          </li>
          <li className="rules-step">
            <span className="rules-step-text">
              A Kong grants an extra draw, but you must <strong>declare it openly</strong> before drawing the replacement tile.
            </span>
          </li>
        </ol>
      </div>

      <CtaCard
        title="Practice assembling a hand"
        description="Use the Hand Builder to experiment with Chows, Pungs, and Kongs before your next game."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Learn Strategy →', href: '/learn/strategy', variant: 'secondary' },
        ]}
      />

      <LearnPageNav />
    </PageContent>
  );
}
