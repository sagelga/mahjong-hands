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
  const tileIdToIndexMap = new Map<string | number, number>();
  tiles.forEach((tile, index) => {
    tileIdToIndexMap.set(`tile-${index}-${tile.id}`, index);
  });

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
  const flowerTiles = tiles
    .map((tile, index) => ({ tile, index }))
    .filter(item => item.tile.suit === 'Flowers');

  const mainTiles = tiles
    .map((tile, index) => ({ tile, index }))
    .filter(item => item.tile.suit !== 'Flowers');

  const mainHandCount = mainTiles.length;

  // Pre-compute combo membership for better performance
  const comboMembership = new Map<number, ComboGroup>();
  comboGroups.forEach(comboGroup => {
    comboGroup.indices.forEach(index => {
      comboMembership.set(index, comboGroup);
    });
  });

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
      <HandHeader mainHandCount={mainHandCount} isValid={isValid} onClearHand={onClearHand} />

      <div
        className={`glass-panel hand-container-wrapper ${isValid ? 'valid' : ''}`}
        data-testid="hand-container"
      >
        <div className="hand-main-grid">
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

          {/* Ghost slots to show 14 intended tiles */}
          {mainHandCount < 14 && Array.from({ length: 14 - mainHandCount }).map((_, i) => (
            <div
              key={`blank-${i}`}
              className="blank-tile-slot"
            >
              +
            </div>
          ))}
        </div>

        <FlowerTilesArea flowerTiles={flowerTiles} onRemoveTile={onRemoveTile} isValid={isValid} />
      </div>
    </div>
  );
}
