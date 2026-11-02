import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MahjongHand from '../src/components/features/builder/MahjongHand';
import type { TileDef } from '../src/lib/tiles';
import type { ComboGroup } from '../src/lib/comboDetector';

// Mock tile data
const mockTiles: TileDef[] = [
  {
    id: 'b1-1',
    name: 'Bamboo 1',
    suit: 'Bamboo',
    value: 1,
    number: 1,
    image: '/assets/tiles/b1.svg',
    category: 'Suits'
  },
  {
    id: 'b2-1',
    name: 'Bamboo 2',
    suit: 'Bamboo',
    value: 2,
    number: 2,
    image: '/assets/tiles/b2.svg',
    category: 'Suits'
  },
  {
    id: 'b3-1',
    name: 'Bamboo 3',
    suit: 'Bamboo',
    value: 3,
    number: 3,
    image: '/assets/tiles/b3.svg',
    category: 'Suits'
  },
  {
    id: 'c1-1',
    name: 'Characters 1',
    suit: 'Characters',
    value: 1,
    number: 1,
    image: '/assets/tiles/c1.svg',
    category: 'Suits'
  },
  {
    id: 'f1-1',
    name: 'Flower 1',
    suit: 'Flowers',
    value: 1,
    number: 1,
    image: '/assets/tiles/f1.svg',
    category: 'Honors'
  }
];

const fourteenTiles: TileDef[] = Array.from({ length: 14 }, (_, index) => ({
  id: `tile-${index}`,
  name: `Tile ${index + 1}`,
  suit: index % 2 === 0 ? 'Bamboo' : 'Characters',
  value: (index % 9) + 1,
  number: (index % 9) + 1,
  image: `/assets/tiles/tile-${index}.svg`,
  category: 'Suits'
}));

const mockComboGroups: ComboGroup[] = [
  {
    indices: [0, 1, 2],
    comboType: 'chow',
    formation: 'sequence',
    tiles: [mockTiles[0], mockTiles[1], mockTiles[2]]
  }
];

describe('MahjongHand Component', () => {
  const defaultProps = {
    tiles: mockTiles,
    onRemoveTile: jest.fn(),
    onReorderTiles: jest.fn(),
    isValid: false,
    invalidTiles: [],
    onClearHand: jest.fn(),
    comboGroups: []
  };

  test('renders hand header with tile counts', () => {
    render(<MahjongHand {...defaultProps} />);

    expect(screen.getByText('Your Hand')).toBeInTheDocument();
    expect(screen.getByText('4 / 14')).toBeInTheDocument();
    expect(screen.getByText('Flowers')).toBeInTheDocument(); // Flower area label
  });

  test('renders tiles correctly', () => {
    render(<MahjongHand {...defaultProps} />);

    expect(screen.getByAltText('Bamboo 1')).toBeInTheDocument();
    expect(screen.getByAltText('Bamboo 2')).toBeInTheDocument();
    expect(screen.getByAltText('Bamboo 3')).toBeInTheDocument();
    expect(screen.getByAltText('Characters 1')).toBeInTheDocument();
    expect(screen.getByAltText('Flower 1')).toBeInTheDocument();
  });

  test('handles tile removal', () => {
    const onRemoveTile = jest.fn();
    render(<MahjongHand {...defaultProps} onRemoveTile={onRemoveTile} />);

    const removeButtons = screen.getAllByText('×');
    fireEvent.click(removeButtons[0]);

    expect(onRemoveTile).toHaveBeenCalledWith(0);
  });

  test('exposes an accessible remove control on each tile', () => {
    render(<MahjongHand {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Remove Bamboo 1' })).toBeInTheDocument();
  });

  test('handles clear hand button', () => {
    const onClearHand = jest.fn();
    render(<MahjongHand {...defaultProps} onClearHand={onClearHand} />);

    const clearButton = screen.getByTitle('Clear hand');
    fireEvent.click(clearButton);

    expect(onClearHand).toHaveBeenCalled();
  });

  test('renders combo groups when provided', () => {
    render(
      <MahjongHand
        {...defaultProps}
        comboGroups={mockComboGroups}
      />
    );

    expect(screen.getByText('CHOW - SEQUENCE')).toBeInTheDocument();
  });

  test('shows ghost slots when hand is less than 14 tiles', () => {
    render(<MahjongHand {...defaultProps} />);

    // Should show 10 blank slots (14 - 4 main tiles = 10)
    const blankSlots = screen.getAllByText('+');
    expect(blankSlots).toHaveLength(10);
  });

  test('shows the rack footer progress copy', () => {
    render(<MahjongHand {...defaultProps} />);

    expect(screen.getByText('10 tiles to complete.')).toBeInTheDocument();
    expect(screen.getByText('10 tiles to complete')).toBeInTheDocument();
  });

  test('shows the empty rack hint and a full set of ghost slots', () => {
    render(<MahjongHand {...defaultProps} tiles={[]} />);

    expect(screen.getByText('0 / 14')).toBeInTheDocument();
    expect(screen.getByText('Pick a tile from the tray to start.')).toBeInTheDocument();
    expect(screen.getByText('14 tiles to complete')).toBeInTheDocument();
    expect(screen.getAllByText('+')).toHaveLength(14);
    expect(screen.queryByText('Flowers')).not.toBeInTheDocument();
  });

  test('uses singular copy when one tile remains', () => {
    render(<MahjongHand {...defaultProps} tiles={fourteenTiles.slice(0, 13)} />);

    expect(screen.getByText('1 tile to complete.')).toBeInTheDocument();
    expect(screen.getByText('1 tile to complete')).toBeInTheDocument();
  });

  test('shows the check-the-shape state for a full invalid hand', () => {
    render(<MahjongHand {...defaultProps} tiles={fourteenTiles} isValid={false} />);

    expect(screen.getByText('14 / 14')).toBeInTheDocument();
    expect(screen.getByText('14 tiles · check the shape.')).toBeInTheDocument();
    expect(screen.getByText('Check the shape')).toBeInTheDocument();
    expect(screen.queryAllByText('+')).toHaveLength(0);
  });

  test('shows the winning state for a valid full hand', () => {
    render(<MahjongHand {...defaultProps} tiles={fourteenTiles} isValid={true} />);

    expect(screen.getByText('14 / 14')).toBeInTheDocument();
    expect(screen.getByText('Winning hand.')).toBeInTheDocument();
    expect(screen.getByText('Winning hand')).toBeInTheDocument();
    expect(screen.getByTestId('hand-container')).toHaveClass('valid');
  });

  test('applies validation classes correctly', () => {
    const { rerender } = render(<MahjongHand {...defaultProps} isValid={false} />);

    const handContainer = screen.getByTestId('hand-container');
    expect(handContainer).not.toHaveClass('valid');

    rerender(<MahjongHand {...defaultProps} isValid={true} />);
    expect(handContainer).toHaveClass('valid');
  });

  test('highlights invalid tiles', () => {
    render(
      <MahjongHand
        {...defaultProps}
        invalidTiles={['b1-1']}
        isValid={true}
      />
    );

    const invalidTile = screen.getByAltText('Bamboo 1');
    expect(invalidTile.parentElement).toHaveClass('invalid');
  });
});
