import { findWaitingTiles } from '../src/lib/tenpaiDetector';
import type { TileDef, Suit } from '../src/lib/tiles';

// Build a minimal TileDef from an id — avoids import.meta.url used by MAHJONG_TILES
function tile(id: string): TileDef {
  const suitMap: Record<string, Suit> = {
    c: 'Characters', d: 'Dots', b: 'Bamboo', h: 'Honors', f: 'Flowers',
  };
  const honorValues: Record<number, string> = {
    1: 'E', 2: 'S', 3: 'W', 4: 'N', 5: 'WHT', 6: 'GRN', 7: 'RED',
  };
  const match = id.match(/^([cdbhf])(\d+)$/);
  if (!match) throw new Error(`Unknown tile id: ${id}`);
  const [, prefix, numStr] = match;
  const num = parseInt(numStr, 10);
  return {
    id,
    suit: suitMap[prefix],
    value: prefix === 'h' ? honorValues[num] : num,
    name: id,
    unicode: '',
    image: '',
  };
}

function tiles(...ids: string[]): TileDef[] {
  return ids.map(tile);
}

// Small candidate list covering just the tiles used in tests.
// No import.meta.url — avoids the tiles.ts getImageUrl call.
const CANDIDATES = tiles(
  'c1','c2','c3','c4','c5','c6','c7','c8','c9',
  'd1','d2','d3','d4','d5','d6','d7','d8','d9',
  'b1','b2','b3','b4','b5','b6','b7','b8','b9',
  'h1','h2','h3','h4','h5','h6','h7',
  // Intentionally exclude flowers — the function should skip them regardless
  'f1','f2',
);

// 4 sets + pair tenpai: waiting for h2 (the pair head)
const STANDARD_TENPAI = tiles(
  'c1','c2','c3',
  'd4','d5','d6',
  'b7','b8','b9',
  'h1','h1','h1',
  'h2',
);

// 7-pairs tenpai: 6 pairs + 1 singleton waiting for h1
const SEVEN_PAIRS_TENPAI = tiles(
  'c1','c1','c2','c2','c3','c3',
  'd1','d1','d2','d2','d3','d3',
  'h1',
);

describe('findWaitingTiles', () => {
  test('returns empty array when hand has fewer than 13 tiles', () => {
    expect(findWaitingTiles(tiles('c1','c2','c3'), [], CANDIDATES)).toEqual([]);
  });

  test('returns empty array when hand has more than 13 tiles', () => {
    expect(findWaitingTiles(
      tiles('c1','c2','c3','c1','c2','c3','c1','c2','c3','d1','d1','d1','h1','h1'),
      [],
      CANDIDATES,
    )).toEqual([]);
  });

  test('detects standard tenpai waiting tile', () => {
    const result = findWaitingTiles(STANDARD_TENPAI, [], CANDIDATES);
    expect(result.map(w => w.tile.id)).toContain('h2');
  });

  test('detects 7-pairs tenpai waiting tile', () => {
    const result = findWaitingTiles(SEVEN_PAIRS_TENPAI, [], CANDIDATES);
    expect(result.map(w => w.tile.id)).toContain('h1');
  });

  test('remaining is 4 minus copies seen across all sections', () => {
    // hand already contains 1x h2; pass hand as allSeenTiles
    const result = findWaitingTiles(STANDARD_TENPAI, STANDARD_TENPAI, CANDIDATES);
    const h2 = result.find(w => w.tile.id === 'h2');
    // 4 total − 1 in hand = 3 remaining
    expect(h2?.remaining).toBe(3);
  });

  test('remaining decrements when tile appears in discards', () => {
    const extraSeen = [...STANDARD_TENPAI, tile('h2'), tile('h2')];
    const result = findWaitingTiles(STANDARD_TENPAI, extraSeen, CANDIDATES);
    const h2 = result.find(w => w.tile.id === 'h2');
    // 4 total − 1 (hand) − 2 (extra discards) = 1 remaining
    expect(h2?.remaining).toBe(1);
  });

  test('remaining is 0 when all 4 copies are seen', () => {
    const extraSeen = [...STANDARD_TENPAI, tile('h2'), tile('h2'), tile('h2')];
    const result = findWaitingTiles(STANDARD_TENPAI, extraSeen, CANDIDATES);
    const h2 = result.find(w => w.tile.id === 'h2');
    expect(h2?.remaining).toBe(0);
  });

  test('remaining never goes below 0', () => {
    const extraSeen = [...STANDARD_TENPAI, tile('h2'), tile('h2'), tile('h2'), tile('h2')];
    const result = findWaitingTiles(STANDARD_TENPAI, extraSeen, CANDIDATES);
    result.forEach(w => expect(w.remaining).toBeGreaterThanOrEqual(0));
  });

  test('flowers are never in the waiting tiles list', () => {
    const result = findWaitingTiles(STANDARD_TENPAI, [], CANDIDATES);
    result.forEach(w => expect(w.tile.suit).not.toBe('Flowers'));
  });
});
