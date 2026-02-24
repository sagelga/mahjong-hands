import { validateHand } from './validator';
import type { TileDef } from './validator';

// Helper function to get tiles by IDs (creating test tiles directly)
function getTilesByIds(ids: string[]) {
  return ids.map(id => {
    // Create test tiles based on the id pattern
    let suit: string;
    let value: number | string;
    let name: string;
    let unicode: string;

    if (id.startsWith('m')) { // Characters
      const num = parseInt(id.substring(1));
      suit = 'Characters (Thousand)';
      value = num;
      name = `${num} Thousand`;
      unicode = ['🀇','🀈','🀉','🀊','🀋','🀌','🀍','🀎','🀏'][num - 1] || '🀇';
    } else if (id.startsWith('p')) { // Dots
      const num = parseInt(id.substring(1));
      suit = 'Dots (Bamboo)';
      value = num;
      name = `${num} Bamboo`;
      unicode = ['🀙','🀚','🀛','🀜','🀝','🀞','🀟','🀠','🀡'][num - 1] || '🀙';
    } else if (id.startsWith('s')) { // Bamboo
      const num = parseInt(id.substring(1));
      suit = 'Bamboo (Dots)';
      value = num;
      name = `${num} Dots`;
      unicode = ['🀐','🀑','🀒','🀓','🀔','🀕','🀖','🀗','🀘'][num - 1] || '🀐';
    } else if (id.startsWith('z')) { // Honors
      const char = id.substring(1);
      suit = 'Honors';
      if (char === '1') { value = 'E'; name = 'East'; unicode = '🀀'; }
      else if (char === '2') { value = 'S'; name = 'South'; unicode = '🀁'; }
      else if (char === '3') { value = 'W'; name = 'West'; unicode = '🀂'; }
      else if (char === '4') { value = 'N'; name = 'North'; unicode = '🀃'; }
      else if (char === '5') { value = 'WHT'; name = 'White'; unicode = '🀆'; }
      else if (char === '6') { value = 'GRN'; name = 'Green'; unicode = '🀅'; }
      else { value = 'RED'; name = 'Red'; unicode = '🀄'; }
    } else if (id.startsWith('f')) { // Flowers
      const num = parseInt(id.substring(1));
      suit = 'Flowers';
      value = num;
      if (num === 1) { name = 'Plum'; unicode = '🀢'; }
      else if (num === 2) { name = 'Orchid'; unicode = '🀣'; }
      else if (num === 3) { name = 'Chrysanthemum'; unicode = '🀥'; }
      else { name = 'Bamboo'; unicode = '🀤'; }
    } else {
      throw new Error(`Unknown tile id: ${id}`);
    }

    return {
      id,
      suit,
      value,
      name,
      unicode,
      image: `/tiles/${id}.svg`
    } as TileDef;
  });
}

describe('validateHand', () => {
  test('should recognize a valid standard hand regardless of order', () => {
    // Valid hand: 4 sets + 1 pair
    // Sets: m1-m1-m1, m2-m3-m4, p5-p5-p5, s7-s8-s9
    // Pair: z1-z1
    const validHandIds = ['m1', 'm1', 'm1', 'm2', 'm3', 'm4', 'p5', 'p5', 'p5', 's7', 's8', 's9', 'z1', 'z1'];

    // Test in original order
    let hand = getTilesByIds(validHandIds);
    let result = validateHand(hand);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('Standard');

    // Test in reversed order
    hand = getTilesByIds([...validHandIds].reverse());
    result = validateHand(hand);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('Standard');

    // Test in shuffled order
    const shuffledIds = [...validHandIds].sort(() => Math.random() - 0.5);
    hand = getTilesByIds(shuffledIds);
    result = validateHand(hand);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('Standard');
  });

  test('should recognize a valid 7 pairs hand regardless of order', () => {
    // Valid 7 pairs hand
    const sevenPairsIds = ['m1', 'm1', 'm2', 'm2', 'p3', 'p3', 'p4', 'p4', 's5', 's5', 's6', 's6', 'z1', 'z1'];

    // Test in original order
    let hand = getTilesByIds(sevenPairsIds);
    let result = validateHand(hand);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('7 Pairs');

    // Test in reversed order
    hand = getTilesByIds([...sevenPairsIds].reverse());
    result = validateHand(hand);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('7 Pairs');

    // Test in shuffled order
    const shuffledIds = [...sevenPairsIds].sort(() => Math.random() - 0.5);
    hand = getTilesByIds(shuffledIds);
    result = validateHand(hand);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('7 Pairs');
  });

  test('should reject invalid hands', () => {
    // Invalid hand: missing one tile to make a complete set
    const invalidHandIds = ['m1', 'm1', 'm2', 'm3', 'p5', 'p5', 'p5', 's7', 's8', 's9', 'z1', 'z1', 'z2', 'z2'];

    const hand = getTilesByIds(invalidHandIds);
    const result = validateHand(hand);
    expect(result.isValid).toBe(false);
  });

  test('should handle hands with flowers', () => {
    // Valid hand with flowers (flowers should be ignored in validation)
    const validHandWithFlowersIds = ['m1', 'm1', 'm1', 'm2', 'm3', 'm4', 'p5', 'p5', 'p5', 's7', 's8', 's9', 'z1', 'z1', 'f1', 'f2'];

    const hand = getTilesByIds(validHandWithFlowersIds);
    const result = validateHand(hand);
    expect(result.isValid).toBe(true);
    expect(result.type).toBe('Standard');
  });

  test('should work with different arrangements of the same valid hand', () => {
    // Same valid hand in different arrangements
    const baseHand = ['m1', 'm1', 'm1', 'm2', 'm3', 'm4', 'p5', 'p5', 'p5', 's7', 's8', 's9', 'z1', 'z1'];

    // Multiple random shuffles to test robustness
    for (let i = 0; i < 5; i++) {
      const shuffled = [...baseHand].sort(() => Math.random() - 0.5);
      const hand = getTilesByIds(shuffled);
      const result = validateHand(hand);
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('Standard');
    }
  });

  test('should work with a complex sequence hand', () => {
    // A hand with multiple possible interpretations for sequences
    // This tests the enhanced sequence detection that tries all possible positions
    const complexHandIds = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'p1', 'p2', 'p3', 's7', 's8', 's9', 'z7', 'z7']; // Mixed sequences and pair

    // Test in original order
    let hand = getTilesByIds(complexHandIds);
    let result = validateHand(hand);
    expect(result.isValid).toBe(true);

    // Test in reversed order
    hand = getTilesByIds([...complexHandIds].reverse());
    result = validateHand(hand);
    expect(result.isValid).toBe(true);
  });
});
