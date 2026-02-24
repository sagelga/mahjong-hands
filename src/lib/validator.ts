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

    // Hints/Suggestions logic
    const pairsCount = Object.values(idCounts).filter((c) => c >= 2).length;

    // Count pungs (3+ of same tile) and kongs (4 of same tile) separately
    const pungsCount = Object.values(idCounts).filter((c) => c === 3).length;
    const kongsCount = Object.values(idCounts).filter((c) => c === 4).length;
    // A kong counts as a valid set, so total sets include both pungs and kongs
    const totalSetsFromGroups = pungsCount + kongsCount;

    // Find sequences (Chows) - need to make sure we don't double count
    const sequences = findSequences(hand);

    // Calculate effective sets considering that kongs can be used as sets
    // We need to be careful not to double-count if the same tiles are used for both groups and sequences
    const totalSets = totalSetsFromGroups + sequences.length;

    if (totalSets > 0) {
        if (totalSets < 4) {
            return {
                isValid: false,
                reason: `Looking good! Add ${4 - totalSets} more sets and a pair.`,
            };
        }
    }

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
    if (memoizationCache.has(stateKey)) {
        return memoizationCache.get(stateKey)!;
    }

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
    const tileIdMatch = firstId.match(/^([mps])(\d)$/);
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

function findSequences(tiles: TileDef[]): string[][] {
    const sequences: string[][] = [];
    const counts: Record<string, number> = {};
    for (const t of tiles) counts[t.id] = (counts[t.id] || 0) + 1;

    const suits: ('m' | 'p' | 's')[] = ['m', 'p', 's'];
    for (const suit of suits) {
        for (let i = 1; i <= 7; i++) {
            const id1 = `${suit}${i}`;
            const id2 = `${suit}${i + 1}`;
            const id3 = `${suit}${i + 2}`;
            if (counts[id1] > 0 && counts[id2] > 0 && counts[id3] > 0) {
                sequences.push([id1, id2, id3]);
                // Simple greedy find, might not be optimal but enough for hints
            }
        }
    }
    return sequences;
}
