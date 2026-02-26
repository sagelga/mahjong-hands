import { useState, useMemo, useEffect } from 'react';
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

function AppContent() {
  const [selectedTiles, setSelectedTiles] = useState<TileDef[]>([]);
  const [activeFilter, setActiveFilter] = useState<Suit | 'All'>('All');
  const [comboGroups, setComboGroups] = useState<ComboGroup[]>([]);
  const [showComboSelector, setShowComboSelector] = useState(false);
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

  const addTile = (tile: TileDef) => {
    // Count current occurrences of this tile
    const currentCount = selectedTiles.filter(t => t.id === tile.id).length;

    // Check if adding this tile would exceed the limit of 4
    if (currentCount >= 4) {
      // Don't add the tile if we already have 4 of this type
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

    // Check if we have a new potential pair that wasn't there before
    const hasNewPair = updatedPotentialCombos.some(combo =>
      combo.comboType === 'pair' &&
      combo.tiles.length === 2 &&
      combo.tiles.every(t => t.id === tile.id)
    );

    // If we have a new pair, we should show the combo selector
    if (hasNewPair) {
      setShowComboSelector(true);
    }
  };

  const removeTile = (index: number) => {
    // Remove the tile from selected tiles
    const newTiles = [...selectedTiles];
    newTiles.splice(index, 1);
    setSelectedTiles(newTiles);

    // Update combo groups to reflect the removal
    const updatedComboGroups = comboGroups
      .map(group => ({
        ...group,
        indices: group.indices
          .filter(i => i < index) // Keep indices that are before the removed tile
          .concat( // Add indices that are after the removed tile (adjust for shift)
            group.indices
              .filter(i => i > index)
              .map(i => i - 1) // Shift indices after the removed tile
          )
      }))
      .filter(group => group.indices.length > 0); // Remove empty groups

    setComboGroups(updatedComboGroups);
  };

  const reorderTiles = (oldIndex: number, newIndex: number) => {
    setSelectedTiles((prev) => {
      if (oldIndex < 0 || newIndex < 0) return prev;
      const result = [...prev];
      const [removed] = result.splice(oldIndex, 1);
      result.splice(newIndex, 0, removed);
      return result;
    });

    // Update combo groups to reflect the reordering
    setComboGroups(prevGroups => {
      return prevGroups.map(group => {
        // Create a mapping of old indices to new indices
        let newIndices = [...group.indices];

        // Apply the same reorder transformation to the combo indices
        // If oldIndex comes before newIndex, shifting elements to the left
        if (oldIndex < newIndex) {
          newIndices = newIndices.map(idx => {
            if (idx === oldIndex) {
              return newIndex; // Move the item to the new position
            } else if (idx > oldIndex && idx <= newIndex) {
              return idx - 1; // Shift items in between one position left
            }
            return idx;
          });
        } else if (oldIndex > newIndex) {
          newIndices = newIndices.map(idx => {
            if (idx === oldIndex) {
              return newIndex; // Move the item to the new position
            } else if (idx >= newIndex && idx < oldIndex) {
              return idx + 1; // Shift items in between one position right
            }
            return idx;
          });
        }
        // If oldIndex === newIndex, no change needed

        // Sort the indices to maintain order within the combo
        newIndices.sort((a, b) => a - b);

        return {
          ...group,
          indices: newIndices
        };
      });
    });
  };

  const clearHand = () => {
    if (confirm('Are you sure you want to clear your hand?')) {
      setSelectedTiles([]);
      setComboGroups([]);
      // setShowComboSelector will be updated by the effect when potentialCombos changes
    }
  };

  const handleComboSelect = (comboIndex: number, formation: ComboFormation, targetComboType?: 'pair' | 'pung' | 'kong') => {
    const selectedCombo = potentialCombos[comboIndex];
    if (!selectedCombo) return;

    // Determine the actual combo type to use
    const actualComboType = targetComboType || selectedCombo.comboType;

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

    // Create the combo group with the target combo type
    // If we're upgrading, we need to create the correct number of tiles for the combo
    let comboTiles = selectedCombo.tiles;
    if (actualComboType === 'pung' && selectedCombo.comboType === 'pair') {
      // If we're upgrading from pair to pung, we need to add one more tile
      comboTiles = [...selectedCombo.tiles, tileToAdd];
    } else if (actualComboType === 'kong') {
      // If we're making a kong, we need 4 tiles of the same type
      if (selectedCombo.comboType === 'pair') {
        // Upgrading from pair to kong requires 2 more tiles
        comboTiles = [...selectedCombo.tiles, tileToAdd, tileToAdd];
      } else if (selectedCombo.comboType === 'pung') {
        // Upgrading from pung to kong requires 1 more tile
        comboTiles = [...selectedCombo.tiles, tileToAdd];
      }
    }

    // Calculate the correct indices for the combo based on the current state
    // After tiles have been added, we need to account for the new positions
    let comboIndices: number[];
    if (actualComboType === 'pung' && selectedCombo.comboType === 'pair') {
      // For upgrading pair to pung, use the original indices and add the new index
      // The new tile will be added at the end of the current selectedTiles array
      // So the new index will be the current length of the array minus 1 (since we just added one tile)
      comboIndices = [...selectedCombo.indices, selectedTiles.length];
    } else if (actualComboType === 'kong' && selectedCombo.comboType === 'pair') {
      // For upgrading pair to kong, use the original indices and add 2 new indices
      // The new tiles will be added at the end of the current selectedTiles array
      const firstNewIndex = selectedTiles.length;
      const secondNewIndex = selectedTiles.length + 1;
      comboIndices = [...selectedCombo.indices, firstNewIndex, secondNewIndex];
    } else if (actualComboType === 'kong' && selectedCombo.comboType === 'pung') {
      // For upgrading pung to kong, use the original indices and add 1 new index
      comboIndices = [...selectedCombo.indices, selectedTiles.length];
    } else {
      // For regular selection (no upgrade), use the original indices
      comboIndices = [...selectedCombo.indices];
    }

    const newComboGroup: ComboGroup = {
      tiles: comboTiles,
      comboType: actualComboType,
      formation,
      indices: comboIndices
    };

    setComboGroups(prev => [...prev, newComboGroup]);

    // The selector will be updated by the effect when potentialCombos changes
  };

  const cancelComboSelection = () => {
    setShowComboSelector(false);
  };

  const location = useLocation();

  return (
    <>
      {location.pathname === '/' ? (
        <>
          <Header />

          <section className="section-full-width">
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
        </Routes>
      </Layout>
    </Router>
  );
}
