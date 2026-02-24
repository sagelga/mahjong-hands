export type Suit = 'Characters (Wan)' | 'Dots (Tong)' | 'Bamboo (Tiao)' | 'Honors' | 'Flowers';

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
  { id: 'm1', suit: 'Characters (Wan)', value: 1, name: 'One Wan', unicode: '🀇', image: getImageUrl('m1') },
  { id: 'm2', suit: 'Characters (Wan)', value: 2, name: 'Two Wan', unicode: '🀈', image: getImageUrl('m2') },
  { id: 'm3', suit: 'Characters (Wan)', value: 3, name: 'Three Wan', unicode: '🀉', image: getImageUrl('m3') },
  { id: 'm4', suit: 'Characters (Wan)', value: 4, name: 'Four Wan', unicode: '🀊', image: getImageUrl('m4') },
  { id: 'm5', suit: 'Characters (Wan)', value: 5, name: 'Five Wan', unicode: '🀋', image: getImageUrl('m5') },
  { id: 'm6', suit: 'Characters (Wan)', value: 6, name: 'Six Wan', unicode: '🀌', image: getImageUrl('m6') },
  { id: 'm7', suit: 'Characters (Wan)', value: 7, name: 'Seven Wan', unicode: '🀍', image: getImageUrl('m7') },
  { id: 'm8', suit: 'Characters (Wan)', value: 8, name: 'Eight Wan', unicode: '🀎', image: getImageUrl('m8') },
  { id: 'm9', suit: 'Characters (Wan)', value: 9, name: 'Nine Wan', unicode: '🀏', image: getImageUrl('m9') },
  // Dots (Tong)
  { id: 'p1', suit: 'Dots (Tong)', value: 1, name: 'One Tong', unicode: '🀙', image: getImageUrl('p1') },
  { id: 'p2', suit: 'Dots (Tong)', value: 2, name: 'Two Tong', unicode: '🀚', image: getImageUrl('p2') },
  { id: 'p3', suit: 'Dots (Tong)', value: 3, name: 'Three Tong', unicode: '🀛', image: getImageUrl('p3') },
  { id: 'p4', suit: 'Dots (Tong)', value: 4, name: 'Four Tong', unicode: '🀜', image: getImageUrl('p4') },
  { id: 'p5', suit: 'Dots (Tong)', value: 5, name: 'Five Tong', unicode: '🀝', image: getImageUrl('p5') },
  { id: 'p6', suit: 'Dots (Tong)', value: 6, name: 'Six Tong', unicode: '🀞', image: getImageUrl('p6') },
  { id: 'p7', suit: 'Dots (Tong)', value: 7, name: 'Seven Tong', unicode: '🀟', image: getImageUrl('p7') },
  { id: 'p8', suit: 'Dots (Tong)', value: 8, name: 'Eight Tong', unicode: '🀠', image: getImageUrl('p8') },
  { id: 'p9', suit: 'Dots (Tong)', value: 9, name: 'Nine Tong', unicode: '🀡', image: getImageUrl('p9') },
  // Bamboo (Tiao)
  { id: 's1', suit: 'Bamboo (Tiao)', value: 1, name: 'One Tiao', unicode: '🀐', image: getImageUrl('s1') },
  { id: 's2', suit: 'Bamboo (Tiao)', value: 2, name: 'Two Tiao', unicode: '🀑', image: getImageUrl('s2') },
  { id: 's3', suit: 'Bamboo (Tiao)', value: 3, name: 'Three Tiao', unicode: '🀒', image: getImageUrl('s3') },
  { id: 's4', suit: 'Bamboo (Tiao)', value: 4, name: 'Four Tiao', unicode: '🀓', image: getImageUrl('s4') },
  { id: 's5', suit: 'Bamboo (Tiao)', value: 5, name: 'Five Tiao', unicode: '🀔', image: getImageUrl('s5') },
  { id: 's6', suit: 'Bamboo (Tiao)', value: 6, name: 'Six Tiao', unicode: '🀕', image: getImageUrl('s6') },
  { id: 's7', suit: 'Bamboo (Tiao)', value: 7, name: 'Seven Tiao', unicode: '🀖', image: getImageUrl('s7') },
  { id: 's8', suit: 'Bamboo (Tiao)', value: 8, name: 'Eight Tiao', unicode: '🀗', image: getImageUrl('s8') },
  { id: 's9', suit: 'Bamboo (Tiao)', value: 9, name: 'Nine Tiao', unicode: '🀘', image: getImageUrl('s9') },
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

export const SUITS: Suit[] = ['Characters (Wan)', 'Dots (Tong)', 'Bamboo (Tiao)', 'Honors', 'Flowers'];
