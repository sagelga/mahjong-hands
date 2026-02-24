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

  const style = {
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
      style={style}
      className={`tile-wrapper ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div
        className="tile-inner"
        style={{
          width: 'clamp(48px, 11vw, 64px)',
          height: 'clamp(64px, 14vw, 84px)',
          backgroundColor: tile.suit === 'Flowers' ? 'rgba(16, 185, 129, 0.1)' : (isInvalidTile ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-secondary)'),
          border: `2px solid ${tile.suit === 'Flowers' ? 'rgba(16, 185, 129, 0.4)' : (isInvalidTile ? 'var(--accent-danger)' : (isValid ? 'var(--accent-primary)' : 'var(--border-color)'))}`,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '2px',
          boxShadow: isDragging ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
          transition: 'border-color 0.2s',
        }}
      >
        <img
          src={tile.image}
          alt={tile.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none'
          }}
        />
        {tile.suit === 'Flowers' && (
          <span style={{
            position: 'absolute',
            top: 1,
            right: 2,
            fontSize: '10px'
          }}>🌸</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          style={{
            position: 'absolute',
            top: -6,
            right: -6,
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: 'var(--accent-danger)',
            color: 'white',
            border: 'none',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            zIndex: 10
          }}
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
}

export default function MahjongHand({ tiles, onRemoveTile, onReorderTiles, isValid, invalidTiles = [] }: Props) {
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
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        padding: '0 0.5rem'
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Your Hand</h2>
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8rem' }}>
          {flowerTilesCount > 0 && (
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>🌸 {flowerTilesCount}</span>
          )}
          <span style={{
            color: isValid ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 700
          }}>
            Main: {mainHandCount}/14
          </span>
        </div>
      </div>

      <div
        className="glass-panel hand-container"
        style={{
          padding: '0.75rem',
          width: '100%',
          minHeight: '100px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'clamp(6px, 1.5vw, 10px)',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'border-color var(--transition-normal)',
          border: isValid ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
        }}
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
            style={{
              width: 'clamp(48px, 11vw, 64px)',
              height: 'clamp(64px, 14vw, 84px)',
              backgroundColor: 'rgba(51, 65, 85, 0.05)',
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              opacity: 0.3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              color: 'var(--border-color)'
            }}
          >
            +
          </div>
        ))}
      </div>
    </div>
  );
}
