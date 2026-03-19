import { MAHJONG_TILES, type TileDef } from './tiles';
import { findWaitingTiles, type WaitingTile } from './tenpaiDetector';

export interface ExposedSet {
  tiles: TileDef[];
  type: 'Pung' | 'Chow' | 'Kong';
}

export interface PracticeScenario {
  hand: TileDef[];
  discards: TileDef[];
  opponents: { label: string; sets: ExposedSet[] }[];
  waitingTiles: WaitingTile[];
}

type NumberedSuit = 'Characters' | 'Dots' | 'Bamboo';

const NUMBERED_SUITS: NumberedSuit[] = ['Characters', 'Dots', 'Bamboo'];
const CANDIDATES = MAHJONG_TILES.filter(t => t.suit !== 'Flowers');

function getTile(suit: string, value: number): TileDef | undefined {
  return MAHJONG_TILES.find(t => t.suit === suit && t.value === value);
}

function randomSuit(): NumberedSuit {
  return NUMBERED_SUITS[Math.floor(Math.random() * 3)];
}

function countMap(tiles: TileDef[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tiles) map.set(t.id, (map.get(t.id) || 0) + 1);
  return map;
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
}

const SUIT_ORDER: Record<string, number> = {
  Characters: 0, Dots: 1, Bamboo: 2, Honors: 3, Flowers: 4,
};

function sortTiles(tiles: TileDef[]): TileDef[] {
  return [...tiles].sort((a, b) => {
    const sd = (SUIT_ORDER[a.suit] ?? 5) - (SUIT_ORDER[b.suit] ?? 5);
    if (sd !== 0) return sd;
    const av = typeof a.value === 'number' ? a.value : 99;
    const bv = typeof b.value === 'number' ? b.value : 99;
    return av - bv;
  });
}

/**
 * Build a random 13-tile tenpai hand using structured wait patterns:
 * 3 chows (one per suit) as the base, then one of six wait completions.
 */
function buildTenpaiHand(): TileDef[] | null {
  // Base: one chow per suit
  const hand: TileDef[] = [];
  for (let i = 0; i < 3; i++) {
    const start = Math.floor(Math.random() * 7) + 1;
    for (let v = start; v <= start + 2; v++) {
      const t = getTile(NUMBERED_SUITS[i], v);
      if (!t) return null;
      hand.push(t);
    }
  }

  const waitType = Math.floor(Math.random() * 6);

  if (waitType === 0) {
    // Tanki: 3 chows + honor pung + 1 lone tile
    const honors = MAHJONG_TILES.filter(t => t.suit === 'Honors');
    const h = honors[Math.floor(Math.random() * honors.length)];
    const lone = getTile(randomSuit(), Math.floor(Math.random() * 9) + 1);
    if (!lone) return null;
    hand.push(h, h, h, lone);
  } else if (waitType === 1) {
    // Ryanmen (two-sided sequence): pair + X-(X+1), X in 2-7
    const pair = getTile(randomSuit(), Math.floor(Math.random() * 9) + 1);
    const suit = randomSuit();
    const start = Math.floor(Math.random() * 6) + 2;
    const r1 = getTile(suit, start);
    const r2 = getTile(suit, start + 1);
    if (!pair || !r1 || !r2) return null;
    hand.push(pair, pair, r1, r2);
  } else if (waitType === 2) {
    // Kanchan (middle): pair + X-(X+2), waiting for X+1
    const pair = getTile(randomSuit(), Math.floor(Math.random() * 9) + 1);
    const suit = randomSuit();
    const start = Math.floor(Math.random() * 7) + 1;
    const k1 = getTile(suit, start);
    const k2 = getTile(suit, start + 2);
    if (!pair || !k1 || !k2) return null;
    hand.push(pair, pair, k1, k2);
  } else if (waitType === 3) {
    // Penchan low: pair + 1-2, waiting for 3
    const pair = getTile(randomSuit(), Math.floor(Math.random() * 9) + 1);
    const suit = randomSuit();
    const p1 = getTile(suit, 1);
    const p2 = getTile(suit, 2);
    if (!pair || !p1 || !p2) return null;
    hand.push(pair, pair, p1, p2);
  } else if (waitType === 4) {
    // Penchan high: pair + 8-9, waiting for 7
    const pair = getTile(randomSuit(), Math.floor(Math.random() * 9) + 1);
    const suit = randomSuit();
    const p8 = getTile(suit, 8);
    const p9 = getTile(suit, 9);
    if (!pair || !p8 || !p9) return null;
    hand.push(pair, pair, p8, p9);
  } else {
    // Shanpon (dual pair): 3 chows + two different pairs
    const suit1 = randomSuit();
    const val1 = Math.floor(Math.random() * 9) + 1;
    const suit2 = randomSuit();
    const val2 = Math.floor(Math.random() * 9) + 1;
    const p1 = getTile(suit1, val1);
    const p2 = getTile(suit2, val2);
    if (!p1 || !p2 || p1.id === p2.id) return null;
    hand.push(p1, p1, p2, p2);
  }

  if (hand.length !== 13) return null;
  if ([...countMap(hand).values()].some(c => c > 4)) return null;
  return hand;
}

