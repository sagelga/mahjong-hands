import { useCallback } from 'react';
import type { TileDef } from '../lib/tiles';
import type { ComboGroup } from '../lib/comboDetector';

// Custom hook for managing combo groups
export const useComboGroups = () => {
  // Helper function to update combo group indices after tile removal
  const updateComboGroupsAfterRemoval = useCallback((groups: ComboGroup[], removedIndex: number): ComboGroup[] => {
    return groups.flatMap(group => {
      // Get the original length before removal to determine if conversion is needed
      const originalLength = group.indices.length;

      // Filter indices, keeping those before removed index and adjusting those after
      const newIndices = group.indices
        .filter(i => i < removedIndex) // Keep indices that are before the removed tile
        .concat( // Add indices that are after the removed tile (adjust for shift)
          group.indices
            .filter(i => i > removedIndex)
            .map(i => i - 1) // Shift indices after the removed tile
        );

      // Determine if this is a removal scenario that triggers conversion
      const wasReduced = newIndices.length < originalLength;

      // Handle the three situations based on the original and new indices count
      if (newIndices.length === 0) {
        // Remove empty groups
        return [];
      } else if (newIndices.length === 2 && wasReduced) {
        // Convert pung to pair or kong to pair when a tile was removed
        if (group.comboType === 'pung') {
          // Convert pung to pair (3->2 tiles)
          return [{
            ...group,
            comboType: 'pair',
            indices: newIndices,
            tiles: group.tiles.slice(0, 2) // Keep only first 2 tiles for the pair
          }];
        } else if (group.comboType === 'kong') {
          // Convert kong to pair (4->2 tiles)
          return [{
            ...group,
            comboType: 'pair',
            indices: newIndices,
            tiles: group.tiles.slice(0, 2) // Keep only first 2 tiles for the pair
          }];
        } else if (group.comboType === 'chow') {
          // Remove chow groups when they lose tiles (not a valid combo anymore)
          return [];
        } else {
          // For other cases with 2 tiles, just update indices
          return [{ ...group, indices: newIndices }];
        }
      } else if (newIndices.length === 3 && wasReduced) {
        // Convert kong to pung when a tile was removed
        if (group.comboType === 'kong') {
          // Convert kong to pung (4->3 tiles)
          return [{
            ...group,
            comboType: 'pung',
            indices: newIndices,
            tiles: group.tiles.slice(0, 3) // Keep only first 3 tiles for the pung
          }];
        } else if (group.comboType === 'chow') {
          // Keep chow as is if it still has 3 tiles
          return [{ ...group, indices: newIndices }];
        } else {
          // For other cases with 3 tiles, just update indices
          return [{ ...group, indices: newIndices }];
        }
      } else if (newIndices.length === 1) {
        // Remove groups with only 1 tile (can't form valid combos)
        return [];
      } else {
        // For all other cases, just update the indices
        // This includes cases where the combo type doesn't change
        return [{ ...group, indices: newIndices }];
      }
    });
  }, []);

  // Helper function to update combo group indices after reordering
  const updateComboGroupsAfterReorder = useCallback((groups: ComboGroup[], oldIndex: number, newIndex: number): ComboGroup[] => {
    return groups.map(group => {
      let newIndices = [...group.indices];

      if (oldIndex !== newIndex) {
        // Correct algorithm for updating indices after array move operation
        newIndices = group.indices.map(originalIdx => {
          if (originalIdx === oldIndex) {
            // The moved element goes to the new position
            return newIndex;
          } else if (oldIndex < newIndex) {
            // Moving from lower to higher index
            // Elements between oldIndex and newIndex shift left by 1
            if (originalIdx > oldIndex && originalIdx <= newIndex) {
              return originalIdx - 1;
            }
          } else {
            // Moving from higher to lower index
            // Elements between new index and old index shift right by 1
            if (originalIdx >= newIndex && originalIdx <= oldIndex) {
              return originalIdx + 1;
            }
          }
          // Return the original index if not affected
          return originalIdx;
        });

        // Sort to maintain order within the combo
        newIndices.sort((a, b) => a - b);
      }

      return {
        ...group,
        indices: newIndices
      };
    });
  }, []);

  // Helper function to calculate combo formation based on upgrade
  const calculateComboFormation = useCallback((
    selectedCombo: { tiles: TileDef[]; indices: number[]; comboType: 'pair' | 'pung' | 'chow' | 'kong' | 'upgrade'; },
    actualComboType: 'pair' | 'pung' | 'kong',
    currentTilesLength: number
  ): { comboTiles: TileDef[]; comboIndices: number[] } => {
    let comboTiles = [...selectedCombo.tiles];
    let comboIndices = [...selectedCombo.indices];

    if (actualComboType === 'pung' && selectedCombo.comboType === 'pair') {
      // If we're upgrading from pair to pung, we need to add one more tile
      // If selectedCombo.tiles has 1 tile object (representing a pair), we add 1 more
      const tileToAdd = selectedCombo.tiles[0];
      comboTiles = [...selectedCombo.tiles, tileToAdd];
      comboIndices = [...selectedCombo.indices, currentTilesLength];
    } else if (actualComboType === 'kong') {
      const tileToAdd = selectedCombo.tiles[0];

      if (selectedCombo.comboType === 'pair') {
        // Upgrading from pair to kong: if pair represents 2 physical tiles, we add 2 more physical tiles to make 4 total
        // The combo group's tiles array should represent all 4 physical tiles, so we add 3 more tile objects to the existing 1
        comboTiles = [...selectedCombo.tiles, tileToAdd, tileToAdd, tileToAdd];
        const firstNewIndex = currentTilesLength;
        const secondNewIndex = currentTilesLength + 1;
        comboIndices = [...selectedCombo.indices, firstNewIndex, secondNewIndex];
      } else if (selectedCombo.comboType === 'pung') {
        // Upgrading from pung to kong: if pung has 3 tile objects, we add 1 more
        comboTiles = [...selectedCombo.tiles, tileToAdd];
        comboIndices = [...selectedCombo.indices, currentTilesLength];
      }
    }

    return { comboTiles, comboIndices };
  }, []);

  return {
    updateComboGroupsAfterRemoval,
    updateComboGroupsAfterReorder,
    calculateComboFormation
  };
};
