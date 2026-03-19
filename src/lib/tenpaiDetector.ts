import type { TileDef } from './tiles';
import { validateHand } from './validator';

export interface WaitingTile {
  tile: TileDef;
  remaining: number;
}

/**
 * Given a 13-tile hand, every tile already seen on the table
 * (hand + discards + opponents' exposed tiles), and the full list of
 * unique tile types to check (pass MAHJONG_TILES from tiles.ts),
 * returns the tiles that would complete the hand annotated with how
 * many copies remain in the unseen wall.
 *
 * Flowers are excluded because validateHand strips them before checking
 * win conditions, so they can never complete a standard hand.
 */
export function findWaitingTiles(
  hand: TileDef[],
  allSeenTiles: TileDef[],
  candidates: TileDef[],
): WaitingTile[] {
  if (hand.length !== 13) return [];

  return candidates
    .filter(candidate => candidate.suit !== 'Flowers')
    .filter(candidate => validateHand([...hand, candidate]).isValid)
    .map(candidate => ({
      tile: candidate,
      remaining: Math.max(0, 4 - allSeenTiles.filter(t => t.id === candidate.id).length),
    }));
}
