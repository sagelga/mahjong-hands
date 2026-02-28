import { useEffect } from 'react';
import type React from 'react';
import type { TileDef } from '../../../lib/tiles';
import './TileGlossary.css';

interface CustomCSSProperties extends React.CSSProperties {
  '--rank-color'?: string;
}

const CHINESE_NUM = ['一','二','三','四','五','六','七','八','九'];
const cn = (n: number) => CHINESE_NUM[Math.max(0, Math.min(8, n - 1))];

const WIND_CHAR: Record<string, string> = { E: '東', S: '南', W: '西', N: '北' };
const DRAGON_CHAR: Record<string, string> = { WHT: '白', GRN: '發', RED: '中' };
const OTHER_DRAGONS: Record<string, [string, string]> = {
  RED: ['發', '白'],
  GRN: ['中', '白'],
  WHT: ['中', '發'],
};

const renderTileChar = (suit: string, value: number | string, char: string) => {
  if (suit === 'Dots') {
    return (
      <div className="ex-tile-dots">
        <div className="ex-tile-num">{value}</div>
        <div className="ex-tile-dot">•</div>
      </div>
    );
  }
  if (suit === 'Bamboo') {
    return (
      <div className="ex-tile-bamboo">
        <div className="ex-tile-num">{value}</div>
        <div className="ex-tile-stick">🎋</div>
      </div>
    );
  }
  return char;
};

interface HandTip {
  name: string;
  chinese: string;
  fan: string;
  desc: string;
  example: (string | null)[];
}

const RANK_COLORS = ['#10b981', '#3b82f6', '#f59e0b'] as const;

function getTileTips(tile: TileDef): { copies: number; tips: HandTip[] } {
  const { suit, value } = tile;

  if (suit === 'Flowers') {
    const isSeason = parseInt(tile.id.slice(1)) > 4;
    const fullSet: string[] = isSeason
      ? ['春', '夏', '秋', '冬']
      : ['梅', '蘭', '菊', '竹'];
    return {
      copies: 1,
      tips: [
        { name: 'Bonus Tile',         chinese: '花牌',   fan: '+1 Fan', example: [],       desc: 'Each Flower or Season tile earns 1 bonus Fan at game end — free points just for drawing it.' },
        { name: 'Full Flower Set',    chinese: '全花',   fan: '+3 Fan', example: fullSet,  desc: 'Collecting all 4 Flowers or all 4 Seasons together earns extra bonus Fan on top of the individual tile scores.' },
        { name: 'Declare Immediately',chinese: '即報花', fan: 'Rule',   example: [],       desc: 'Must be declared and replaced with a wall tile before your next discard. Failing to declare is a violation in formal play.' },
      ],
    };
  }

  if (suit === 'Honors') {
    const isWind = ['E', 'S', 'W', 'N'].includes(value as string);

    if (isWind) {
      const wc = WIND_CHAR[value as string];
      return {
        copies: 4,
        tips: [
          { name: 'Seat Wind Pung',  chinese: '門風刻', fan: '1 Fan',  example: [wc, wc, wc],                desc: 'A triplet of your own seat wind scores 1 Fan automatically. Know your seat position before you sit down.' },
          { name: 'Round Wind Pung', chinese: '圈風刻', fan: '1 Fan',  example: [wc, wc, wc],                desc: 'A triplet of the current round wind earns 1 Fan for any player — not just the one whose seat it matches.' },
          { name: 'All Honors',      chinese: '字一色', fan: '10 Fan', example: [wc, wc, '中', '中', '發'],  desc: 'An entire hand built from Wind and Dragon tiles only. One of the rarest and highest-scoring patterns in Hong Kong Mahjong.' },
        ],
      };
    }

    const dc = DRAGON_CHAR[value as string];
    const others = OTHER_DRAGONS[value as string];
    return {
      copies: 4,
      tips: [
        { name: 'Dragon Pung',           chinese: '箭刻',  fan: '1 Fan',  example: [dc, dc, dc],                             desc: 'A triplet of any Dragon always earns 1 Fan with no conditions — the most reliable single-Fan source in the game.' },
        { name: 'Three Great Scholars',  chinese: '大三元', fan: '8 Fan',  example: [dc, dc, others[0], others[0], others[1]], desc: 'Pungs of all three Dragons in one hand. One of the most prestigious patterns in Hong Kong Mahjong and extremely hard to complete.' },
        { name: 'All Honors',            chinese: '字一色', fan: '10 Fan', example: [dc, dc, '東', '東', '南'],               desc: 'An entire hand of Winds and Dragons only. Nearly impossible to achieve but astronomically high scoring when it lands.' },
      ],
    };
  }

  const num = value as number;
  const isTerminal = num === 1 || num === 9;
  const isMiddle   = num >= 4 && num <= 6;

  if (isTerminal) {
    const seq: string[] = num === 1 ? ['一', '二', '三'] : ['七', '八', '九'];
    const pung: string[] = [cn(num), cn(num), cn(num)];
    const mixed: string[] = num === 1
      ? ['一', '一', '一', '九', '九']
      : ['九', '九', '九', '一', '一'];
    return {
      copies: 4,
      tips: [
        { name: 'Pure Suit',              chinese: '清一色', fan: '7 Fan',  example: seq,   desc: 'Build your entire hand in one suit. Terminal tiles anchor edge sequences or form a terminal triplet — both highly effective in same-suit builds.' },
        { name: 'Mixed Terminals & Honors', chinese: '混么九', fan: '6 Fan', example: mixed, desc: 'Use only 1s, 9s, Winds, and Dragons — no middle tiles allowed. This tile is a required building block for the pattern.' },
        { name: 'Terminal Triplet',       chinese: '么九刻', fan: '+1 Fan', example: pung,  desc: 'A Pung of 1s or 9s adds a Fan bonus in many hand combos. Terminals are harder to form into triplets, so the bonus reflects the difficulty.' },
      ],
    };
  }

  if (isMiddle) {
    const seq3 = [cn(num - 1), cn(num), cn(num + 1)];
    return {
      copies: 4,
      tips: [
        { name: 'All-Chow Hand', chinese: '平和',  fan: '1 Fan',  example: seq3,                                    desc: 'All 4 sets as sequences. Middle tiles (4–6) are critical — they form the most two-sided waits. A 4-5 waits for 3 or 6; a 5-6 waits for 4 or 7.' },
        { name: 'Pure Suit',     chinese: '清一色', fan: '7 Fan',  example: [cn(num-2), cn(num-1), cn(num), cn(num+1)], desc: 'Build the entire hand in one suit. Middle tiles connect freely, making them the backbone of high-scoring same-suit hands.' },
        { name: 'Half-Flush',    chinese: '混一色', fan: '3 Fan',  example: [...seq3, '中', '中'],                  desc: 'Mix one numbered suit with Wind/Dragon tiles. Middle tiles make forming in-suit sequences easier, freeing slots for Honor tile triplets.' },
      ],
    };
  }

  const seq3 = [cn(num - 1), cn(num), cn(num + 1)];
  const waitPair: (string | null)[] = num <= 4
    ? [cn(num), cn(num + 1), null]
    : [cn(num - 1), cn(num), null];
  return {
    copies: 4,
    tips: [
      { name: 'Two-Sided Wait',  chinese: '兩面聽牌', fan: 'Best Wait', example: waitPair, desc: 'Tiles 2–3 wait for 1 or 4; tiles 7–8 wait for 6 or 9. Always prefer a two-sided wait — it doubles your winning tile count vs. a middle or edge wait.' },
      { name: 'Pure Suit',       chinese: '清一色',   fan: '7 Fan',     example: seq3,     desc: 'Build the entire hand in one suit. Semi-terminal tiles bridge mid-range and edge sequences, making them versatile for same-suit construction.' },
      { name: 'All-Chow Hand',   chinese: '平和',     fan: '1 Fan',     example: seq3,     desc: 'All 4 sets as sequences. Tiles like 2, 3, 7, 8 connect toward both terminals and middle tiles — solid Chow-building blocks for the Ping-He pattern.' },
    ],
  };
}

