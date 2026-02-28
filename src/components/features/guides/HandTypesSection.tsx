import './MahjongRules.css';
import type React from 'react';

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

export default function HandTypesSection() {
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
