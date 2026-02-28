import './MahjongRules.css';
import { FanCard } from '../../ui/FanCard';
import TileSetViewer from './TileSetViewer';

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

export default function GameComponentsSection() {
  return (
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
  );
}
