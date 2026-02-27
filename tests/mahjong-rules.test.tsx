import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MahjongRules from '../src/components/MahjongRules';

describe('MahjongRules Component', () => {
  test('renders all rule sections', () => {
    render(<MahjongRules />);
    
    expect(screen.getByText('How to Play Mahjong')).toBeInTheDocument();
    expect(screen.getByText('Objective')).toBeInTheDocument();
    expect(screen.getByText('Tiles')).toBeInTheDocument();
    expect(screen.getByText('Sets')).toBeInTheDocument();
    expect(screen.getByText('Gameplay')).toBeInTheDocument();
    expect(screen.getByText('Scoring')).toBeInTheDocument();
    expect(screen.getByText('Tips for Beginners')).toBeInTheDocument();
  });

  test('renders objective section content', () => {
    render(<MahjongRules />);
    
    const objectiveText = screen.getByText(
      'The objective of Mahjong is to be the first player to complete a legal hand of 14 tiles consisting of four sets and a pair.'
    );
    expect(objectiveText).toBeInTheDocument();
  });

  test('renders tiles section with proper list items', () => {
    render(<MahjongRules />);
    
    const tilesParagraph = screen.getByText(
      'A standard Mahjong set contains 144 tiles, divided into:'
    );
    expect(tilesParagraph).toBeInTheDocument();
    
    const suitsItem = screen.getByText('Suits:');
    expect(suitsItem).toBeInTheDocument();
    
    const honorsItem = screen.getByText('Honors:');
    expect(honorsItem).toBeInTheDocument();
    
    const flowersItem = screen.getByText('Flowers and Seasons:');
    expect(flowersItem).toBeInTheDocument();
  });

  test('renders sets section with proper list items', () => {
    render(<MahjongRules />);
    
    const setsParagraph = screen.getByText(
      'A complete hand consists of four sets and a pair:'
    );
    expect(setsParagraph).toBeInTheDocument();
    
    const pungItem = screen.getByText('Pung:');
    expect(pungItem).toBeInTheDocument();
    
    const chowItem = screen.getByText('Chow:');
    expect(chowItem).toBeInTheDocument();
    
    const kongItem = screen.getByText('Kong:');
    expect(kongItem).toBeInTheDocument();
    
    const pairItem = screen.getByText('Pair:');
    expect(pairItem).toBeInTheDocument();
  });

  test('renders gameplay section with ordered list', () => {
    render(<MahjongRules />);
    
    const gameplaySection = screen.getByText('Gameplay').closest('section');
    const gameplayItems = gameplaySection?.querySelectorAll('ol li');
    expect(gameplayItems).toHaveLength(6); // 6 items in gameplay ordered list
    
    const firstItem = screen.getByText('Each player starts with 13 tiles');
    expect(firstItem).toBeInTheDocument();
    
    const lastItem = screen.getByText('Call "Mahjong!" when you complete a legal hand');
    expect(lastItem).toBeInTheDocument();
  });

  test('renders scoring section content', () => {
    render(<MahjongRules />);
    
    const scoringParagraph = screen.getByText(
      'Scoring varies by regional variant, but typically awards points for:'
    );
    expect(scoringParagraph).toBeInTheDocument();
    
    const completingHandItem = screen.getByText('Completing the hand');
    expect(completingHandItem).toBeInTheDocument();
    
    const specialCombinationsItem = screen.getByText('Special combinations');
    expect(specialCombinationsItem).toBeInTheDocument();
  });

  test('renders tips section with beginner tips', () => {
    render(<MahjongRules />);
    
    const focusSuitTip = screen.getByText('Focus on one suit early in the game to build coherent sets');
    expect(focusSuitTip).toBeInTheDocument();
    
    const payAttentionTip = screen.getByText('Pay attention to what other players are discarding');
    expect(payAttentionTip).toBeInTheDocument();
    
    const versatileTilesTip = screen.getByText('Keep versatile tiles that could fit multiple potential sets');
    expect(versatileTilesTip).toBeInTheDocument();
  });

  test('renders semantic HTML structure', () => {
    render(<MahjongRules />);
    
    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('rules-container');
    
    const sectionElements = screen.getAllByTestId('rules-section');
    expect(sectionElements).toHaveLength(6); // 6 sections
  });

  test('memoized component renders consistently', () => {
    const { rerender } = render(<MahjongRules />);
    
    // Rerender with same props
    rerender(<MahjongRules />);
    
    expect(screen.getByText('How to Play Mahjong')).toBeInTheDocument();
  });
});