import type { TileDef } from './tiles';

export interface ValidationResult {
    isValid: boolean;
    reason: string;
    type?: 'Standard' | '7 Pairs';
    invalidTiles?: string[];
}

/**
 * Validates if the given Mahjong hand is a winning hand.
 * Supports:
 * - Standard: 4 Sets (Pung/Kong/Chow) + 1 Pair
 * - 7 Pairs: 7 groups of 2 identical tiles
 * Flowers are ignored in validation.
 */
export function validateHand(tiles: TileDef[]): ValidationResult {
    // Clear memoization cache before each validation to prevent incorrect results from previous computations
    memoizationCache.clear();

    const hand = tiles.filter((t) => t.suit !== 'Flowers');

    if (hand.length === 0) {
        return { isValid: false, reason: 'Click the tiles to add it to your hand' };
    }

    // Count occurrences
    const idCounts: Record<string, number> = {};
    for (const t of hand) {
        idCounts[t.id] = (idCounts[t.id] || 0) + 1;
    }

    // Check for tiles that exceed the maximum of 4
    const invalidTiles = Object.entries(idCounts)
        .filter(([, count]) => count > 4)
        .map(([tileId]) => tileId);

    if (invalidTiles.length > 0) {
        return {
            isValid: false,
            reason: 'Maximum 4 of each tile allowed. Remove excess tiles.',
            invalidTiles,
        };
    }

    // Check for 7 Pairs
    if (hand.length === 14) {
        const isSevenPairs = Object.values(idCounts).every(
            (c) => c === 2 || c === 4,
        );
        if (isSevenPairs) {
            return {
                isValid: true,
                reason: 'Winning Hand: 7 Pairs',
                type: '7 Pairs',
            };
        }
    }

    // Check for Standard (4 Sets + 1 Pair)
    const isStandardWin = checkStandardWin(hand);
    if (isStandardWin) {
        return {
            isValid: true,
            reason: 'Winning Hand: 4 Sets + 1 Pair',
            type: 'Standard',
        };
    }

    // Higher-order hints logic
    const remainingCounts = { ...idCounts };
    let totalSetsFound = 0;

    // 1. Identify triplets and kongs first (as they are less ambiguous than sequences)
    for (const id in remainingCounts) {
        if (remainingCounts[id] >= 3) {
            totalSetsFound++;
            // For hint calculation, we treat both pung (3) and kong (4) as one set
            remainingCounts[id] -= (remainingCounts[id] >= 4 ? 4 : 3);
        }
    }

    // 2. Identify sequences from the remaining tiles
    const suits: ('c' | 'd' | 'b')[] = ['c', 'd', 'b'];
    for (const suit of suits) {
        for (let i = 1; i <= 7; i++) {
            const id1 = `${suit}${i}`;
            const id2 = `${suit}${i + 1}`;
            const id3 = `${suit}${i + 2}`;
            while (remainingCounts[id1] > 0 && remainingCounts[id2] > 0 && remainingCounts[id3] > 0) {
                totalSetsFound++;
                remainingCounts[id1]--;
                remainingCounts[id2]--;
                remainingCounts[id3]--;
            }
        }
    }

    if (totalSetsFound > 0) {
        if (totalSetsFound < 4) {
            const setsWord = (4 - totalSetsFound) === 1 ? 'set' : 'sets';
            return {
                isValid: false,
                reason: `Looking good! Add ${4 - totalSetsFound} more ${setsWord} and a pair.`,
            };
        }
    }


    // For 7 Pairs hint
    const pairsCount = Object.values(idCounts).filter((c) => c >= 2).length;

    if (pairsCount >= 2 && pairsCount < 7) {
        return {
            isValid: false,
            reason: `Nice pairs! Add ${7 - pairsCount} more pairs for 7 Pairs win.`,
        };
    }


    if (hand.length < 14) {
        return {
            isValid: false,
            reason: `Current Hand: ${hand.length}/14 tiles. Keep going!`,
        };
    }

    return {
        isValid: false,
        reason: 'Not a winning hand yet. Try arranging into sets and pairs.',
    };
}

