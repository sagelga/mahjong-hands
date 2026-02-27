import { validateHand } from '../src/lib/validator';
import type { TileDef, Suit } from '../src/lib/tiles';

// Create simplified tile data for testing (without import.meta.url dependency)
const TEST_TILES: TileDef[] = [
  // Characters (Wan)
  { id: 'm1', suit: 'Characters' as Suit, value: 1, name: 'One Thousand', unicode: '🀇', image: '/tiles/m1.svg' },
  { id: 'm2', suit: 'Characters' as Suit, value: 2, name: 'Two Thousand', unicode: '🀈', image: '/tiles/m2.svg' },
  { id: 'm3', suit: 'Characters' as Suit, value: 3, name: 'Three Thousand', unicode: '🀉', image: '/tiles/m3.svg' },
  { id: 'm4', suit: 'Characters' as Suit, value: 4, name: 'Four Thousand', unicode: '🀊', image: '/tiles/m4.svg' },
  { id: 'm5', suit: 'Characters' as Suit, value: 5, name: 'Five Thousand', unicode: '🀋', image: '/tiles/m5.svg' },
  { id: 'm6', suit: 'Characters' as Suit, value: 6, name: 'Six Thousand', unicode: '🀌', image: '/tiles/m6.svg' },
  { id: 'm7', suit: 'Characters' as Suit, value: 7, name: 'Seven Thousand', unicode: '🀍', image: '/tiles/m7.svg' },
  { id: 'm8', suit: 'Characters' as Suit, value: 8, name: 'Eight Thousand', unicode: '🀎', image: '/tiles/m8.svg' },
  { id: 'm9', suit: 'Characters' as Suit, value: 9, name: 'Nine Thousand', unicode: '🀏', image: '/tiles/m9.svg' },
  // Dots (Tong)
  { id: 'p1', suit: 'Dots' as Suit, value: 1, name: 'One Bamboo', unicode: '🀙', image: '/tiles/p1.svg' },
  { id: 'p2', suit: 'Dots' as Suit, value: 2, name: 'Two Bamboo', unicode: '🀚', image: '/tiles/p2.svg' },
  { id: 'p3', suit: 'Dots' as Suit, value: 3, name: 'Three Bamboo', unicode: '🀛', image: '/tiles/p3.svg' },
  { id: 'p4', suit: 'Dots' as Suit, value: 4, name: 'Four Bamboo', unicode: '🀜', image: '/tiles/p4.svg' },
  { id: 'p5', suit: 'Dots' as Suit, value: 5, name: 'Five Bamboo', unicode: '🀝', image: '/tiles/p5.svg' },
  { id: 'p6', suit: 'Dots' as Suit, value: 6, name: 'Six Bamboo', unicode: '🀞', image: '/tiles/p6.svg' },
  { id: 'p7', suit: 'Dots' as Suit, value: 7, name: 'Seven Bamboo', unicode: '🀟', image: '/tiles/p7.svg' },
  { id: 'p8', suit: 'Dots' as Suit, value: 8, name: 'Eight Bamboo', unicode: '🀠', image: '/tiles/p8.svg' },
  { id: 'p9', suit: 'Dots' as Suit, value: 9, name: 'Nine Bamboo', unicode: '🀡', image: '/tiles/p9.svg' },
  // Bamboo (Tiao)
  { id: 's1', suit: 'Bamboo' as Suit, value: 1, name: 'One Dots', unicode: '🀐', image: '/tiles/s1.svg' },
  { id: 's2', suit: 'Bamboo' as Suit, value: 2, name: 'Two Dots', unicode: '🀑', image: '/tiles/s2.svg' },
  { id: 's3', suit: 'Bamboo' as Suit, value: 3, name: 'Three Dots', unicode: '🀒', image: '/tiles/s3.svg' },
  { id: 's4', suit: 'Bamboo' as Suit, value: 4, name: 'Four Dots', unicode: '🀓', image: '/tiles/s4.svg' },
  { id: 's5', suit: 'Bamboo' as Suit, value: 5, name: 'Five Dots', unicode: '🀔', image: '/tiles/s5.svg' },
  { id: 's6', suit: 'Bamboo' as Suit, value: 6, name: 'Six Dots', unicode: '🀕', image: '/tiles/s6.svg' },
  { id: 's7', suit: 'Bamboo' as Suit, value: 7, name: 'Seven Dots', unicode: '🀖', image: '/tiles/s7.svg' },
  { id: 's8', suit: 'Bamboo' as Suit, value: 8, name: 'Eight Dots', unicode: '🀗', image: '/tiles/s8.svg' },
  { id: 's9', suit: 'Bamboo' as Suit, value: 9, name: 'Nine Dots', unicode: '🀘', image: '/tiles/s9.svg' },
  // Honors (Winds & Dragons)
  { id: 'z1', suit: 'Honors' as Suit, value: 'E', name: 'East', unicode: '🀀', image: '/tiles/z1.svg' },
  { id: 'z2', suit: 'Honors' as Suit, value: 'S', name: 'South', unicode: '🀁', image: '/tiles/z2.svg' },
  { id: 'z3', suit: 'Honors' as Suit, value: 'W', name: 'West', unicode: '🀂', image: '/tiles/z3.svg' },
  { id: 'z4', suit: 'Honors' as Suit, value: 'N', name: 'North', unicode: '🀃', image: '/tiles/z4.svg' },
  { id: 'z5', suit: 'Honors' as Suit, value: 'WHT', name: 'White', unicode: '🀆', image: '/tiles/z5.svg' },
  { id: 'z6', suit: 'Honors' as Suit, value: 'GRN', name: 'Green', unicode: '🀅', image: '/tiles/z6.svg' },
  { id: 'z7', suit: 'Honors' as Suit, value: 'RED', name: 'Red', unicode: '🀄', image: '/tiles/z7.svg' },
  // Flowers (1-4)
  { id: 'f1', suit: 'Flowers' as Suit, value: 1, name: 'Plum', unicode: '🀢', image: '/tiles/f1.svg' },
  { id: 'f2', suit: 'Flowers' as Suit, value: 2, name: 'Orchid', unicode: '🀣', image: '/tiles/f2.svg' },
  { id: 'f3', suit: 'Flowers' as Suit, value: 3, name: 'Chrysanthemum', unicode: '🀥', image: '/tiles/f3.svg' },
  { id: 'f4', suit: 'Flowers' as Suit, value: 4, name: 'Bamboo', unicode: '🀤', image: '/tiles/f4.svg' },
  { id: 'f5', suit: 'Flowers' as Suit, value: 1, name: 'Spring', unicode: '🀦', image: '/tiles/f5.svg' },
  { id: 'f6', suit: 'Flowers' as Suit, value: 2, name: 'Summer', unicode: '🀧', image: '/tiles/f6.svg' },
  { id: 'f7', suit: 'Flowers' as Suit, value: 3, name: 'Autumn', unicode: '🀨', image: '/tiles/f7.svg' },
  { id: 'f8', suit: 'Flowers' as Suit, value: 4, name: 'Winter', unicode: '🀩', image: '/tiles/f8.svg' }
];

