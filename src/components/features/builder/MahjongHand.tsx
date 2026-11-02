import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import type { TileDef } from '../../../lib/tiles';
import type { ComboGroup } from '../../../lib/comboDetector';

import './MahjongHand.css';
import '../../ui/Tile.css';
import SortableTile from './SortableTile';
import HandHeader from './HandHeader';
import FlowerTilesArea from './FlowerTilesArea';

interface Props {
  tiles: TileDef[];
  onRemoveTile: (index: number) => void;
  onReorderTiles: (oldIndex: number, newIndex: number) => void;
  isValid: boolean;
  invalidTiles?: string[];
  onClearHand: () => void;
  comboGroups?: ComboGroup[];
}

const HAND_SIZE = 14;

export default function MahjongHand({ tiles, onRemoveTile, onReorderTiles, isValid, invalidTiles = [], onClearHand, comboGroups = [] }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create a map for faster lookup of tile indices
  const tileIdToIndexMap = useMemo(() => {
    const map = new Map<string | number, number>();
    tiles.forEach((tile, index) => {
      map.set(`tile-${index}-${tile.id}`, index);
    });
    return map;
  }, [tiles]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tileIdToIndexMap.get(active.id);
      const newIndex = tileIdToIndexMap.get(over.id);
      if (oldIndex !== undefined && newIndex !== undefined) {
        onReorderTiles(oldIndex, newIndex);
      }
    }
  }

  // Separate flower tiles from main tiles for layout
  const { flowerTiles, mainTiles } = useMemo(() => {
    const flowers = tiles
      .map((tile, index) => ({ tile, index }))
      .filter(item => item.tile.suit === 'Flowers');
    const main = tiles
      .map((tile, index) => ({ tile, index }))
      .filter(item => item.tile.suit !== 'Flowers');
    return { flowerTiles: flowers, mainTiles: main };
  }, [tiles]);

  const mainHandCount = mainTiles.length;
  const remainingTiles = Math.max(0, HAND_SIZE - mainHandCount);
  const isWinningHand = isValid && mainHandCount === HAND_SIZE;

  let hintText: string;
  if (mainHandCount === 0) {
    hintText = 'Pick a tile from the tray to start.';
  } else if (mainHandCount < HAND_SIZE) {
    hintText = `${remainingTiles} ${remainingTiles === 1 ? 'tile' : 'tiles'} to complete.`;
  } else if (isWinningHand) {
    hintText = 'Winning hand.';
  } else {
    hintText = '14 tiles · check the shape.';
  }

  let stateText: string;
  if (mainHandCount < HAND_SIZE) {
    stateText = `${remainingTiles} ${remainingTiles === 1 ? 'tile' : 'tiles'} to complete`;
  } else if (isWinningHand) {
    stateText = 'Winning hand';
  } else {
    stateText = 'Check the shape';
  }

  const rackState = isWinningHand ? 'win' : mainHandCount === HAND_SIZE ? 'check' : 'idle';

  // Pre-compute combo membership for better performance
  const comboMembership = useMemo(() => {
    const map = new Map<number, ComboGroup>();
    comboGroups.forEach(comboGroup => {
      comboGroup.indices.forEach(index => {
        map.set(index, comboGroup);
      });
    });
    return map;
  }, [comboGroups]);

  // Group tiles by their combo groups to render them in containers
  const elements = [];
  const processedIndices = new Set<number>();

  // First, process all combo groups
  for (const comboGroup of comboGroups) {
    comboGroup.indices.forEach(index => processedIndices.add(index));

    const comboTileElements = comboGroup.indices.map((globalIndex) => {
      const tile = tiles[globalIndex];
      const isInvalidTile = invalidTiles.includes(tile.id);

      return (
        <SortableTile
          key={`tile-${globalIndex}-${tile.id}`}
          id={`tile-${globalIndex}-${tile.id}`}
          tile={tile}
          index={globalIndex}
          onRemove={onRemoveTile}
          isValid={isValid}
          isInvalidTile={isInvalidTile}
          comboGroup={comboGroup}
        />
      );
    });

    elements.push(
      <div
        key={`combo-${comboGroup.indices.join('-')}`}
        className={`combo-container ${comboGroup.comboType} ${comboGroup.formation}`}
        style={{ gridColumn: `span ${Math.max(comboGroup.indices.length, 1)}` }}
      >
        <div className="combo-tiles-row">
          {comboTileElements}
        </div>
        <div className="combo-label">
          {comboGroup.comboType.toUpperCase()} - {comboGroup.formation.toUpperCase()}
        </div>
      </div>
    );
  }

  // Then, render any remaining main tiles that are not in combos
  mainTiles.forEach(({ tile, index }) => {
    if (!processedIndices.has(index)) {
      const tileComboGroupForThisTile = comboMembership.get(index);
      const isInvalidTile = invalidTiles.includes(tile.id);

      elements.push(
        <SortableTile
          key={`tile-${index}-${tile.id}`}
          id={`tile-${index}-${tile.id}`}
          tile={tile}
          index={index}
          onRemove={onRemoveTile}
          isValid={isValid}
          isInvalidTile={isInvalidTile}
          comboGroup={tileComboGroupForThisTile}
        />
      );
    }
  });

  return (
    <div className="keyboard-container">
      <div
        className={`hand-container-wrapper ${isValid ? 'valid' : ''}`}
        data-testid="hand-container"
      >
        <HandHeader mainHandCount={mainHandCount} isValid={isValid} onClearHand={onClearHand} />

        <div className="hand-rack" role="group" aria-label="Hand rack, 14 slots">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
          >
            <SortableContext
              items={tiles.map((_, idx) => `tile-${idx}-${tiles[idx].id}`)}
              strategy={horizontalListSortingStrategy}
            >
              {elements}
            </SortableContext>
          </DndContext>

          {/* Ghost slots keep the rack at 14 positions */}
          {Array.from({ length: remainingTiles }).map((_, i) => (
            <div
              key={`blank-${i}`}
              className="blank-tile-slot"
              aria-hidden="true"
            >
              +
            </div>
          ))}
        </div>

        <FlowerTilesArea flowerTiles={flowerTiles} onRemoveTile={onRemoveTile} isValid={isValid} />

        <div className="hand-rack-footer">
          <p className="hand-hint">{hintText}</p>
          <div className="hand-state" data-state={rackState} aria-live="polite">
            <span className="hand-state-dot" aria-hidden="true" />
            <span>{stateText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