function checkStandardWin(tiles: TileDef[]): boolean {
    if (tiles.length !== 14) return false; // Basic standard hand (can be more if kongs are declared, but for this app 14 is the goal)

    const counts: Record<string, number> = {};
    for (const t of tiles) counts[t.id] = (counts[t.id] || 0) + 1;

    const ids = Object.keys(counts);

    // Try each possible pair as the head (eyes) of the hand
    for (const id of ids) {
        if (counts[id] >= 2) {
            const remaining = { ...counts };
            remaining[id] -= 2;
            if (canDecompose(remaining)) return true;
        }
    }

    return false;
}

// Memoization cache to avoid recalculating the same states
const memoizationCache = new Map<string, boolean>();

function canDecompose(counts: Record<string, number>): boolean {
    // Create a canonical string representation of the state for memoization
    const stateKey = Object.entries(counts)
        .filter(([, count]) => count > 0)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([id, count]) => `${id}:${count}`)
        .join('|');

    // Check if we've already computed this state
    const cached = memoizationCache.get(stateKey);
    if (cached !== undefined) return cached;

    // If no tiles left, we've successfully decomposed everything
    const remainingIds = Object.keys(counts).filter(id => counts[id] > 0);
    if (remainingIds.length === 0) {
        memoizationCache.set(stateKey, true);
        return true;
    }

    // Process tiles in sorted order for consistency
    const sortedIds = remainingIds.sort();
    const firstId = sortedIds[0];
    const firstCount = counts[firstId];

    // Option 1: Try to form a Pung (three of the same tile)
    if (firstCount >= 3) {
        const newCounts = { ...counts };
        newCounts[firstId] = firstCount - 3;
        if (canDecompose(newCounts)) {
            memoizationCache.set(stateKey, true);
            return true;
        }
    }

    // Option 2: Try to form a Chow (three consecutive tiles of the same suit)
    const tileIdMatch = firstId.match(/^([cdb])(\d)$/);
    if (tileIdMatch) {
        const [, suit, valStr] = tileIdMatch;
        const val = parseInt(valStr);

        // Try to form sequence starting with this tile (e.g., 1-2-3)
        if (val <= 7) {
            const id2 = `${suit}${val + 1}`;
            const id3 = `${suit}${val + 2}`;

            if (counts[id2] > 0 && counts[id3] > 0) {
                const newCounts = { ...counts };
                newCounts[firstId] = firstCount - 1;
                newCounts[id2]--;
                newCounts[id3]--;
                if (canDecompose(newCounts)) {
                    memoizationCache.set(stateKey, true);
                    return true;
                }
            }
        }

        // Try to form sequence centered on this tile (e.g., 2-3-4 where firstId is 3)
        if (val >= 2 && val <= 8) {
            const idBefore = `${suit}${val - 1}`;
            const idAfter = `${suit}${val + 1}`;

            if (counts[idBefore] > 0 && counts[idAfter] > 0) {
                const newCounts = { ...counts };
                newCounts[idBefore]--;
                newCounts[firstId] = firstCount - 1;
                newCounts[idAfter]--;
                if (canDecompose(newCounts)) {
                    memoizationCache.set(stateKey, true);
                    return true;
                }
            }
        }

        // Try to form sequence ending with this tile (e.g., 3-4-5 where firstId is 5)
        if (val >= 3) {
            const id2 = `${suit}${val - 1}`;
            const id3 = `${suit}${val - 2}`;

            if (counts[id2] > 0 && counts[id3] > 0) {
                const newCounts = { ...counts };
                newCounts[id3]--;
                newCounts[id2]--;
                newCounts[firstId] = firstCount - 1;
                if (canDecompose(newCounts)) {
                    memoizationCache.set(stateKey, true);
                    return true;
                }
            }
        }
    }

    // If none of the options worked, this decomposition path is not viable
    memoizationCache.set(stateKey, false);
    return false;
}
