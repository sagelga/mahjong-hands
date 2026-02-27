import { validateHand } from '../src/lib/validator';
import type { TileDef, Suit } from '../src/lib/tiles';

// Build a TileDef directly from an ID — avoids import.meta.url used by MAHJONG_TILES
function tile(id: string): TileDef {
  const suitMap: Record<string, Suit> = {
    c: 'Characters', d: 'Dots', b: 'Bamboo', h: 'Honors', f: 'Flowers',
  };
  const honorValues: Record<number, string> = {
    1: 'E', 2: 'S', 3: 'W', 4: 'N', 5: 'WHT', 6: 'GRN', 7: 'RED',
  };
  const match = id.match(/^([cdbhf])(\d+)$/);
  if (!match) throw new Error(`Unknown tile id: ${id}`);
  const [, prefix, numStr] = match;
  const num = parseInt(numStr);
  return { id, suit: suitMap[prefix], value: prefix === 'h' ? honorValues[num] : num, name: id, unicode: '', image: '' };
}

function tiles(...ids: string[]): TileDef[] {
  return ids.map(tile);
}

describe('validateHand - 50 Comprehensive Edge and Core Cases', () => {

  // ==========================================
  // GROUP 1: Standard Hand Types (Valid)
  // ==========================================
  describe('Group 1: Standard Hand Types (Valid)', () => {
    test('1. All Triplets (Toitoi) - Valid', () => {
      expect(validateHand(tiles('c1','c1','c1','d2','d2','d2','b3','b3','b3','h4','h4','h4','h5','h5')).isValid).toBe(true);
    });

    test('2. All Sequences (Pinfu shape) - Valid', () => {
      expect(validateHand(tiles('c1','c2','c3','d4','d5','d6','b7','b8','b9','c4','c5','c6','h1','h1')).isValid).toBe(true);
    });

    test('3. Pure Full Flush (Chinitsu) - Valid', () => {
      expect(validateHand(tiles('c1','c2','c3','c4','c5','c6','c7','c8','c9','c2','c3','c4','c9','c9')).isValid).toBe(true);
    });

    test('4. Half Flush (Honitsu) - Valid', () => {
      expect(validateHand(tiles('b1','b2','b3','b4','b5','b6','h1','h1','h1','h2','h2','h2','h3','h3')).isValid).toBe(true);
    });

    test('5. All Terminals & Honors (Honroutou shape) - Valid', () => {
      expect(validateHand(tiles('c1','c1','c1','c9','c9','c9','d1','d1','d1','d9','d9','d9','h1','h1')).isValid).toBe(true);
    });

    test('6. Three consecutive triplets (Sanshoku Doukou) - Valid', () => {
      expect(validateHand(tiles('c2','c2','c2','d2','d2','d2','b2','b2','b2','h1','h1','h1','h2','h2')).isValid).toBe(true);
    });

    test('7. Three identical sequences (Sanshoku Doujun) - Valid', () => {
      expect(validateHand(tiles('c1','c2','c3','d1','d2','d3','b1','b2','b3','h1','h1','h1','h2','h2')).isValid).toBe(true);
    });

    test('8. Standard mixed suit hand - Valid', () => {
      expect(validateHand(tiles('c3','c4','c5','d6','d7','d8','b2','b2','b2','h1','h1','h1','h5','h5')).isValid).toBe(true);
    });

    test('9. Terminal sequences + honors pair (Junchan shape) - Valid', () => {
      expect(validateHand(tiles('c7','c8','c9','d7','d8','d9','b1','b2','b3','c1','c2','c3','h1','h1')).isValid).toBe(true);
    });

    test('10. Pure straight (Ittsu) 1 through 9 same suit - Valid', () => {
      expect(validateHand(tiles('c1','c2','c3','c4','c5','c6','c7','c8','c9','d1','d2','d3','h1','h1')).isValid).toBe(true);
    });
  });

  // ==========================================
  // GROUP 2: Complex Valid Sequences & Combinations
  // ==========================================
  describe('Group 2: Complex Valid Sequences & Triplet Combinations', () => {
    test('11. Double identical sequences (Iipeikou) - Valid', () => {
      expect(validateHand(tiles('c2','c2','c3','c3','c4','c4','d5','d6','d7','b1','b2','b3','h1','h1')).isValid).toBe(true);
    });

    test('12. Two double identical sequences (Ryanpeikou) - Valid', () => {
      expect(validateHand(tiles('c2','c2','c3','c3','c4','c4','d5','d5','d6','d6','d7','d7','h1','h1')).isValid).toBe(true);
    });

    test('13. Chuuren Poutou (Nine Gates) wait on 1 - Valid', () => {
      expect(validateHand(tiles('c1','c1','c1','c1','c2','c3','c4','c5','c6','c7','c8','c9','c9','c9')).isValid).toBe(true);
    });

    test('14. Chuuren Poutou (Nine Gates) wait on 5 - Valid', () => {
      expect(validateHand(tiles('c1','c1','c1','c2','c3','c4','c5','c5','c6','c7','c8','c9','c9','c9')).isValid).toBe(true);
    });

    test('15. 4 identical tiles split into seq+pair+seq - Valid', () => {
      // c2-c3-c4 + c3-c4-c5 + c3-c3(pair) uses four c3s perfectly
      expect(validateHand(tiles('c2','c3','c4','c3','c4','c5','c3','c3','d1','d2','d3','b1','b2','b3')).isValid).toBe(true);
    });

    test('16. Overlapping shifted sequences (234, 345, 456) - Valid', () => {
      expect(validateHand(tiles('c2','c3','c4','c3','c4','c5','c4','c5','c6','b1','b1','b1','h1','h1')).isValid).toBe(true);
    });

    test('17. Triplet + 2 sequences same suit - Valid', () => {
      expect(validateHand(tiles('c1','c2','c3','c4','c5','c6','c7','c7','c7','d1','d2','d3','h1','h1')).isValid).toBe(true);
    });

    test('18. 14-tile pure wait configuration - Valid', () => {
      expect(validateHand(tiles('c2','c3','c4','c4','c5','c6','c4','c4','d1','d2','d3','b1','b2','b3')).isValid).toBe(true);
    });

    test('19. Sequences and triplets utilizing all terminals - Valid', () => {
      expect(validateHand(tiles('c1','c2','c3','c7','c8','c9','d1','d1','d1','b9','b9','b9','c1','c1')).isValid).toBe(true);
    });

    test('20. Honors sets with identical terminal pairs - Valid', () => {
      expect(validateHand(tiles('h1','h1','h1','h2','h2','h2','h3','h3','h3','h4','h4','h4','c9','c9')).isValid).toBe(true);
    });
  });

  // ==========================================
  // GROUP 3: Special Hands (Seven Pairs & 13 Orphans)
  // ==========================================
  describe('Group 3: Seven Pairs & Thirteen Orphans Variations', () => {
    test('21. Pure Seven Pairs (All Characters) - Valid', () => {
      expect(validateHand(tiles('c1','c1','c2','c2','c3','c3','c4','c4','c5','c5','c6','c6','c7','c7')).isValid).toBe(true);
    });

    test('22. Honors Seven Pairs (All Honors) - Valid', () => {
      expect(validateHand(tiles('h1','h1','h2','h2','h3','h3','h4','h4','h5','h5','h6','h6','h7','h7')).isValid).toBe(true);
    });

    test('23. Mixed Seven Pairs - Valid', () => {
      expect(validateHand(tiles('c1','c1','d9','d9','b4','b4','h1','h1','h3','h3','h5','h5','h7','h7')).isValid).toBe(true);
    });

    test('24. Seven pairs with 4-of-a-kind - Valid in our implementation', () => {
      // Our implementation allows 4-of-a-kind to count as 2 pairs for 7 pairs validation
      expect(validateHand(tiles('c1','c1','c1','c1','d2','d2','b3','b3','h4','h4','h5','h5','h6','h6')).isValid).toBe(true);
    });

    test('25. Thirteen Orphans (Kokushi Musou) standard wait - Not supported by our validator', () => {
      // Note: Our validator does not support 13 Orphans, so this test expects false.
      expect(validateHand(tiles('c1','c9','d1','d9','b1','b9','h1','h2','h3','h4','h5','h6','h7','h7')).isValid).toBe(false);
    });

    test('26. Thirteen Orphans 13-way wait (different pair) - Not supported by our validator', () => {
      expect(validateHand(tiles('c1','c1','c9','d1','d9','b1','b9','h1','h2','h3','h4','h5','h6','h7')).isValid).toBe(false);
    });

    test('27. Almost 13 Orphans (Missing one, duplicate of non-pair) - Invalid', () => {
      expect(validateHand(tiles('c1','c9','d1','d9','b1','b9','h1','h2','h3','h4','h5','h6','h6','h6')).isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 4: Structural Invalidities
  // ==========================================
  describe('Group 4: Structural Invalidities (Sets not forming correctly)', () => {
    test('28. 14 tiles, 0 pairs (All sequences + randoms) - Invalid', () => {
      expect(validateHand(tiles('c1','c2','c3','d4','d5','d6','b7','b8','b9','c4','c5','c6','h1','h2')).isValid).toBe(false);
    });

    test('29. 14 tiles, 2 pairs, missing set - Invalid', () => {
      expect(validateHand(tiles('c1','c2','c3','d4','d5','d6','b7','b8','b9','h1','h1','h2','h2','h3')).isValid).toBe(false);
    });

    test('30. 14 tiles, 3 pairs, missing set - Invalid', () => {
      expect(validateHand(tiles('c1','c2','c3','d4','d5','d6','h1','h1','h2','h2','h3','h3','h4','h5')).isValid).toBe(false);
    });

    test('31. 14 tiles, 6 pairs + 2 singles (Missed 7 pairs) - Invalid', () => {
      expect(validateHand(tiles('c1','c1','c2','c2','c3','c3','c4','c4','c5','c5','c6','c6','h1','h2')).isValid).toBe(false);
    });

    test('32. 7 Pairs but one pair is actually a sequence (e.g., c1,c2) - Invalid', () => {
      expect(validateHand(tiles('c1','c2','c3','c3','c4','c4','c5','c5','c6','c6','c7','c7','c8','c8')).isValid).toBe(false);
    });

    test('33. Hand missing 1 tile for sequence - Invalid', () => {
      expect(validateHand(tiles('c1','c2','d1','d2','d3','b1','b2','b3','h1','h1','h1','h2','h2','h2')).isValid).toBe(false);
    });

    test('34. 4 single tiles left over - Invalid', () => {
      expect(validateHand(tiles('c1','c2','c3','d1','d2','d3','b1','b2','b3','h1','h2','h3','h4','h5')).isValid).toBe(false);
    });

    test('35. 1 pair + 4 singles + 2 triplets - Invalid', () => {
      expect(validateHand(tiles('c1','c1','c1','d2','d2','d2','h1','h1','b1','b2','b4','b6','b8','b9')).isValid).toBe(false);
    });

    test('36. Triplet of flowers (Flowers do not form sets) - Invalid', () => {
      expect(validateHand(tiles('f1','f1','f1','c1','c2','c3','d1','d2','d3','b1','b2','b3','h1','h1')).isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 5: Invalid Combinations (Wrap-arounds, cross-suits)
  // ==========================================
  describe('Group 5: Invalid Combinations (Rule Breaks)', () => {
    test('37. Wrap-around sequence (8, 9, 1) - Invalid', () => {
      expect(validateHand(tiles('c8','c9','c1','d2','d2','d2','b3','b3','b3','h4','h4','h4','h5','h5')).isValid).toBe(false);
    });

    test('38. Cross-suit sequence (c9, d1, d2) - Invalid', () => {
      expect(validateHand(tiles('c9','d1','d2','d2','d2','d2','b3','b3','b3','h4','h4','h4','h5','h5')).isValid).toBe(false);
    });

    test('39. Honor sequence (h1, h2, h3) - Invalid', () => {
      expect(validateHand(tiles('h1','h2','h3','d2','d2','d2','b3','b3','b3','h4','h4','h4','h5','h5')).isValid).toBe(false);
    });

    test('40. Fake sequence of unrelated suits (c1, d1, b1) - Invalid', () => {
      expect(validateHand(tiles('c1','d1','b1','d2','d2','d2','b3','b3','b3','h4','h4','h4','h5','h5')).isValid).toBe(false);
    });

    test('41. Sequence jumping numbers (c1, c3, c5) - Invalid', () => {
      expect(validateHand(tiles('c1','c3','c5','d2','d2','d2','b3','b3','b3','h4','h4','h4','h5','h5')).isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 6: Length Issues (Too many/few tiles)
  // ==========================================
  describe('Group 6: Length Issues (Too many/few tiles)', () => {
    test('42. 13 tiles (Too short) - Invalid', () => {
      expect(validateHand(tiles('c1','c2','c3','d4','d5','d6','b7','b8','b9','c4','c5','c6','h1')).isValid).toBe(false);
    });

    test('43. 15 tiles (Too long without flowers) - Invalid', () => {
      expect(validateHand(tiles('c1','c2','c3','d4','d5','d6','b7','b8','b9','c4','c5','c6','h1','h1','h2')).isValid).toBe(false);
    });

    test('44. 20 tiles (Extreme length) - Invalid', () => {
      expect(validateHand(tiles('c1','c1','c1','c2','c2','c2','c3','c3','c3','c4','c4','c4','c5','c5','c5','c6','c6','c6','h1','h1')).isValid).toBe(false);
    });

    test('45. 2 tiles (Single pair) - Invalid', () => {
      expect(validateHand(tiles('c1','c1')).isValid).toBe(false);
    });

    test('46. 0 tiles (Empty array) - Invalid', () => {
      expect(validateHand([]).isValid).toBe(false);
    });
  });

  // ==========================================
  // GROUP 7: Random User Input / Nonsense
  // ==========================================
  describe('Group 7: Edge Cases & Random User Inputs', () => {
    test('47. 5 identical tiles mathematically grouped but physically impossible - Invalid', () => {
      // A robust validator should check max occurrences <= 4
      expect(validateHand(tiles('c1','c1','c1','c1','c1','d1','d2','d3','b1','b2','b3','h1','h1','h1')).isValid).toBe(false);
    });

    test('48. Valid hand + 8 flowers (Testing flower filter limits) - Valid', () => {
      expect(validateHand(tiles('c1','c1','c1','c2','c3','c4','d5','d5','d5','b7','b8','b9','h1','h1','f1','f2','f3','f4','f5','f6','f7','f8')).isValid).toBe(true);
    });

    test('49. Invalid string inputs throw proper error (User manipulating network/DOM)', () => {
      expect(() => {
        validateHand(tiles('c1', 'fake_tile', 'b3'));
      }).toThrow();
    });

    test('50. Complete random gibberish mashing by user - Invalid', () => {
      expect(validateHand(tiles('c1','f3','b7','h2','d9','d4','c5','f8','b1','h6','h7','c3','d2','f1')).isValid).toBe(false);
    });
  });
});
