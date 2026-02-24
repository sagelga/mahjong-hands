export type Suit = 'Characters' | 'Dots' | 'Bamboo' | 'Honors' | 'Flowers';

export interface TileDef {
  id: string;
  suit: Suit;
  value: number | string;
  name: string;
  unicode: string;
  image: string;
}

const getImageUrl = (id: string) => new URL(`../assets/tiles/${id}.svg`, import.meta.url).href;

export const MAHJONG_TILES: TileDef[] = [
  // Characters (Wan)
  { id: 'm1', suit: 'Characters', value: 1, name: 'One Thousand', unicode: '🀇', image: getImageUrl('m1') },
  { id: 'm2', suit: 'Characters', value: 2, name: 'Two Thousand', unicode: '🀈', image: getImageUrl('m2') },
  { id: 'm3', suit: 'Characters', value: 3, name: 'Three Thousand', unicode: '🀉', image: getImageUrl('m3') },
  { id: 'm4', suit: 'Characters', value: 4, name: 'Four Thousand', unicode: '🀊', image: getImageUrl('m4') },
  { id: 'm5', suit: 'Characters', value: 5, name: 'Five Thousand', unicode: '🀋', image: getImageUrl('m5') },
  { id: 'm6', suit: 'Characters', value: 6, name: 'Six Thousand', unicode: '🀌', image: getImageUrl('m6') },
  { id: 'm7', suit: 'Characters', value: 7, name: 'Seven Thousand', unicode: '🀍', image: getImageUrl('m7') },
  { id: 'm8', suit: 'Characters', value: 8, name: 'Eight Thousand', unicode: '🀎', image: getImageUrl('m8') },
  { id: 'm9', suit: 'Characters', value: 9, name: 'Nine Thousand', unicode: '🀏', image: getImageUrl('m9') },
  // Dots (Tong)
  { id: 'p1', suit: 'Dots', value: 1, name: 'One Bamboo', unicode: '🀙', image: getImageUrl('p1') },
  { id: 'p2', suit: 'Dots', value: 2, name: 'Two Bamboo', unicode: '🀚', image: getImageUrl('p2') },
  { id: 'p3', suit: 'Dots', value: 3, name: 'Three Bamboo', unicode: '🀛', image: getImageUrl('p3') },
  { id: 'p4', suit: 'Dots', value: 4, name: 'Four Bamboo', unicode: '🀜', image: getImageUrl('p4') },
  { id: 'p5', suit: 'Dots', value: 5, name: 'Five Bamboo', unicode: '🀝', image: getImageUrl('p5') },
  { id: 'p6', suit: 'Dots', value: 6, name: 'Six Bamboo', unicode: '🀞', image: getImageUrl('p6') },
  { id: 'p7', suit: 'Dots', value: 7, name: 'Seven Bamboo', unicode: '🀟', image: getImageUrl('p7') },
  { id: 'p8', suit: 'Dots', value: 8, name: 'Eight Bamboo', unicode: '🀠', image: getImageUrl('p8') },
  { id: 'p9', suit: 'Dots', value: 9, name: 'Nine Bamboo', unicode: '🀡', image: getImageUrl('p9') },
  // Bamboo (Tiao)
  { id: 's1', suit: 'Bamboo', value: 1, name: 'One Dots', unicode: '🀐', image: getImageUrl('s1') },
  { id: 's2', suit: 'Bamboo', value: 2, name: 'Two Dots', unicode: '🀑', image: getImageUrl('s2') },
  { id: 's3', suit: 'Bamboo', value: 3, name: 'Three Dots', unicode: '🀒', image: getImageUrl('s3') },
  { id: 's4', suit: 'Bamboo', value: 4, name: 'Four Dots', unicode: '🀓', image: getImageUrl('s4') },
  { id: 's5', suit: 'Bamboo', value: 5, name: 'Five Dots', unicode: '🀔', image: getImageUrl('s5') },
  { id: 's6', suit: 'Bamboo', value: 6, name: 'Six Dots', unicode: '🀕', image: getImageUrl('s6') },
  { id: 's7', suit: 'Bamboo', value: 7, name: 'Seven Dots', unicode: '🀖', image: getImageUrl('s7') },
  { id: 's8', suit: 'Bamboo', value: 8, name: 'Eight Dots', unicode: '🀗', image: getImageUrl('s8') },
  { id: 's9', suit: 'Bamboo', value: 9, name: 'Nine Dots', unicode: '🀘', image: getImageUrl('s9') },
  // Honors (Winds & Dragons)
  { id: 'z1', suit: 'Honors', value: 'E', name: 'East', unicode: '🀀', image: getImageUrl('z1') },
  { id: 'z2', suit: 'Honors', value: 'S', name: 'South', unicode: '🀁', image: getImageUrl('z2') },
  { id: 'z3', suit: 'Honors', value: 'W', name: 'West', unicode: '🀂', image: getImageUrl('z3') },
  { id: 'z4', suit: 'Honors', value: 'N', name: 'North', unicode: '🀃', image: getImageUrl('z4') },
  { id: 'z5', suit: 'Honors', value: 'WHT', name: 'White', unicode: '🀆', image: getImageUrl('z5') },
  { id: 'z6', suit: 'Honors', value: 'GRN', name: 'Green', unicode: '🀅', image: getImageUrl('z6') },
  { id: 'z7', suit: 'Honors', value: 'RED', name: 'Red', unicode: '🀄', image: getImageUrl('z7') },
  // Flowers (1-4)
  { id: 'f1', suit: 'Flowers', value: 1, name: 'Plum', unicode: '🀢', image: getImageUrl('f7') },
  { id: 'f2', suit: 'Flowers', value: 2, name: 'Orchid', unicode: '🀣', image: getImageUrl('f8') },
  { id: 'f3', suit: 'Flowers', value: 3, name: 'Chrysanthemum', unicode: '🀥', image: getImageUrl('f4') },
  { id: 'f4', suit: 'Flowers', value: 4, name: 'Bamboo', unicode: '🀤', image: getImageUrl('f3') },
  // Seasons (1-4)
  { id: 'f5', suit: 'Flowers', value: 1, name: 'Spring', unicode: '🀦', image: getImageUrl('f5') },
  { id: 'f6', suit: 'Flowers', value: 2, name: 'Summer', unicode: '🀧', image: getImageUrl('f6') },
  { id: 'f7', suit: 'Flowers', value: 3, name: 'Autumn', unicode: '🀨', image: getImageUrl('f1') },
  { id: 'f8', suit: 'Flowers', value: 4, name: 'Winter', unicode: '🀩', image: getImageUrl('f2') }
];

export const SUITS: Suit[] = ['Characters (Thousand)', 'Dots (Bamboo)', 'Bamboo (Dots)', 'Honors', 'Flowers'];
