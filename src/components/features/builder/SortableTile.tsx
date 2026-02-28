import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TileDef } from '../../../lib/tiles';
import type { ComboGroup } from '../../../lib/comboDetector';
import './MahjongHand.css';
import '../../ui/Tile.css';

export interface SortableItemProps {
  id: string;
  tile: TileDef;
  index: number;
  onRemove: (index: number) => void;
  isValid: boolean;
  isInvalidTile?: boolean;
  comboGroup?: ComboGroup;
}

export default function SortableTile({ id, tile, index, onRemove, isValid, isInvalidTile, comboGroup }: SortableItemProps) {
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
