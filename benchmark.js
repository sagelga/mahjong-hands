import { validateHand } from './src/lib/validator.js';

// Simulate some complex hands for performance testing
const complexHands = [
  // Complex hand with many possible combinations
  ['m1', 'm1', 'm1', 'm2', 'm3', 'm4', 'm4', 'm4', 'm5', 'm6', 'm7', 'p1', 'p1', 'p1'],
  ['m2', 'm3', 'm4', 'm3', 'm4', 'm5', 'm4', 'm5', 'm6', 's1', 's1', 's1', 'z1', 'z1'],
  ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'p1', 'p2', 'p3', 'z1', 'z1'],
  ['z1', 'z1', 'z1', 'z2', 'z2', 'z2', 'z3', 'z3', 'z3', 'z4', 'z4', 'z4', 'm9', 'm9']
];

console.log('Starting performance benchmark...');
console.log('Running each test 100 times...\n');

// Warm up
for (let i = 0; i < 10; i++) {
  for (const hand of complexHands) {
    const tiles = hand.map(id => ({
      id,
      suit: id.startsWith('m') ? 'Characters' : id.startsWith('p') ? 'Dots' : id.startsWith('s') ? 'Bamboo' : 'Honors',
      value: id.slice(1),
      name: '',
      unicode: '',
      image: ''
    }));
    validateHand(tiles);
  }
}

// Benchmark
const iterations = 100;
const start = performance.now();

for (let i = 0; i < iterations; i++) {
  for (const hand of complexHands) {
    const tiles = hand.map(id => ({
      id,
      suit: id.startsWith('m') ? 'Characters' : id.startsWith('p') ? 'Dots' : id.startsWith('s') ? 'Bamboo' : 'Honors',
      value: id.slice(1),
      name: '',
      unicode: '',
      image: ''
    }));
    validateHand(tiles);
  }
}

const end = performance.now();
const totalTime = end - start;
const avgTime = totalTime / (iterations * complexHands.length);

console.log(`Total time for ${iterations * complexHands.length} validations: ${(totalTime).toFixed(2)}ms`);
console.log(`Average time per validation: ${(avgTime).toFixed(4)}ms`);
console.log('Benchmark completed successfully!');