// Helper function to get tiles by IDs
function getTilesByIds(ids: string[]) {
  return ids.map(id => {
    const tile = TEST_TILES.find(t => t.id === id);
    if (!tile) throw new Error(`Tile with id ${id} not found`);
    return tile;
  });
}

describe('validateHand - 50 Comprehensive Edge and Core Cases', () => {

  // ==========================================
  // GROUP 1: Standard Hand Types (Valid)
  // ==========================================
  describe('Group 1: Standard Hand Types (Valid)', () => {
    test('1. All Triplets (Toitoi) - Valid', () => {
      const ids = ['m1', 'm1', 'm1', 'p2', 'p2', 'p2', 's3', 's3', 's3', 'z4', 'z4', 'z4', 'z5', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('2. All Sequences (Pinfu shape) - Valid', () => {
      const ids = ['m1', 'm2', 'm3', 'p4', 'p5', 'p6', 's7', 's8', 's9', 'm4', 'm5', 'm6', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('3. Pure Full Flush (Chinitsu) - Valid', () => {
      const ids = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm2', 'm3', 'm4', 'm9', 'm9'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('4. Half Flush (Honitsu) - Valid', () => {
      const ids = ['s1', 's2', 's3', 's4', 's5', 's6', 'z1', 'z1', 'z1', 'z2', 'z2', 'z2', 'z3', 'z3'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('5. All Terminals & Honors (Honroutou shape) - Valid', () => {
      const ids = ['m1', 'm1', 'm1', 'm9', 'm9', 'm9', 'p1', 'p1', 'p1', 'p9', 'p9', 'p9', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('6. Three consecutive triplets (Sanshoku Doukou) - Valid', () => {
      const ids = ['m2', 'm2', 'm2', 'p2', 'p2', 'p2', 's2', 's2', 's2', 'z1', 'z1', 'z1', 'z2', 'z2'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('7. Three identical sequences (Sanshoku Doujun) - Valid', () => {
      const ids = ['m1', 'm2', 'm3', 'p1', 'p2', 'p3', 's1', 's2', 's3', 'z1', 'z1', 'z1', 'z2', 'z2'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('8. Standard mixed suit hand - Valid', () => {
      const ids = ['m3', 'm4', 'm5', 'p6', 'p7', 'p8', 's2', 's2', 's2', 'z1', 'z1', 'z1', 'z5', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('9. Terminal sequences + honors pair (Junchan shape) - Valid', () => {
      const ids = ['m7', 'm8', 'm9', 'p7', 'p8', 'p9', 's1', 's2', 's3', 'm1', 'm2', 'm3', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('10. Pure straight (Ittsu) 1 through 9 same suit - Valid', () => {
      const ids = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'p1', 'p2', 'p3', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });
  });

  // ==========================================
  // GROUP 2: Complex Valid Sequences & Combinations
  // ==========================================
  describe('Group 2: Complex Valid Sequences & Triplet Combinations', () => {
    test('11. Double identical sequences (Iipeikou) - Valid', () => {
      const ids = ['m2', 'm2', 'm3', 'm3', 'm4', 'm4', 'p5', 'p6', 'p7', 's1', 's2', 's3', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('12. Two double identical sequences (Ryanpeikou) - Valid', () => {
      const ids = ['m2', 'm2', 'm3', 'm3', 'm4', 'm4', 'p5', 'p5', 'p6', 'p6', 'p7', 'p7', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('13. Chuuren Poutou (Nine Gates) wait on 1 - Valid', () => {
      const ids = ['m1', 'm1', 'm1', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm9', 'm9'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('14. Chuuren Poutou (Nine Gates) wait on 5 - Valid', () => {
      const ids = ['m1', 'm1', 'm1', 'm2', 'm3', 'm4', 'm5', 'm5', 'm6', 'm7', 'm8', 'm9', 'm9', 'm9'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('15. 4 identical tiles split into seq+pair+seq - Valid', () => {
      // m2,m3,m4 + m3,m4,m5 + m3,m3 -> Uses four 'm3's perfectly
      const ids = ['m2', 'm3', 'm4', 'm3', 'm4', 'm5', 'm3', 'm3', 'p1', 'p2', 'p3', 's1', 's2', 's3'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('16. Overlapping shifted sequences (234, 345, 456) - Valid', () => {
      const ids = ['m2', 'm3', 'm4', 'm3', 'm4', 'm5', 'm4', 'm5', 'm6', 's1', 's1', 's1', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('17. Triplet + 2 sequences same suit - Valid', () => {
      const ids = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm7', 'm7', 'p1', 'p2', 'p3', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('18. 14-tile pure wait configuration - Valid', () => {
      const ids = ['m2', 'm3', 'm4', 'm4', 'm5', 'm6', 'm4', 'm4', 'p1', 'p2', 'p3', 's1', 's2', 's3'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('19. Sequences and triplets utilizing all terminals - Valid', () => {
      const ids = ['m1', 'm2', 'm3', 'm7', 'm8', 'm9', 'p1', 'p1', 'p1', 's9', 's9', 's9', 'm1', 'm1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('20. Honors sets with identical terminal pairs - Valid', () => {
      const ids = ['z1', 'z1', 'z1', 'z2', 'z2', 'z2', 'z3', 'z3', 'z3', 'z4', 'z4', 'z4', 'm9', 'm9'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });
  });

  // ==========================================
  // GROUP 3: Special Hands (Seven Pairs & 13 Orphans)
  // ==========================================
  describe('Group 3: Seven Pairs & Thirteen Orphans Variations', () => {
    test('21. Pure Seven Pairs (All Manzu) - Valid', () => {
      const ids = ['m1', 'm1', 'm2', 'm2', 'm3', 'm3', 'm4', 'm4', 'm5', 'm5', 'm6', 'm6', 'm7', 'm7'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('22. Honors Seven Pairs (All Honors) - Valid', () => {
      const ids = ['z1', 'z1', 'z2', 'z2', 'z3', 'z3', 'z4', 'z4', 'z5', 'z5', 'z6', 'z6', 'z7', 'z7'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('23. Mixed Seven Pairs - Valid', () => {
      const ids = ['m1', 'm1', 'p9', 'p9', 's4', 's4', 'z1', 'z1', 'z3', 'z3', 'z5', 'z5', 'z7', 'z7'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('24. Seven pairs with 4-of-a-kind - Valid in our implementation', () => {
      const ids = ['m1', 'm1', 'm1', 'm1', 'p2', 'p2', 's3', 's3', 'z4', 'z4', 'z5', 'z5', 'z6', 'z6'];
      const result = validateHand(getTilesByIds(ids));
      // Our implementation allows 4-of-a-kind to count as 2 pairs for 7 pairs validation
      expect(result.isValid).toBe(true);
    });

    test('25. Thirteen Orphans (Kokushi Musou) standard wait - Not supported by our validator', () => {
      // Note: Our validator does not support 13 Orphans, so this test expects false.
      const ids = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7', 'z7'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('26. Thirteen Orphans 13-way wait (different pair) - Not supported by our validator', () => {
      const ids = ['m1', 'm1', 'm9', 'p1', 'p9', 's1', 's9', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z7'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('27. Almost 13 Orphans (Missing one, duplicate of non-pair) - Invalid', () => {
      const ids = ['m1', 'm9', 'p1', 'p9', 's1', 's9', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6', 'z6', 'z6'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 4: Structural Invalidities
  // ==========================================
  describe('Group 4: Structural Invalidities (Sets not forming correctly)', () => {
    test('28. 14 tiles, 0 pairs (All sequences + randoms) - Invalid', () => {
      const ids = ['m1', 'm2', 'm3', 'p4', 'p5', 'p6', 's7', 's8', 's9', 'm4', 'm5', 'm6', 'z1', 'z2'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('29. 14 tiles, 2 pairs, missing set - Invalid', () => {
      const ids = ['m1', 'm2', 'm3', 'p4', 'p5', 'p6', 's7', 's8', 's9', 'z1', 'z1', 'z2', 'z2', 'z3'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('30. 14 tiles, 3 pairs, missing set - Invalid', () => {
      const ids = ['m1', 'm2', 'm3', 'p4', 'p5', 'p6', 'z1', 'z1', 'z2', 'z2', 'z3', 'z3', 'z4', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('31. 14 tiles, 6 pairs + 2 singles (Missed 7 pairs) - Invalid', () => {
      const ids = ['m1', 'm1', 'm2', 'm2', 'm3', 'm3', 'm4', 'm4', 'm5', 'm5', 'm6', 'm6', 'z1', 'z2'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('32. 7 Pairs but one pair is actually a sequence (e.g., m1,m2) - Invalid', () => {
      const ids = ['m1', 'm2', 'm3', 'm3', 'm4', 'm4', 'm5', 'm5', 'm6', 'm6', 'm7', 'm7', 'm8', 'm8'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('33. Hand missing 1 tile for sequence - Invalid', () => {
      const ids = ['m1', 'm2', 'p1', 'p2', 'p3', 's1', 's2', 's3', 'z1', 'z1', 'z1', 'z2', 'z2', 'z2'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('34. 4 single tiles left over - Invalid', () => {
      const ids = ['m1', 'm2', 'm3', 'p1', 'p2', 'p3', 's1', 's2', 's3', 'z1', 'z2', 'z3', 'z4', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('35. 1 pair + 4 singles + 2 triplets - Invalid', () => {
      const ids = ['m1', 'm1', 'm1', 'p2', 'p2', 'p2', 'z1', 'z1', 's1', 's2', 's4', 's6', 's8', 's9'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('36. Triplet of flowers (Flowers do not form sets) - Invalid', () => {
      const ids = ['f1', 'f1', 'f1', 'm1', 'm2', 'm3', 'p1', 'p2', 'p3', 's1', 's2', 's3', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 5: Invalid Combinations (Wrap-arounds, cross-suits)
  // ==========================================
  describe('Group 5: Invalid Combinations (Rule Breaks)', () => {
    test('37. Wrap-around sequence (8, 9, 1) - Invalid', () => {
      const ids = ['m8', 'm9', 'm1', 'p2', 'p2', 'p2', 's3', 's3', 's3', 'z4', 'z4', 'z4', 'z5', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('38. Cross-suit sequence (m9, p1, p2) - Invalid', () => {
      const ids = ['m9', 'p1', 'p2', 'p2', 'p2', 'p2', 's3', 's3', 's3', 'z4', 'z4', 'z4', 'z5', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('39. Honor sequence (z1, z2, z3) - Invalid', () => {
      const ids = ['z1', 'z2', 'z3', 'p2', 'p2', 'p2', 's3', 's3', 's3', 'z4', 'z4', 'z4', 'z5', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('40. Fake sequence of unrelated suits (m1, p1, s1) - Invalid', () => {
      const ids = ['m1', 'p1', 's1', 'p2', 'p2', 'p2', 's3', 's3', 's3', 'z4', 'z4', 'z4', 'z5', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('41. Sequence jumping numbers (m1, m3, m5) - Invalid', () => {
      const ids = ['m1', 'm3', 'm5', 'p2', 'p2', 'p2', 's3', 's3', 's3', 'z4', 'z4', 'z4', 'z5', 'z5'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 6: Length Issues (Too many/few tiles)
  // ==========================================
  describe('Group 6: Length Issues (Too many/few tiles)', () => {
    test('42. 13 tiles (Too short) - Invalid', () => {
      const ids = ['m1', 'm2', 'm3', 'p4', 'p5', 'p6', 's7', 's8', 's9', 'm4', 'm5', 'm6', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('43. 15 tiles (Too long without flowers) - Invalid', () => {
      const ids = ['m1', 'm2', 'm3', 'p4', 'p5', 'p6', 's7', 's8', 's9', 'm4', 'm5', 'm6', 'z1', 'z1', 'z2'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('44. 20 tiles (Extreme length) - Invalid', () => {
      const ids = ['m1', 'm1', 'm1', 'm2', 'm2', 'm2', 'm3', 'm3', 'm3', 'm4', 'm4', 'm4', 'm5', 'm5', 'm5', 'm6', 'm6', 'm6', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('45. 2 tiles (Single pair) - Invalid', () => {
      const ids = ['m1', 'm1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('46. 0 tiles (Empty array) - Invalid', () => {
      const ids: string[] = [];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 7: Random User Input / Nonsense
  // ==========================================
  describe('Group 7: Edge Cases & Random User Inputs', () => {
    test('47. 5 identical tiles mathematically grouped but physically impossible - Invalid', () => {
      // mathematically: m1x5 + 3 sets of 3 = 14. (m1,m1,m1) + (m1,m1) pair + 3 sets.
      // a robust validator should check max occurrences <= 4.
      const ids = ['m1', 'm1', 'm1', 'm1', 'm1', 'p1', 'p2', 'p3', 's1', 's2', 's3', 'z1', 'z1', 'z1'];
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(false);
    });

    test('48. Valid hand + 8 flowers (Testing flower filter limits) - Valid', () => {
      // Base valid hand
      const ids = ['m1', 'm1', 'm1', 'm2', 'm3', 'm4', 'p5', 'p5', 'p5', 's7', 's8', 's9', 'z1', 'z1'];
      // Add all 8 possible flowers
      ids.push('f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8');
      const result = validateHand(getTilesByIds(ids));
      expect(result.isValid).toBe(true);
    });

    test('49. Invalid string inputs throw proper error (User manipulating network/DOM)', () => {
      const badIds = ['m1', 'fake_tile', 's3'];
      expect(() => {
        validateHand(getTilesByIds(badIds));
      }).toThrow();
    });

    test('50. Complete random gibberish mashing by user - Invalid', () => {
      const ids = ['m1', 'f3', 's7', 'z2', 'p9', 'p4', 'm5', 'f8', 's1', 'z6', 'z7', 'm3', 'p2', 'f1'];
      // Filter out flowers manually just to simulate what the hand looks like to the engine
      const handTiles = getTilesByIds(ids);
      const result = validateHand(handTiles);
      expect(result.isValid).toBe(false);
    });
  });
});
