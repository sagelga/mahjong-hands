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
    const hand = tiles.filter((t) => t.suit !== 'Flowers');

    if (hand.length === 0) {
        return { isValid: false, reason: 'Select tiles to start validation' };
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
    const pungsCount = Object.values(idCounts).filter((c) => c >= 3).length;

    // Find sequences (Chows)
    const sequences = findSequences(hand);

    if (pungsCount > 0 || sequences.length > 0) {
        const totalSets = pungsCount + sequences.length;
        if (totalSets >= 1 && totalSets < 4) {
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

    for (const id of ids) {
        if (counts[id] >= 2) {
            const remaining = { ...counts };
            remaining[id] -= 2;
            if (canDecompose(remaining)) return true;
        }
    }
    return false;
}

function canDecompose(counts: Record<string, number>): boolean {
    const ids = Object.keys(counts)
        .filter((id) => counts[id] > 0)
        .sort();
    if (ids.length === 0) return true;

    const firstId = ids[0];

    // Try Pung
    if (counts[firstId] >= 3) {
        const nextCounts = { ...counts };
        nextCounts[firstId] -= 3;
        if (canDecompose(nextCounts)) return true;
    }

    // Try Chow (only for numbered suits)
    const tileIdMatch = firstId.match(/^([mps])(\d)$/);
    if (tileIdMatch) {
        const [_, suit, valStr] = tileIdMatch;
        const val = parseInt(valStr);
        if (val <= 7) {
            const id2 = `${suit}${val + 1}`;
            const id3 = `${suit}${val + 2}`;
            if (counts[id2] > 0 && counts[id3] > 0) {
                const nextCounts = { ...counts };
                nextCounts[firstId]--;
                nextCounts[id2]--;
                nextCounts[id3]--;
                if (canDecompose(nextCounts)) return true;
            }
        }
    }

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
