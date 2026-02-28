import './MahjongRules.css';
import { memo, useState } from 'react';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import { FanCard } from '../../ui/FanCard';
import { CtaCard } from '../../ui/CtaCard';
import TileKeyboard from '../builder/TileKeyboard';
import type { Suit } from '../../../lib/tiles';
import LearnPageNav from './LearnPageNav';

// ── DATA ─────────────────────────────────────────────────────────────────────

const SUIT_CARDS = [
  {
    label: 'Characters',
    chinese: 'Wàn (萬)',
    desc: 'Numbers 1–9 written as Chinese numerals',
    count: 36,
    accent: 'red' as const,
  },
  {
    label: 'Dots',
    chinese: 'Tǒng (筒)',
    desc: 'Numbers 1–9 shown as circles',
    count: 36,
    accent: 'blue' as const,
  },
  {
    label: 'Bamboo',
    chinese: 'Tiáo (條)',
    desc: 'Numbers 1–9 shown as bamboo sticks',
    count: 36,
    accent: 'green' as const,
  },
  {
    label: 'Honors',
    chinese: 'Zìpái (字牌)',
    desc: 'Winds (East, South, West, North) and Dragons (Red, Green, White)',
    count: 28,
    accent: 'amber' as const,
  },
];

const WIN_CONDITIONS = [
  {
    fan: '4+1',
    title: 'Sets & Pair',
    desc: 'Four groups of tiles (Chow, Pung, or Kong) plus one matching pair — the most common winning pattern.',
    accent: 'green' as const,
  },
  {
    fan: '7',
    title: 'Seven Pairs',
    desc: 'Seven different pairs of identical tiles. Allowed in most variants — a fun alternative route to winning.',
    accent: 'violet' as const,
  },
];

const HAND_TYPES = [
  {
    name: 'Pair',
    chinese: '對 Duì',
    tiles: ['5', '5'],
    color: 'var(--accent-primary)',
    role: 'Pair set',
    desc: 'Every winning hand needs exactly one pair, called the "eyes."',
    rules: [
      'Exactly one pair per winning hand',
      'Must be two of the same tile',
      'Cannot be made from partial sequences',
    ],
  },
  {
    name: 'Chow',
    chinese: '吃 Chī',
    tiles: ['4', '5', '6'],
    color: '#3b82f6',
    role: 'Sequence set',
    desc: 'Three consecutive numbers in the same suit (e.g. 4-5-6 of Bamboo).',
    rules: [
      'Same suit only — no mixing',
      'Consecutive numbers (1–9 only)',
      'Cannot use Winds or Dragons',
      "Can only be claimed from the left player's discard",
    ],
  },
  {
    name: 'Pung',
    chinese: '碰 Pèng',
    tiles: ['7', '7', '7'],
    color: '#f59e0b',
    role: 'Triplet set',
    desc: "Three identical tiles. Works with any tile type.",
    rules: [
      'Three of the exact same tile',
      'Can use any tile including Winds and Dragons',
      "Can be claimed from any player's discard",
      'Becomes exposed (visible to all) when claimed',
    ],
  },
  {
    name: 'Kong',
    chinese: '槓 Gàng',
    tiles: ['9', '9', '9', '9'],
    color: '#ef4444',
    role: 'Quadruplet set',
    desc: 'Full collection of the identical tiles. Even if it have four tiles, it will count as one set.',
    rules: [
      'Four of the exact same tile',
      'Must be declared — grants one extra tile draw',
      'Counts as a single set (3 tiles) for winning purposes',
      'Three types: Concealed Kong (4 self-drawn), Exposed Kong (3-Pung + claimed 4th), Upgraded Kong (add to own Pung)',
    ],
  },
];

function TileSetViewer() {
  const [activeFilter, setActiveFilter] = useState<Suit | 'All'>('Dots');
  return (
    <div className="tile-set-viewer">
      <TileKeyboard
        onTileClick={() => {}}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        currentTiles={[]}
      />
    </div>
  );
}

