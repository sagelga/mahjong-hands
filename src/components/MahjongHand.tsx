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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToHorizontalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import type { TileDef } from '../lib/tiles';
import type { ComboGroup } from '../lib/comboDetector';

import './MahjongHand.css';
import './Tile.css';

interface SortableItemProps {

  id: string;
  tile: TileDef;
  index: number;
  onRemove: (index: number) => void;
  isValid: boolean;
  isInvalidTile?: boolean;
  comboGroup?: ComboGroup;
}

function SortableTile({ id, tile, index, onRemove, isValid, isInvalidTile, comboGroup }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 200 : 1,
    opacity: isDragging ? 0.6 : 1,
    cursor: isDragging ? 'grabbing' : 'pointer',
    touchAction: 'none',
  };

  // Determine if this tile is part of a combo and what type
  const isPartOfCombo = !!comboGroup;
  const comboType = comboGroup?.formation;
  const comboIndices = comboGroup?.indices || [];
  const isFirstInCombo = comboIndices.length > 0 && comboIndices[0] === index;
  const isLastInCombo = comboIndices.length > 0 && comboIndices[comboIndices.length - 1] === index;

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={`tile-wrapper ${isDragging ? 'dragging' : ''} ${isPartOfCombo ? `combo-tile combo-${comboType}` : ''} ${isFirstInCombo ? 'combo-first' : ''} ${isLastInCombo ? 'combo-last' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div
        className={`tile-inner ${tile.suit === 'Flowers' ? 'flowers' : ''} ${isInvalidTile ? 'invalid' : ''} ${isValid ? 'valid' : 'default'} ${isPartOfCombo ? `combo-${comboType}` : ''}`}
      >
        <img
          src={tile.image}
          alt={tile.name}
          className="tile-image"
        />
        {tile.suit === 'Flowers' && (
          <span className="tile-flower-indicator">🌸</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className="tile-remove-button"
        >
          ×
        </button>
      </div>
    </div>
  );
}

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
  const flowerTilesCount = flowerTiles.length;

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
    // Add all tiles in this combo to the processed set
    comboGroup.indices.forEach(index => processedIndices.add(index));

    // Render the entire combo as a group
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

    // Add the combo container with tiles and label
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
      <div className="hand-header">
        <h2 className="hand-title">Your Hand</h2>
        <div className="hand-info">
          <span className={`hand-main-info ${isValid ? 'valid' : ''}`}>
            Main: {mainHandCount}/14
          </span>
          <button
            onClick={onClearHand}
            className="clear-button"
            title="Clear hand"
          >
            🗑️
          </button>
        </div>
      </div>

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

        {flowerTilesCount > 0 && (
          <div className="hand-flowers-area">
            <div className="flower-area-label">Flowers</div>
            <div className="flower-tiles-row">
              {flowerTiles.map(({ tile, index }) => (
                <SortableTile
                  key={`tile-${index}-${tile.id}`}
                  id={`tile-${index}-${tile.id}`}
                  tile={tile}
                  index={index}
                  onRemove={onRemoveTile}
                  isValid={isValid}
                  isInvalidTile={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