interface TileDrawerProps {
  tile: TileDef;
  onClose: () => void;
}

export default function TileDrawer({ tile, onClose }: TileDrawerProps) {
  const { copies, tips } = getTileTips(tile);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="tile-drawer" role="dialog" aria-label={`${tile.name} details`}>

        <div className="drawer-header">
          <img src={tile.image} alt={tile.name} className="drawer-tile-img" />
          <div className="drawer-title-group">
            <div className="drawer-tile-name">{tile.name}</div>
            <div className="drawer-tile-suit">{tile.suit}</div>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="drawer-copies-badge">
          <span className="copies-dot" />
          <span>
            <strong>{copies}</strong> {copies === 1 ? 'copy' : 'copies'} of this tile exist in the 144-tile deck
          </span>
        </div>

        <div className="drawer-section-label">Top Hands Using This Tile</div>

        <div className="drawer-tips">
          {tips.map((tip, i) => (
            <div key={i} className="drawer-tip-card" style={{ '--rank-color': RANK_COLORS[i] } as CustomCSSProperties}>
              <div className="tip-card-top">
                <div className="tip-rank" style={{ background: RANK_COLORS[i] }}>#{i + 1}</div>
                <div className="tip-names">
                  <span className="tip-name">{tip.name}</span>
                  <span className="tip-chinese">{tip.chinese}</span>
                </div>
                <div className="tip-fan">{tip.fan}</div>
              </div>
              <div className="tip-card-desc">{tip.desc}</div>
              {tip.example.length > 0 && (
                <div className="tip-example">
                  {tip.example.map((char, j) =>
                    char === null
                      ? <div key={j} className="ex-tile ex-tile--grey" />
                      : <div key={j} className="ex-tile">{renderTileChar(tile.suit, tile.value, char)}</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

      </aside>
    </>
  );
}