/**
 * Build a single valid exposed set — either a Pung (3 identical tiles)
 * or a Chow (3 consecutive tiles of the same numbered suit).
 * usedCounts tracks how many copies of each tile are already accounted for
 * across the player's hand and any previously built sets, so we never exceed
 * the 4-copy limit.
 */
function buildExposedSet(pool: TileDef[], usedCounts: Map<string, number>): ExposedSet | null {
  const remaining = (t: TileDef) => 4 - (usedCounts.get(t.id) || 0);
  const usePung = Math.random() > 0.5;

  if (usePung) {
    const pungPool = pool.filter(t => remaining(t) >= 3);
    if (pungPool.length > 0) {
      const tile = pungPool[Math.floor(Math.random() * pungPool.length)];
      return { tiles: [tile, tile, tile], type: 'Pung' };
    }
    // fall through to Chow if no valid pung tile
  }

  // Chow: find any numbered tile in the pool that can start a 3-tile run,
  // ensuring all three tiles have at least 1 copy remaining.
  const numbered = pool.filter(
    t => (t.suit === 'Characters' || t.suit === 'Dots' || t.suit === 'Bamboo') &&
         typeof t.value === 'number' && (t.value as number) <= 7 &&
         remaining(t) >= 1,
  );
  const shuffledNumbered = [...numbered].sort(() => Math.random() - 0.5);

  for (const start of shuffledNumbered) {
    const v = start.value as number;
    const mid  = MAHJONG_TILES.find(t => t.suit === start.suit && t.value === v + 1);
    const high = MAHJONG_TILES.find(t => t.suit === start.suit && t.value === v + 2);
    if (mid && high && remaining(mid) >= 1 && remaining(high) >= 1) {
      return { tiles: [start, mid, high], type: 'Chow' };
    }
  }

  // Fallback: try pung if chow failed
  const pungPool = pool.filter(t => remaining(t) >= 3);
  if (pungPool.length === 0) return null;
  const tile = pungPool[Math.floor(Math.random() * pungPool.length)];
  return { tiles: [tile, tile, tile], type: 'Pung' };
}

const FALLBACK_HAND: TileDef[] = [
  'c1','c2','c3','d1','d2','d3','b1','b2','b3','h1','h1','h1','h2',
].map(id => MAHJONG_TILES.find(t => t.id === id)!);

export function generateScenario(): PracticeScenario {
  let hand: TileDef[] | null = null;
  let waitingTileTypes: TileDef[] = [];

  for (let attempt = 0; attempt < 150; attempt++) {
    const candidate = buildTenpaiHand();
    if (!candidate) continue;
    const w = findWaitingTiles(candidate, [], CANDIDATES);
    if (w.length > 0) {
      hand = candidate;
      waitingTileTypes = w.map(wt => wt.tile);
      break;
    }
  }

  if (!hand) {
    hand = FALLBACK_HAND;
    waitingTileTypes = [MAHJONG_TILES.find(t => t.id === 'h2')!];
  }

  // Generate context tiles (discards + opponents) from what's left in the pool
  const handCounts = countMap(hand);
  const pool = pickRandom(
    CANDIDATES.filter(t => (handCounts.get(t.id) || 0) < 4),
    40,
  );

  const discards = pool.slice(0, Math.floor(Math.random() * 7) + 4);

  // usedCounts tracks copies consumed across hand + all built sets so we
  // never generate a set that would require more than 4 copies of any tile.
  const usedCounts = new Map(handCounts);

  const opponents: PracticeScenario['opponents'] = [];
  for (let p = 2; p <= 4; p++) {
    const setCount = Math.floor(Math.random() * 3); // 0-2 exposed sets each
    const sets: ExposedSet[] = [];
    for (let s = 0; s < setCount; s++) {
      const set = buildExposedSet(pool, usedCounts);
      if (set) {
        sets.push(set);
        // Account for these tiles in future set generation
        for (const t of set.tiles) {
          usedCounts.set(t.id, (usedCounts.get(t.id) || 0) + 1);
        }
      }
    }
    opponents.push({ label: `Player ${p}`, sets });
  }

  // Compute remaining counts using the full scenario context so the component
  // doesn't have to re-derive them separately.
  const scenarioCounts = countMap([
    ...hand,
    ...discards,
    ...opponents.flatMap(o => o.sets.flatMap(s => s.tiles)),
  ]);
  const waitingTiles: WaitingTile[] = waitingTileTypes.map(tile => ({
    tile,
    remaining: Math.max(0, 4 - (scenarioCounts.get(tile.id) || 0)),
  }));

  return {
    hand: sortTiles(hand),
    discards: sortTiles(discards),
    opponents,
    waitingTiles,
  };
}
