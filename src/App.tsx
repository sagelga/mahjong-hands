import { useState, useMemo, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import type { TileDef, Suit } from './lib/tiles';
import { validateHand } from './lib/validator';
import { detectPotentialCombos, type ComboGroup, type ComboFormation } from './lib/comboDetector';
import MahjongHand from './components/MahjongHand';
import TileKeyboard from './components/TileKeyboard';
import ComboSelector from './components/ComboSelector';
import MahjongRules from './components/MahjongRules';
import Layout from './components/Layout';
import Header from './components/Header';
import ValidationMessage from './components/ValidationMessage';
import Separator from './components/Separator';
import TileGlossary from './components/TileGlossary';
import About from './components/About';
import ScoringGuide from './components/ScoringGuide';
import StrategyGuide from './components/StrategyGuide';
import NotFound from './components/NotFound';
import { useComboGroups } from './hooks/useComboGroups';

function AppContent() {
  const [selectedTiles, setSelectedTiles] = useState<TileDef[]>([]);
  const [activeFilter, setActiveFilter] = useState<Suit | 'All'>('All');
  const [comboGroups, setComboGroups] = useState<ComboGroup[]>([]);
  const [showComboSelector, setShowComboSelector] = useState(false);

  const {
    updateComboGroupsAfterRemoval,
    updateComboGroupsAfterReorder,
    calculateComboFormation
  } = useComboGroups();

  const validation = useMemo(() => validateHand(selectedTiles), [selectedTiles, comboGroups]);

  // Calculate potential combos using useMemo to avoid unnecessary recalculations
  const potentialCombos = useMemo(() => {
    const detectedCombos = detectPotentialCombos(selectedTiles);
    // Only show potential combos that aren't already formed into groups
    return detectedCombos.filter(combo => {
      // Check if any of the tiles in this combo are already part of a group
      return !combo.indices.some(index =>
        comboGroups.some(group => group.indices.includes(index))
      );
    });
  }, [selectedTiles, comboGroups]);


  useEffect(() => {
    if (validation.isValid) {
      document.body.classList.add('is-winning');
    } else {
      document.body.classList.remove('is-winning');
    }
  }, [validation.isValid]);

  const location = useLocation();

  useEffect(() => {
    const pageTitleMap: Record<string, string> = {
      '/': 'Mahjong Hand Builder - Validate Your Winning Hands',
      '/rules': 'Mahjong Rules - How to Play & Win',
      '/glossary': 'Mahjong Tile Glossary - Visual Guide to All Tiles',
      '/scoring': 'Mahjong Scoring Guide - Fan System & Hand Values',
      '/strategy': 'Mahjong Strategy Guide - Tips, Waits & Mastery',
      '/about': 'About Mahjong Hand Builder - Our Mission',
    };
    document.title = pageTitleMap[location.pathname] || 'Mahjong Hand Builder';
  }, [location.pathname]);

  const addTile = useCallback((tile: TileDef) => {
    // Count current occurrences of this tile
    const currentCount = selectedTiles.filter(t => t.id === tile.id).length;

    // Flowers have a limit of 1, other tiles have a limit of 4
    const maxLimit = tile.id.startsWith('f') ? 1 : 4;

    // Check if adding this tile would exceed the limit
    if (currentCount >= maxLimit) {
      // Don't add the tile if we already have the maximum allowed
      return;
    }

    // Add the tile to selected tiles
    const newSelectedTiles = [...selectedTiles, tile];
    setSelectedTiles(newSelectedTiles);

    // Check if this addition creates a pair (2 identical tiles)
    // If so, we'll show the combo selector for pair/pung/kong options
    const updatedPotentialCombos = detectPotentialCombos(newSelectedTiles).filter(combo => {
      // Check if any of the tiles in this combo are already part of a group
      return !combo.indices.some(index =>
        comboGroups.some(group => group.indices.includes(index))
      );
    });

    // Check if the newly added tile completes or is part of any potential combo
    const newTileIndex = newSelectedTiles.length - 1;
    const hasNewlyFormedCombo = updatedPotentialCombos.some(combo =>
      combo.indices.includes(newTileIndex)
    );

    // If we have a newly formed combo involving the added tile, show the combo selector
    if (hasNewlyFormedCombo) {
      setShowComboSelector(true);
    }
  }, [selectedTiles, comboGroups]);

  const removeTile = useCallback((index: number) => {
    // Remove the tile from selected tiles
    const newTiles = [...selectedTiles];
    newTiles.splice(index, 1);
    setSelectedTiles(newTiles);

    // Update combo groups to reflect the removal
    const updatedComboGroups = updateComboGroupsAfterRemoval(comboGroups, index);
    setComboGroups(updatedComboGroups);
  }, [comboGroups, selectedTiles, updateComboGroupsAfterRemoval]);

  const reorderTiles = useCallback((oldIndex: number, newIndex: number) => {
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    setSelectedTiles((prev) => {
      const result = [...prev];
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });

    // Update combo groups to reflect the reordering
    setComboGroups(prevGroups => {
      return updateComboGroupsAfterReorder(prevGroups, oldIndex, newIndex);
    });
  }, [updateComboGroupsAfterReorder]);

  const clearHand = useCallback(() => {
    setSelectedTiles([]);
    setComboGroups([]);
  }, []);

  const handleComboSelect = useCallback((comboIndex: number, formation: ComboFormation, targetComboType?: 'pair' | 'pung' | 'kong' | 'chow' | 'upgrade') => {
    const selectedCombo = potentialCombos[comboIndex];
    if (!selectedCombo) return;

    // Determine the actual combo type to use - only upgrade if targetComboType is provided
    const actualComboType = targetComboType || (selectedCombo.comboType === 'chow' || selectedCombo.comboType === 'upgrade' ? selectedCombo.comboType : selectedCombo.comboType);

    // Only process if actualComboType is a type that can be upgraded (pair or pung)
    if (actualComboType !== 'pair' && actualComboType !== 'pung' && actualComboType !== 'kong') {
      // For chow or other non-upgradable combos, just create the group directly
      const newComboGroup: ComboGroup = {
        tiles: selectedCombo.tiles,
        comboType: selectedCombo.comboType as 'pair' | 'pung' | 'kong' | 'chow' | 'upgrade',
        formation,
        indices: selectedCombo.indices
      };

      setComboGroups(prev => [...prev, newComboGroup]);
      return;
    }

    // Calculate how many additional tiles we need
    let additionalTilesNeeded = 0;
    if (actualComboType === 'pung' && selectedCombo.comboType === 'pair') {
      additionalTilesNeeded = 1; // Need 1 more tile to go from pair to pung
    } else if (actualComboType === 'kong' && selectedCombo.comboType === 'pair') {
      additionalTilesNeeded = 2; // Need 2 more tiles to go from pair to kong
    } else if (actualComboType === 'kong' && selectedCombo.comboType === 'pung') {
      additionalTilesNeeded = 1; // Need 1 more tile to go from pung to kong
    }

    // Get the tile to add (the same type as the existing tiles in the combo)
    const tileToAdd = selectedCombo.tiles[0];

    // Add the additional tiles to the selected tiles first
    if (additionalTilesNeeded > 0) {
      const additionalTiles = Array(additionalTilesNeeded).fill(tileToAdd);
      setSelectedTiles(prev => [...prev, ...additionalTiles]);
    }

    // Calculate the combo formation (tiles and indices)
    const { comboTiles, comboIndices } = calculateComboFormation(
      selectedCombo,
      actualComboType,
      selectedTiles.length
    );

    const newComboGroup: ComboGroup = {
      tiles: comboTiles,
      comboType: actualComboType,
      formation,
      indices: comboIndices
    };

    setComboGroups(prev => [...prev, newComboGroup]);

    // The selector will be updated by the effect when potentialCombos changes
  }, [potentialCombos, selectedTiles.length, calculateComboFormation]);

  const cancelComboSelection = useCallback(() => {
    setShowComboSelector(false);
  }, []);

  return (
    <>
      {location.pathname === '/' ? (
        <>
          <Header />

          <section className="section-full-width">
            <div className="settings-bar">
              <a href="/rules" className="toggle-btn" title="View Mahjong Rules">
                Learn Rules
              </a>
            </div>

            <MahjongHand
              tiles={selectedTiles}
              onRemoveTile={removeTile}
              onReorderTiles={reorderTiles}
              isValid={validation.isValid}
              invalidTiles={validation.invalidTiles}
              onClearHand={clearHand}
              comboGroups={comboGroups}
            />

            <ValidationMessage isValid={validation.isValid} reason={validation.reason} />

            <Separator />

            <TileKeyboard
              onTileClick={addTile}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              currentTiles={selectedTiles}
            />

            {showComboSelector && potentialCombos.length > 0 && (
              <ComboSelector
                potentialCombos={potentialCombos}
                onComboSelect={handleComboSelect}
                onCancel={cancelComboSelection}
              />
            )}
          </section>
        </>
      ) : (
        <MahjongRules />
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/rules" element={<MahjongRules />} />
          <Route path="/glossary" element={<TileGlossary />} />
          <Route path="/scoring" element={<ScoringGuide />} />
          <Route path="/strategy" element={<StrategyGuide />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}