// ── SECTIONS ──────────────────────────────────────────────────────────────────

function HandTypesSection() {
  return (
    <div className="rules-section">
      <h2>Pairs, Chow, Pung and Kong</h2>
      <p className="rules-body">
        What is the difference between Chow, Pung, and Kong? Here's the comparison for these options.
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
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

const MahjongRules = () => {
  return (
    <PageContent className="rules-container">
      <PageHeader
        title="How to Play Mahjong"
        subtitle="The tiles, the sets, and the flow of play — everything you need to get started."
      />

      {/* ── 1. Game Components ── */}
      <div className="rules-section">
        <h2>Game components</h2>
        <p className="rules-body">
          In most variant, there are total of <strong>144 tiles</strong> included in the box, a dice, and a wind tracker. But we are going to focus on the tiles first.
        </p>
        <p className="rules-body">
          If you are playing poker, you are more familar with Club, Heart, Diamond, Spade. The goes the same as mahjong, but this one is stone-sized and comes in these four suits:
        </p>
        <div className="rules-fan-grid">
          {SUIT_CARDS.map(suit => (
            <FanCard
              key={suit.label}
              fan={suit.count}
              fanLabel="tiles"
              title={`${suit.label} or ${suit.chinese}`}
              description={suit.desc}
              accent={suit.accent}
            />
          ))}
        </div>
        <p className="rules-body">
          Characters, Dots, and Bamboo each have face numbers value range from 1 to 9, with 4 copies of each tile — just like having four decks of poker cards. Honors in the other hand, use Chinese characters for Winds and Dragons, also with 4 copies per face.
        </p>

         <p className="rules-body">For new players that can't read Chinese, don't worry about what it mean in your language. You only need to recognize the patterns so you can match it within your hand. Click the Characters, Dots, Bamboos, Honors and Flowers down below to see what the card looks like.</p>

        <TileSetViewer />

        <p className="rules-body">
          Did you notice the 8 tiles are missing from 32+32+32+28 tiles above? These are called flowers and seasons and it worked as a score bonus. We will go through that later in the scoring section.
        </p>
      </div>

      {/* ── 2. How to Win ── */}
      <div className="rules-section">
        <h2>How to win in mahjong</h2>
        <p className="rules-body">
          In mahjong, we will play in multiple rounds, with at least 4 rounds will be played in a single game. This allows everyone to take part as a banker and start the round first. But we will walkthrough all the stages of the games later.
        </p>

        <p className="rules-body">
          For each round, 4 players will each have <strong>13 tiles in their hand</strong> either hidden (concealed) or declaired (melded), and combined with another one tile from previous player's discard tile or drawn from the center (known as wall) forming a 14-tile that can consists of:
        </p>
        <div className="rules-fan-grid">
          {WIN_CONDITIONS.map(w => (
            <FanCard
              key={w.title}
              fan={w.fan}
              title={w.title}
              description={w.desc}
              accent={w.accent}
            />
          ))}
        </div>
       <p className="rules-body">
        Disclaimer: For new people that want to learn a generic mahjong ruleset, stick with the 4 sets and 1 pair. Other game variants might have something that is on top of this basic rule.
        </p>
      </div>

      {/* ── 3. Hand Types ── */}
      <HandTypesSection />

      {/* ── Closing ── */}
      <div className="rules-section">
        <p className="rules-body">
          Players must use their strategies to win the games before the tile runs out from the wall. The game ends when player cannot play any further move or the player announced the win.
        </p>
        <p className="rules-body">
          In the next page, you will learn how to setup the game.
        </p>
      </div>

      {/* ── CTA ── */}
      <CtaCard
        title="Practice what you've learned"
        description="Use the Hand Builder to construct valid winning hands and test your understanding of the four set types."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Tile Glossary →', href: '/glossary', variant: 'secondary' },
        ]}
      />
      <LearnPageNav />
    </PageContent>
  );
};

export default memo(MahjongRules);
