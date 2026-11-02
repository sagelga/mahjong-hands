import { MAHJONG_TILES } from '../../../lib/tiles';
import type { TileDef } from '../../../lib/tiles';
import './ExampleHands.css';

const TILE_MAP = new Map(MAHJONG_TILES.map(t => [t.id, t]));

const EXAMPLES = [
  {
    name: 'All Chow',
    description: '4 sequences + 1 pair',
    groups: [3, 3, 3, 3, 2],
    ids: ['c1','c2','c3','c4','c5','c6','c7','c8','c9','d1','d2','d3','b5','b5'],
  },
  {
    name: 'Dragon Pung',
    description: 'Pung of Red Dragons + 3 sequences + pair',
    groups: [3, 3, 3, 3, 2],
    ids: ['h7','h7','h7','c1','c2','c3','d4','d5','d6','b7','b8','b9','h1','h1'],
  },
  {
    name: 'Seven Pairs',
    description: '7 identical pairs',
    groups: [2, 2, 2, 2, 2, 2, 2],
    ids: ['c1','c1','c3','c3','d5','d5','d7','d7','b2','b2','b4','b4','h1','h1'],
  },
];

interface Props {
  onLoadHand: (tiles: TileDef[]) => void;
}

export default function ExampleHands({ onLoadHand }: Props) {
  return (
    <div className="example-hands">
      <p className="example-hands-label">Try an example winning hand</p>
      <div className="example-hands-grid">
        {EXAMPLES.map(ex => {
          const tiles = ex.ids.map(id => TILE_MAP.get(id)!).filter(Boolean);
          let cursor = 0;
          const groups = ex.groups.map(size => {
            const group = tiles.slice(cursor, cursor + size);
            cursor += size;
            return group;
          });

          return (
            <button
              key={ex.name}
              className="example-hand-card"
              onClick={() => onLoadHand(tiles)}
            >
              <div className="example-hand-info">
                <span className="example-hand-name">{ex.name}</span>
                <span className="example-hand-desc">{ex.description}</span>
              </div>
              <div className="example-hand-tiles">
                {groups.map((group, groupIndex) => (
                  <div className="example-tile-group" key={groupIndex}>
                    {group.map((t, i) => (
                      <img
                        key={i}
                        src={t.image}
                        alt=""
                        className="example-tile-img"
                        width={20}
                        height={27}
                        decoding="async"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
