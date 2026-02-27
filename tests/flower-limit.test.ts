// Simple test to verify flower limit functionality
describe('Flower Tile Limit', () => {
  test('should enforce flower limit of 1 per type', () => {
    // Mock tile selection logic
    const selectedTiles = [];

    const addTile = (tile: any) => {
      // Count current occurrences of this tile
      const currentCount = selectedTiles.filter((t: any) => t.id === tile.id).length;

      // Flowers have a limit of 1, other tiles have a limit of 4
      const maxLimit = tile.id.startsWith('f') ? 1 : 4;

      // Check if adding this tile would exceed the limit
      if (currentCount >= maxLimit) {
        // Don't add the tile if we already have the maximum allowed
        return false;
      }

      // Add the tile to selected tiles
      selectedTiles.push(tile);
      return true;
    };

    // Test flower tile (f1)
    const flowerTile = { id: 'f1', suit: 'Flowers', name: 'Plum' };

    // Add the flower tile - should succeed
    const firstAdd = addTile(flowerTile);
    expect(firstAdd).toBe(true);
    expect(selectedTiles).toHaveLength(1);
    expect(selectedTiles[0].id).toBe('f1');

    // Try to add the same flower tile again - should fail
    const secondAdd = addTile(flowerTile);
    expect(secondAdd).toBe(false);
    expect(selectedTiles).toHaveLength(1);
    expect(selectedTiles[0].id).toBe('f1');
  });

  test('should allow multiple different flower tiles', () => {
    // Mock tile selection logic
    const selectedTiles = [];

    const addTile = (tile: any) => {
      // Count current occurrences of this tile
      const currentCount = selectedTiles.filter((t: any) => t.id === tile.id).length;

      // Flowers have a limit of 1, other tiles have a limit of 4
      const maxLimit = tile.id.startsWith('f') ? 1 : 4;

      // Check if adding this tile would exceed the limit
      if (currentCount >= maxLimit) {
        // Don't add the tile if we already have the maximum allowed
        return false;
      }

      // Add the tile to selected tiles
      selectedTiles.push(tile);
      return true;
    };

    // Test different flower tiles
    const flowerTile1 = { id: 'f1', suit: 'Flowers', name: 'Plum' };
    const flowerTile2 = { id: 'f2', suit: 'Flowers', name: 'Orchid' };

    // Add first flower tile - should succeed
    const firstAdd = addTile(flowerTile1);
    expect(firstAdd).toBe(true);

    // Add second flower tile - should succeed
    const secondAdd = addTile(flowerTile2);
    expect(secondAdd).toBe(true);

    expect(selectedTiles).toHaveLength(2);
    expect(selectedTiles[0].id).toBe('f1');
    expect(selectedTiles[1].id).toBe('f2');
  });

  test('should allow 4 of non-flower tiles', () => {
    // Mock tile selection logic
    const selectedTiles = [];

    const addTile = (tile: any) => {
      // Count current occurrences of this tile
      const currentCount = selectedTiles.filter((t: any) => t.id === tile.id).length;

      // Flowers have a limit of 1, other tiles have a limit of 4
      const maxLimit = tile.id.startsWith('f') ? 1 : 4;

      // Check if adding this tile would exceed the limit
      if (currentCount >= maxLimit) {
        // Don't add the tile if we already have the maximum allowed
        return false;
      }

      // Add the tile to selected tiles
      selectedTiles.push(tile);
      return true;
    };

    // Test non-flower tile (character tile)
    const characterTile = { id: 'c1', suit: 'Characters', name: 'One Thousand' };

    // Add the same character tile 4 times - should all succeed
    for (let i = 0; i < 4; i++) {
      const success = addTile(characterTile);
      expect(success).toBe(true);
    }

    expect(selectedTiles).toHaveLength(4);
    selectedTiles.forEach(tile => {
      expect(tile.id).toBe('c1');
    });

    // Try to add the same character tile a 5th time - should fail
    const fifthAdd = addTile(characterTile);
    expect(fifthAdd).toBe(false);

    // Selected tiles should still have only 4
    expect(selectedTiles).toHaveLength(4);
  });

  test('should enforce limit for each flower type individually', () => {
    // Mock tile selection logic
    const selectedTiles = [];

    const addTile = (tile: any) => {
      // Count current occurrences of this tile
      const currentCount = selectedTiles.filter((t: any) => t.id === tile.id).length;

      // Flowers have a limit of 1, other tiles have a limit of 4
      const maxLimit = tile.id.startsWith('f') ? 1 : 4;

      // Check if adding this tile would exceed the limit
      if (currentCount >= maxLimit) {
        // Don't add the tile if we already have the maximum allowed
        return false;
      }

      // Add the tile to selected tiles
      selectedTiles.push(tile);
      return true;
    };

    // Test multiple different flower tiles
    const flowerTiles = [
      { id: 'f1', suit: 'Flowers', name: 'Plum' },
      { id: 'f2', suit: 'Flowers', name: 'Orchid' },
      { id: 'f3', suit: 'Flowers', name: 'Chrysanthemum' },
      { id: 'f4', suit: 'Flowers', name: 'Bamboo' }
    ];

    // Add each different flower tile - should all succeed
    flowerTiles.forEach((tile, index) => {
      const success = addTile(tile);
      expect(success).toBe(true);
    });

    expect(selectedTiles).toHaveLength(4);
    expect(selectedTiles.map(tile => tile.id)).toEqual(['f1', 'f2', 'f3', 'f4']);

    // Try to add f1 again - should fail
    const duplicateAdd = addTile(flowerTiles[0]);
    expect(duplicateAdd).toBe(false);

    // Selected tiles should still have only 4
    expect(selectedTiles).toHaveLength(4);
  });
});
