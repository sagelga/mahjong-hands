export type Suit = 'Characters' | 'Dots' | 'Bamboo' | 'Honors' | 'Flowers';

export interface TileDef {
  id: string;
  suit: Suit;
  value: number | string;
  number?: number;
  name: string;
  unicode: string;
  image: string;
  category?: string;
}

const img = (id: string) => `/assets/tiles/${id}.svg`;

export const MAHJONG_TILES: TileDef[] = [
  // Characters
  { id: 'c1', suit: 'Characters', value: 1, name: 'One Thousand', unicode: '🀇', image: img('c1') },
  { id: 'c2', suit: 'Characters', value: 2, name: 'Two Thousand', unicode: '🀈', image: img('c2') },
  { id: 'c3', suit: 'Characters', value: 3, name: 'Three Thousand', unicode: '🀉', image: img('c3') },
  { id: 'c4', suit: 'Characters', value: 4, name: 'Four Thousand', unicode: '🀊', image: img('c4') },
  { id: 'c5', suit: 'Characters', value: 5, name: 'Five Thousand', unicode: '🀋', image: img('c5') },
  { id: 'c6', suit: 'Characters', value: 6, name: 'Six Thousand', unicode: '🀌', image: img('c6') },
  { id: 'c7', suit: 'Characters', value: 7, name: 'Seven Thousand', unicode: '🀍', image: img('c7') },
  { id: 'c8', suit: 'Characters', value: 8, name: 'Eight Thousand', unicode: '🀎', image: img('c8') },
  { id: 'c9', suit: 'Characters', value: 9, name: 'Nine Thousand', unicode: '🀏', image: img('c9') },
  // Dots
  { id: 'd1', suit: 'Dots', value: 1, name: 'One Circle', unicode: '🀙', image: img('d1') },
  { id: 'd2', suit: 'Dots', value: 2, name: 'Two Circles', unicode: '🀚', image: img('d2') },
  { id: 'd3', suit: 'Dots', value: 3, name: 'Three Circles', unicode: '🀛', image: img('d3') },
  { id: 'd4', suit: 'Dots', value: 4, name: 'Four Circles', unicode: '🀜', image: img('d4') },
  { id: 'd5', suit: 'Dots', value: 5, name: 'Five Circles', unicode: '🀝', image: img('d5') },
  { id: 'd6', suit: 'Dots', value: 6, name: 'Six Circles', unicode: '🀞', image: img('d6') },
  { id: 'd7', suit: 'Dots', value: 7, name: 'Seven Circles', unicode: '🀟', image: img('d7') },
  { id: 'd8', suit: 'Dots', value: 8, name: 'Eight Circles', unicode: '🀠', image: img('d8') },
  { id: 'd9', suit: 'Dots', value: 9, name: 'Nine Circles', unicode: '🀡', image: img('d9') },
  // Bamboo
  { id: 'b1', suit: 'Bamboo', value: 1, name: 'One Bamboo', unicode: '🀐', image: img('b1') },
  { id: 'b2', suit: 'Bamboo', value: 2, name: 'Two Bamboo', unicode: '🀑', image: img('b2') },
  { id: 'b3', suit: 'Bamboo', value: 3, name: 'Three Bamboo', unicode: '🀒', image: img('b3') },
  { id: 'b4', suit: 'Bamboo', value: 4, name: 'Four Bamboo', unicode: '🀓', image: img('b4') },
  { id: 'b5', suit: 'Bamboo', value: 5, name: 'Five Bamboo', unicode: '🀔', image: img('b5') },
  { id: 'b6', suit: 'Bamboo', value: 6, name: 'Six Bamboo', unicode: '🀕', image: img('b6') },
  { id: 'b7', suit: 'Bamboo', value: 7, name: 'Seven Bamboo', unicode: '🀖', image: img('b7') },
  { id: 'b8', suit: 'Bamboo', value: 8, name: 'Eight Bamboo', unicode: '🀗', image: img('b8') },
  { id: 'b9', suit: 'Bamboo', value: 9, name: 'Nine Bamboo', unicode: '🀘', image: img('b9') },
  // Honors
  { id: 'h1', suit: 'Honors', value: 'E', name: 'East Wind', unicode: '🀀', image: img('h1') },
  { id: 'h2', suit: 'Honors', value: 'S', name: 'South Wind', unicode: '🀁', image: img('h2') },
  { id: 'h3', suit: 'Honors', value: 'W', name: 'West Wind', unicode: '🀂', image: img('h3') },
  { id: 'h4', suit: 'Honors', value: 'N', name: 'North Wind', unicode: '🀃', image: img('h4') },
  { id: 'h5', suit: 'Honors', value: 'WHT', name: 'White Dragon', unicode: '🀆', image: img('h5') },
  { id: 'h6', suit: 'Honors', value: 'GRN', name: 'Green Dragon', unicode: '🀅', image: img('h6') },
  { id: 'h7', suit: 'Honors', value: 'RED', name: 'Red Dragon', unicode: '🀄', image: img('h7') },
  // Flowers
  { id: 'f1', suit: 'Flowers', value: 1, name: 'Plum', unicode: '🌸', image: img('f1') },
  { id: 'f2', suit: 'Flowers', value: 2, name: 'Orchid', unicode: '🌺', image: img('f2') },
  { id: 'f3', suit: 'Flowers', value: 3, name: 'Chrysanthemum', unicode: '🌻', image: img('f3') },
  { id: 'f4', suit: 'Flowers', value: 4, name: 'Bamboo Flower', unicode: '🎋', image: img('f4') },
  { id: 'f5', suit: 'Flowers', value: 5, name: 'Spring', unicode: '🌱', image: img('f5') },
  { id: 'f6', suit: 'Flowers', value: 6, name: 'Summer', unicode: '☀️', image: img('f6') },
  { id: 'f7', suit: 'Flowers', value: 7, name: 'Autumn', unicode: '🍂', image: img('f7') },
  { id: 'f8', suit: 'Flowers', value: 8, name: 'Winter', unicode: '❄️', image: img('f8') },
];

export const SUITS: Suit[] = ['Characters', 'Dots', 'Bamboo', 'Honors', 'Flowers'];
