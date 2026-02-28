import { renderHook } from '@testing-library/react';
import { useComboGroups } from '../src/hooks/useComboGroups';
import type { ComboGroup, ComboFormation } from '../src/lib/comboDetector';
import type { TileDef, Suit } from '../src/lib/tiles';

// Helper function to create a mock tile
const createMockTile = (id: string, suit: Suit, value: number | string = 1): TileDef => ({
  id,
  suit,
  value,
  name: `${id} tile`,
  unicode: '🀀',
  image: `../assets/tiles/${id}.svg`
});

describe('useComboGroups', () => {
  describe('updateComboGroupsAfterRemoval', () => {
    it('should update combo group indices after tile removal and convert pung to pair', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'pung',
          formation: 'concealed' as ComboFormation,
          indices: [0, 1, 2]
        },
        {
          tiles: [
            createMockTile('c2', 'Characters', 2),
            createMockTile('c2', 'Characters', 2)
          ],
          comboType: 'pair',
          formation: 'concealed' as ComboFormation,
          indices: [3, 4]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterRemoval(groups, 1);
      expect(updatedGroups).toEqual([
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'pair', // Pung converted to pair after removal
          formation: 'concealed',
          indices: [0, 1] // Index 2 becomes 1 after removal of index 1, and pung becomes pair
        },
        {
          tiles: [
            createMockTile('c2', 'Characters', 2),
            createMockTile('c2', 'Characters', 2)
          ],
          comboType: 'pair',
          formation: 'concealed',
          indices: [2, 3] // Indices shift after removal
        }
      ]);
    });

    it('should remove empty groups after tile removal', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [createMockTile('b1', 'Bamboo', 1)],
          comboType: 'pung',
          formation: 'concealed' as ComboFormation,
          indices: [0] // Only one index, will become empty after removal
        },
        {
          tiles: [createMockTile('c2', 'Characters', 2)],
          comboType: 'pair',
          formation: 'concealed' as ComboFormation,
          indices: [1, 2]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterRemoval(groups, 0);
      expect(updatedGroups).toEqual([
        {
          tiles: [createMockTile('c2', 'Characters', 2)],
          comboType: 'pair',
          formation: 'concealed',
          indices: [0, 1] // Remaining group indices adjusted
        }
      ]);
    });

    it('should auto convert pung to pair when removing one tile', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'pung',
          formation: 'concealed' as ComboFormation,
          indices: [0, 1, 2]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterRemoval(groups, 2);
      expect(updatedGroups).toEqual([
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'pair',
          formation: 'concealed',
          indices: [0, 1] // One tile removed, converted to pair
        }
      ]);
    });

    it('should auto convert kong to pung when removing one tile', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'kong',
          formation: 'concealed' as ComboFormation,
          indices: [0, 1, 2, 3]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterRemoval(groups, 3);
      expect(updatedGroups).toEqual([
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'pung',
          formation: 'concealed',
          indices: [0, 1, 2] // One tile removed, converted to pung
        }
      ]);
    });

    it('should remove chow group when tiles are removed (not a valid combo anymore)', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b2', 'Bamboo', 2),
            createMockTile('b3', 'Bamboo', 3)
          ],
          comboType: 'chow',
          formation: 'concealed' as ComboFormation,
          indices: [0, 1, 2]
        }
      ];

      // Remove one tile from chow, should remove the entire group
      const updatedGroups = result.current.updateComboGroupsAfterRemoval(groups, 1);
      expect(updatedGroups).toEqual([]); // Chow group removed as it's not valid anymore
    });

    it('should handle mixed groups with different transformations', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'pung',
          formation: 'concealed' as ComboFormation,
          indices: [0, 1, 2]
        },
        {
          tiles: [
            createMockTile('c1', 'Characters', 1),
            createMockTile('c2', 'Characters', 2),
            createMockTile('c3', 'Characters', 3)
          ],
          comboType: 'chow',
          formation: 'melded' as ComboFormation,
          indices: [3, 4, 5]
        },
        {
          tiles: [
            createMockTile('d1', 'Dots', 1),
            createMockTile('d1', 'Dots', 1)
          ],
          comboType: 'pair',
          formation: 'concealed' as ComboFormation,
          indices: [6, 7]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterRemoval(groups, 1);
      expect(updatedGroups).toEqual([
        {
          tiles: [
            createMockTile('b1', 'Bamboo', 1),
            createMockTile('b1', 'Bamboo', 1)
          ],
          comboType: 'pair',
          formation: 'concealed',
          indices: [0, 1] // Pung converted to pair
        },
        {
          tiles: [
            createMockTile('c1', 'Characters', 1),
            createMockTile('c2', 'Characters', 2),
            createMockTile('c3', 'Characters', 3)
          ],
          comboType: 'chow',
          formation: 'melded',
          indices: [2, 3, 4] // Chow indices adjusted (shifted down by 1 after removing index 1)
        },
        {
          tiles: [
            createMockTile('d1', 'Dots', 1),
            createMockTile('d1', 'Dots', 1)
          ],
          comboType: 'pair',
          formation: 'concealed',
          indices: [5, 6] // Pair indices adjusted
        }
      ]);
    });
  });

  describe('updateComboGroupsAfterReorder', () => {
    it('should update combo group indices after reordering (moving left)', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [createMockTile('b1', 'Bamboo', 1)],
          comboType: 'pung',
          formation: 'concealed' as ComboFormation,
          indices: [1, 3, 5]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterReorder(groups, 5, 2);
      expect(updatedGroups).toEqual([
        {
          tiles: [createMockTile('b1', 'Bamboo', 1)],
          comboType: 'pung',
          formation: 'concealed',
          indices: [1, 2, 4] // Index 5→2; indices 2,3,4 shift right: 3→4
        }
      ]);
    });

    it('should update combo group indices after reordering (moving right)', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [createMockTile('b1', 'Bamboo', 1)],
          comboType: 'pung',
          formation: 'concealed' as ComboFormation,
          indices: [1, 3, 5]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterReorder(groups, 1, 4);
      expect(updatedGroups).toEqual([
        {
          tiles: [createMockTile('b1', 'Bamboo', 1)],
          comboType: 'pung',
          formation: 'concealed',
          indices: [2, 4, 5] // Index 1→4; indices 2,3,4 shift left: 3→2
        }
      ]);
    });

    it('should not change indices when oldIndex equals newIndex', () => {
      const { result } = renderHook(() => useComboGroups());

      const groups: ComboGroup[] = [
        {
          tiles: [createMockTile('b1', 'Bamboo', 1)],
          comboType: 'pung',
          formation: 'concealed' as ComboFormation,
          indices: [1, 3, 5]
        }
      ];

      const updatedGroups = result.current.updateComboGroupsAfterReorder(groups, 3, 3);
      expect(updatedGroups).toEqual([
        {
          tiles: [createMockTile('b1', 'Bamboo', 1)],
          comboType: 'pung',
          formation: 'concealed',
          indices: [1, 3, 5] // No change
        }
      ]);
    });
  });

  describe('calculateComboFormation', () => {
    it('should upgrade pair to pung correctly', () => {
      const { result } = renderHook(() => useComboGroups());

      const selectedCombo: {
        tiles: TileDef[];
        indices: number[];
        comboType: 'pair' | 'pung' | 'chow' | 'kong' | 'upgrade';
      } = {
        tiles: [createMockTile('b1', 'Bamboo', 1)],
        indices: [0, 1],
        comboType: 'pair'
      };

      const { comboTiles, comboIndices } = result.current.calculateComboFormation(
        selectedCombo,
        'pung',
        10
      );
      expect(comboTiles).toEqual([
        createMockTile('b1', 'Bamboo', 1),
        createMockTile('b1', 'Bamboo', 1)
      ]);
      expect(comboIndices).toEqual([0, 1, 10]); // Added one more tile at index 10
    });

    it('should upgrade pair to kong correctly', () => {
      const { result } = renderHook(() => useComboGroups());

      const selectedCombo: {
        tiles: TileDef[];
        indices: number[];
        comboType: 'pair' | 'pung' | 'chow' | 'kong' | 'upgrade';
      } = {
        tiles: [createMockTile('b1', 'Bamboo', 1)],
        indices: [0, 1],
        comboType: 'pair'
      };

      const { comboTiles, comboIndices } = result.current.calculateComboFormation(
        selectedCombo,
        'kong',
        10
      );
      expect(comboTiles).toEqual([
        createMockTile('b1', 'Bamboo', 1),
        createMockTile('b1', 'Bamboo', 1),
        createMockTile('b1', 'Bamboo', 1),
        createMockTile('b1', 'Bamboo', 1)
      ]);
      expect(comboIndices).toEqual([0, 1, 10, 11]); // Added two more tiles at indices 10 and 11
    });

    it('should upgrade pung to kong correctly', () => {
      const { result } = renderHook(() => useComboGroups());

      const selectedCombo: {
        tiles: TileDef[];
        indices: number[];
        comboType: 'pair' | 'pung' | 'chow' | 'kong' | 'upgrade';
      } = {
        tiles: [
          createMockTile('b1', 'Bamboo', 1),
          createMockTile('b1', 'Bamboo', 1),
          createMockTile('b1', 'Bamboo', 1)
        ],
        indices: [0, 1, 2],
        comboType: 'pung'
      };

      const { comboTiles, comboIndices } = result.current.calculateComboFormation(
        selectedCombo,
        'kong',
        10
      );
      expect(comboTiles).toEqual([
        createMockTile('b1', 'Bamboo', 1),
        createMockTile('b1', 'Bamboo', 1),
        createMockTile('b1', 'Bamboo', 1),
        createMockTile('b1', 'Bamboo', 1)
      ]);
      expect(comboIndices).toEqual([0, 1, 2, 10]); // Added one more tile at index 10
    });

    it('should not modify combo when not upgrading', () => {
      const { result } = renderHook(() => useComboGroups());

      const selectedCombo: {
        tiles: TileDef[];
        indices: number[];
        comboType: 'pair' | 'pung' | 'chow' | 'kong' | 'upgrade';
      } = {
        tiles: [createMockTile('b1', 'Bamboo', 1)],
        indices: [0, 1],
        comboType: 'pair'
      };

      const { comboTiles, comboIndices } = result.current.calculateComboFormation(
        selectedCombo,
        'pair',
        10
      );
      expect(comboTiles).toEqual([
        createMockTile('b1', 'Bamboo', 1)
      ]);
      expect(comboIndices).toEqual([0, 1]); // No change
    });
  });
});
