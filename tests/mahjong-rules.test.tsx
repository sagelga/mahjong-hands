import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import MahjongRules from '../src/components/features/guides/MahjongRules';

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('MahjongRules Component', () => {
  test('renders page title', () => {
    renderWithRouter(<MahjongRules />);
    expect(screen.getByText('How to Play Mahjong')).toBeInTheDocument();
  });

  test('renders game components section', () => {
    renderWithRouter(<MahjongRules />);
    expect(screen.getByText('Game components')).toBeInTheDocument();
  });

  test('renders win conditions section', () => {
    renderWithRouter(<MahjongRules />);
    expect(screen.getByText('How to win in mahjong')).toBeInTheDocument();
  });

  test('renders hand types section with all types', () => {
    renderWithRouter(<MahjongRules />);
    expect(screen.getByText('Pairs, Chow, Pung and Kong')).toBeInTheDocument();
    expect(screen.getByText('Pair')).toBeInTheDocument();
    expect(screen.getByText('Chow')).toBeInTheDocument();
    expect(screen.getByText('Pung')).toBeInTheDocument();
    expect(screen.getByText('Kong')).toBeInTheDocument();
  });

  test('memoized component renders consistently', () => {
    const { rerender } = renderWithRouter(<MahjongRules />);
    rerender(<MemoryRouter><MahjongRules /></MemoryRouter>);
    expect(screen.getByText('How to Play Mahjong')).toBeInTheDocument();
  });
});
