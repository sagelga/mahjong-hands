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

interface SortableItemProps {
  id: string;
  tile: TileDef;
  index: number;
  onRemove: (index: number) => void;
  isValid: boolean;
  isInvalidTile?: boolean;
}

function SortableTile({ id, tile, index, onRemove, isValid, isInvalidTile }: SortableItemProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={dragStyle}
      className={`tile-wrapper ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div
        className={`tile-inner ${tile.suit === 'Flowers' ? 'flowers' : ''} ${isInvalidTile ? 'invalid' : ''} ${isValid ? 'valid' : 'default'}`}
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
}

export default function MahjongHand({ tiles, onRemoveTile, onReorderTiles, isValid, invalidTiles = [], onClearHand }: Props) {
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tiles.findIndex((_, idx) => `tile-${idx}-${tiles[idx].id}` === active.id);
      const newIndex = tiles.findIndex((_, idx) => `tile-${idx}-${tiles[idx].id}` === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderTiles(oldIndex, newIndex);
      }
    }
  }

  const flowerTilesCount = tiles.filter(t => t.suit === 'Flowers').length;
  const mainHandCount = tiles.length - flowerTilesCount;

  return (
    <div className="keyboard-container">
      <div className="hand-header">
        <h2 className="hand-title">Your Hand</h2>
        <div className="hand-info">
          {flowerTilesCount > 0 && (
            <span className="hand-flower-info">🌸 {flowerTilesCount}</span>
          )}
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
        className={`glass-panel hand-container ${isValid ? 'valid' : ''}`}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis, restrictToWindowEdges]}
        >
          <SortableContext
            items={tiles.map((t, idx) => `tile-${idx}-${t.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            {tiles.map((tile, index) => {
              const isInvalidTile = invalidTiles.includes(tile.id);
              return (
                <SortableTile
                  key={`tile-${index}-${tile.id}`}
                  id={`tile-${index}-${tile.id}`}
                  tile={tile}
                  index={index}
                  onRemove={onRemoveTile}
                  isValid={isValid}
                  isInvalidTile={isInvalidTile}
                />
              );
            })}
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
    </div>
  );
}
