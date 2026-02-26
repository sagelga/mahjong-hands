import type { TileDef } from './tiles';

export type ComboType = 'chow' | 'pung' | 'kong' | 'pair' | 'upgrade';
export type ComboFormation = 'concealed' | 'melded';

export interface PotentialCombo {
  tiles: TileDef[];
  comboType: ComboType;
  formation: ComboFormation | null;
  indices: number[];
}

export interface ComboGroup {
  tiles: TileDef[];
  comboType: ComboType;
  formation: ComboFormation;
  indices: number[];
}

/**
 * Detects potential combos in the given tiles
 */
export function detectPotentialCombos(tiles: TileDef[]): PotentialCombo[] {
  const potentialCombos: PotentialCombo[] = [];

  // Group tiles by ID to identify pungs and kongs
  const tilesById: Record<string, { tiles: TileDef[]; indices: number[] }> = {};
  tiles.forEach((tile, index) => {
    if (!tilesById[tile.id]) {
      tilesById[tile.id] = { tiles: [], indices: [] };
    }
    tilesById[tile.id].tiles.push(tile);
    tilesById[tile.id].indices.push(index);
  });

  // Check for pairs (2 identical tiles), pungs (3 identical tiles) and kongs (4 identical tiles)
  for (const [, tileGroup] of Object.entries(tilesById)) {
    if (tileGroup.tiles.length >= 2) {
      // Pair (2 identical tiles)
      if (tileGroup.tiles.length >= 2) {
        potentialCombos.push({
          tiles: tileGroup.tiles.slice(0, 2),
          comboType: 'pair',
          formation: null,
          indices: tileGroup.indices.slice(0, 2)
        });
      }

      // Pung (3 identical tiles)
      if (tileGroup.tiles.length >= 3) {
        potentialCombos.push({
          tiles: tileGroup.tiles.slice(0, 3),
          comboType: 'pung',
          formation: null,
          indices: tileGroup.indices.slice(0, 3)
        });
      }

      // Kong (4 identical tiles) - only if we have 4 tiles of the same kind
      if (tileGroup.tiles.length === 4) {
        potentialCombos.push({
          tiles: tileGroup.tiles.slice(0, 4),
          comboType: 'kong',
          formation: null,
          indices: tileGroup.indices.slice(0, 4)
        });
      }
    }
  }

  // For each potential pair, if there are more identical tiles available,
  // also suggest pung/kong options using the same initial tiles plus others
  // This creates multiple potential combos for the same tiles when multiple formations are possible

  // Check for chows (3 consecutive numbered tiles of the same suit)
  // Only applies to numbered suits: Characters, Dots, Bamboo
  const numberedSuits: ('Characters' | 'Dots' | 'Bamboo')[] = ['Characters', 'Dots', 'Bamboo'];

  for (const suit of numberedSuits) {
    // Group tiles by value for this suit
    const tilesByValue: Record<number, { tiles: TileDef[]; indices: number[] }> = {};

    tiles.forEach((tile, index) => {
      if (tile.suit === suit && typeof tile.value === 'number') {
        const value = tile.value;
        if (!tilesByValue[value]) {
          tilesByValue[value] = { tiles: [], indices: [] };
        }
        tilesByValue[value].tiles.push(tile);
        tilesByValue[value].indices.push(index);
      }
    });

    // Check for sequences of 3 consecutive numbers
    for (let i = 1; i <= 7; i++) {
      const val1 = i;
      const val2 = i + 1;
      const val3 = i + 2;

      if (tilesByValue[val1] && tilesByValue[val2] && tilesByValue[val3]) {
        // Take one tile from each value to form a chow
        const tile1 = tilesByValue[val1].tiles[0];
        const tile2 = tilesByValue[val2].tiles[0];
        const tile3 = tilesByValue[val3].tiles[0];

        const index1 = tilesByValue[val1].indices[0];
        const index2 = tilesByValue[val2].indices[0];
        const index3 = tilesByValue[val3].indices[0];

        potentialCombos.push({
          tiles: [tile1, tile2, tile3],
          comboType: 'chow',
          formation: null,
          indices: [index1, index2, index3]
        });
      }
    }
  }

  return potentialCombos;
}

/**
 * Checks if the selected tiles already form a combo
 */
export function isPartOfExistingCombo(index: number, comboGroups: ComboGroup[]): boolean {
  return comboGroups.some(group => group.indices.includes(index));
}
