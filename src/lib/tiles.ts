export type Suit = 'Characters' | 'Dots' | 'Bamboo' | 'Honors' | 'Flowers';

export interface TileDef {
  id: string;
  suit: Suit;
  value: number | string;
  number?: number; // For backward compatibility
  name: string;
  unicode: string;
  image: string;
  category?: string;
}

const getImageUrl = (id: string) => new URL(`../assets/tiles/${id}.svg`, import.meta.url).href;

export const MAHJONG_TILES: TileDef[] = [
  // Characters (Wan)
  { id: 'c1', suit: 'Characters', value: 1, name: 'One Thousand', unicode: '🀇', image: getImageUrl('c1') },
  { id: 'c2', suit: 'Characters', value: 2, name: 'Two Thousand', unicode: '🀈', image: getImageUrl('c2') },
  { id: 'c3', suit: 'Characters', value: 3, name: 'Three Thousand', unicode: '🀉', image: getImageUrl('c3') },
  { id: 'c4', suit: 'Characters', value: 4, name: 'Four Thousand', unicode: '🀊', image: getImageUrl('c4') },
  { id: 'c5', suit: 'Characters', value: 5, name: 'Five Thousand', unicode: '🀋', image: getImageUrl('c5') },
  { id: 'c6', suit: 'Characters', value: 6, name: 'Six Thousand', unicode: '🀌', image: getImageUrl('c6') },
  { id: 'c7', suit: 'Characters', value: 7, name: 'Seven Thousand', unicode: '🀍', image: getImageUrl('c7') },
  { id: 'c8', suit: 'Characters', value: 8, name: 'Eight Thousand', unicode: '🀎', image: getImageUrl('c8') },
  { id: 'c9', suit: 'Characters', value: 9, name: 'Nine Thousand', unicode: '🀏', image: getImageUrl('c9') },
  // Dots (Tong)
  { id: 'd1', suit: 'Dots', value: 1, name: 'One Dots', unicode: '🀙', image: getImageUrl('d1') },
  { id: 'd2', suit: 'Dots', value: 2, name: 'Two Dots', unicode: '🀚', image: getImageUrl('d2') },
  { id: 'd3', suit: 'Dots', value: 3, name: 'Three Dots', unicode: '🀛', image: getImageUrl('d3') },
  { id: 'd4', suit: 'Dots', value: 4, name: 'Four Dots', unicode: '🀜', image: getImageUrl('d4') },
  { id: 'd5', suit: 'Dots', value: 5, name: 'Five Dots', unicode: '🀝', image: getImageUrl('d5') },
  { id: 'd6', suit: 'Dots', value: 6, name: 'Six Dots', unicode: '🀞', image: getImageUrl('d6') },
  { id: 'd7', suit: 'Dots', value: 7, name: 'Seven Dots', unicode: '🀟', image: getImageUrl('d7') },
  { id: 'd8', suit: 'Dots', value: 8, name: 'Eight Dots', unicode: '🀠', image: getImageUrl('d8') },
  { id: 'd9', suit: 'Dots', value: 9, name: 'Nine Dots', unicode: '🀡', image: getImageUrl('d9') },
  // Bamboo (Tiao)
  { id: 'b1', suit: 'Bamboo', value: 1, name: 'One Bamboo', unicode: '🀐', image: getImageUrl('b1') },
  { id: 'b2', suit: 'Bamboo', value: 2, name: 'Two Bamboo', unicode: '🀑', image: getImageUrl('b2') },
  { id: 'b3', suit: 'Bamboo', value: 3, name: 'Three Bamboo', unicode: '🀒', image: getImageUrl('b3') },
  { id: 'b4', suit: 'Bamboo', value: 4, name: 'Four Bamboo', unicode: '🀓', image: getImageUrl('b4') },
  { id: 'b5', suit: 'Bamboo', value: 5, name: 'Five Bamboo', unicode: '🀔', image: getImageUrl('b5') },
  { id: 'b6', suit: 'Bamboo', value: 6, name: 'Six Bamboo', unicode: '🀕', image: getImageUrl('b6') },
  { id: 'b7', suit: 'Bamboo', value: 7, name: 'Seven Bamboo', unicode: '🀖', image: getImageUrl('b7') },
  { id: 'b8', suit: 'Bamboo', value: 8, name: 'Eight Bamboo', unicode: '🀗', image: getImageUrl('b8') },
  { id: 'b9', suit: 'Bamboo', value: 9, name: 'Nine Bamboo', unicode: '🀘', image: getImageUrl('b9') },
  // Honors (Winds & Dragons)
  { id: 'h1', suit: 'Honors', value: 'E', name: 'East', unicode: '🀀', image: getImageUrl('h1') },
  { id: 'h2', suit: 'Honors', value: 'S', name: 'South', unicode: '🀁', image: getImageUrl('h2') },
  { id: 'h3', suit: 'Honors', value: 'W', name: 'West', unicode: '🀂', image: getImageUrl('h3') },
  { id: 'h4', suit: 'Honors', value: 'N', name: 'North', unicode: '🀃', image: getImageUrl('h4') },
  { id: 'h5', suit: 'Honors', value: 'WHT', name: 'White', unicode: '🀆', image: getImageUrl('h5') },
  { id: 'h6', suit: 'Honors', value: 'GRN', name: 'Green', unicode: '🀅', image: getImageUrl('h6') },
  { id: 'h7', suit: 'Honors', value: 'RED', name: 'Red', unicode: '🀄', image: getImageUrl('h7') },
  // Flowers (1-4)
  { id: 'f1', suit: 'Flowers', value: 1, name: 'Plum', unicode: '🀢', image: getImageUrl('f1') },
  { id: 'f2', suit: 'Flowers', value: 2, name: 'Orchid', unicode: '🀣', image: getImageUrl('f2') },
  { id: 'f3', suit: 'Flowers', value: 3, name: 'Chrysanthemum', unicode: '🀥', image: getImageUrl('f3') },
  { id: 'f4', suit: 'Flowers', value: 4, name: 'Bamboo', unicode: '🀤', image: getImageUrl('f4') },
  // Seasons (1-4)
  { id: 'f5', suit: 'Flowers', value: 1, name: 'Spring', unicode: '🀦', image: getImageUrl('f5') },
  { id: 'f6', suit: 'Flowers', value: 2, name: 'Summer', unicode: '🀧', image: getImageUrl('f6') },
  { id: 'f7', suit: 'Flowers', value: 3, name: 'Autumn', unicode: '🀨', image: getImageUrl('f7') },
  { id: 'f8', suit: 'Flowers', value: 4, name: 'Winter', unicode: '🀩', image: getImageUrl('f8') }
];

export const SUITS: Suit[] = ['Characters', 'Dots', 'Bamboo', 'Honors', 'Flowers'];
