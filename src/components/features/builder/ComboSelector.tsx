import { useMemo, useCallback, memo } from 'react';
import type React from 'react';
import './ComboSelector.css';
import '../../ui/Tooltip.css';

import type { TileDef } from '../../../lib/tiles';
import type { PotentialCombo, ComboFormation } from '../../../lib/comboDetector';
import { useTooltip } from '../../../hooks/useTooltip';

type TargetComboType = 'pair' | 'pung' | 'kong' | 'chow' | 'upgrade';

interface Props {
  potentialCombos: PotentialCombo[];
  onComboSelect: (comboIndex: number, formation: ComboFormation, targetComboType?: TargetComboType) => void;
  onCancel: () => void;
}

interface NormalizedCombo {
  id: string;
  originalIndex: number;
  type: TargetComboType;
  label: string;
  tiles: TileDef[];
  targetComboType?: TargetComboType;
}

// 1. Extract static data outside component lifecycle
const TOOLTIP_DATA: Record<string, { title: string; description: string; tilesCount: number; scoringInfo: string }> = {
  pair: {
    title: 'Pair',
    description: 'Two identical tiles that form the "eye" (or head), an essential component to complete a standard winning hand.',
    tilesCount: 2,
    scoringInfo: 'Essential for all winning hands. Generally scores lower than sequences and triplets.',
  },
  chow: {
    title: 'Chow',
    description: 'A numerical sequence of three consecutive tiles from the same suit (e.g., 2-3-4 of Bamboo).',
    tilesCount: 3,
    scoringInfo: 'Usually scores less than pungs. In most rulesets, a discarded tile can only be claimed for a chow from the player to your immediate left.',
  },
  pung: {
    title: 'Pung',
    description: 'A triplet of three identical tiles. This can be formed using any suited tiles, winds, or dragons.',
    tilesCount: 3,
    scoringInfo: 'Scores higher than chows. Melded pungs score less than concealed pungs.',
  },
  kong: {
    title: 'Kong',
    description: 'A quadruplet of four identical tiles. While it contains four tiles, it counts as a single triplet for hand completion and grants an extra tile draw.',
    tilesCount: 4,
    scoringInfo: 'Highest scoring meld. A kong can be formed by adding a fourth tile to an existing pung.',
  }
};

const DEFAULT_TOOLTIP = {
  title: 'Unknown',
  description: 'Invalid or unrecognized tile combination.',
  tilesCount: 0,
  scoringInfo: ''
};

// 2. Memoized purely presentational Tooltip content
const TooltipContent = memo(function TooltipContent({ type }: { type: string }) {
  const data = TOOLTIP_DATA[type] || DEFAULT_TOOLTIP;

  return (
    <div className="tooltip-content">
      <div className="tooltip-definition">{data.title}</div>
      <div className="tooltip-description">{data.description}</div>
      <div className="tooltip-tiles">
        {Array.from({ length: data.tilesCount }).map((_, i) => (
          <div key={i} className="tooltip-tile" style={{ backgroundColor: '#ccc' }} />
        ))}
      </div>
      <div className="tooltip-scoring">{data.scoringInfo}</div>
    </div>
  );
});

interface ComboItemProps {
  combo: NormalizedCombo;
  onSelect: (index: number, formation: ComboFormation, targetType?: TargetComboType) => void;
  showTooltip: (e: React.MouseEvent<HTMLDivElement>, content: React.ReactElement) => void;
  hideTooltip: () => void;
  clearHideTimeout: () => void;
}

// 3. Extracted List Item for individual memoization
const ComboItem = memo(function ComboItem({
  combo,
  onSelect,
  showTooltip,
  hideTooltip,
  clearHideTimeout
}: ComboItemProps) {
  const { originalIndex, type, label, tiles, targetComboType } = combo;

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    showTooltip(e, <TooltipContent type={type} />);
  }, [showTooltip, type]);

  const onConcealedClick = useCallback(() => {
    onSelect(originalIndex, 'concealed', targetComboType);
  }, [onSelect, originalIndex, targetComboType]);

  const onMeldedClick = useCallback(() => {
    onSelect(originalIndex, 'melded', targetComboType);
  },[onSelect, originalIndex, targetComboType]);

  return (
    <div
      className="potential-combo-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={hideTooltip}
      onMouseMove={clearHideTimeout}
    >
      <div className="combo-type">{label}</div>

      <div className="combo-tiles">
        {tiles.map((tile, tileIndex) => (
          <img
            key={tileIndex}
            src={tile.image}
            alt={tile.name}
            className="combo-tile-image"
          />
        ))}
      </div>

      <div className="combo-options">
        <button className="combo-option-btn concealed" onClick={onConcealedClick}>
          <div className="main-label">Concealed</div>
          <div className="sub-label">(self-drawn)</div>
        </button>
        <button className="combo-option-btn melded" onClick={onMeldedClick}>
          <div className="main-label">Melded</div>
          <div className="sub-label">(from discard)</div>
        </button>
      </div>
    </div>
  );
});

export default function ComboSelector({ potentialCombos, onComboSelect, onCancel }: Props) {
  // We only ever need a single tooltip for the mouse position
  const tooltip = useTooltip();

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  },[]);

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  }, [onCancel]);

  // 4. Flatten the Data to reduce deep JSX branching loops below
  const normalizedCombos = useMemo<NormalizedCombo[]>(() => {
    const result: NormalizedCombo[] = [];

    potentialCombos.forEach((combo, index) => {
      const { comboType, tiles } = combo;

      // Handle Upgradeable logic automatically without duplication
      if (comboType === 'pair' || comboType === 'pung') {
        const baseTile = tiles[0];
        const types: TargetComboType[] = comboType === 'pair'
          ? ['pair', 'pung', 'kong']
          : ['pung', 'kong'];

        types.forEach(type => {
          const tileCount = type === 'pair' ? 2 : type === 'pung' ? 3 : 4;
          result.push({
            id: `${index}-${type}`,
            originalIndex: index,
            type,
            label: type.charAt(0).toUpperCase() + type.slice(1),
            tiles: Array(tileCount).fill(baseTile),
            targetComboType: type
          });
        });
      } else {
        // Handle standard Non-Upgradeable items normally
        result.push({
          id: `${index}-${comboType}`,
          originalIndex: index,
          type: comboType as TargetComboType,
          label: comboType.charAt(0).toUpperCase() + comboType.slice(1),
          tiles,
          targetComboType: undefined
        });
      }
    });

    return result;
  }, [potentialCombos]);

  if (potentialCombos.length === 0) {
    return null;
  }

  return (
    <div className="combo-selector-overlay" onClick={onCancel}>
      <div className="combo-selector-modal" onClick={handleModalClick}>
        <div className="modal-header">
          <h3>Select Formation</h3>
          <button
            className="close-button"
            onClick={handleCloseClick}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <p>Select the formation you want to use:</p>

        <div className="potential-combos-list">
          {normalizedCombos.map((combo) => (
            <ComboItem
              key={combo.id}
              combo={combo}
              onSelect={onComboSelect}
              showTooltip={tooltip.showTooltip}
              hideTooltip={tooltip.hideTooltip}
              clearHideTimeout={tooltip.clearHideTimeout}
            />
          ))}
        </div>
      </div>

      {tooltip.show && (
        <div
          className={`tooltip ${tooltip.position.placement}`}
          style={{
            top: `${tooltip.position.top}px`,
            left: `${tooltip.position.left}px`
          }}
        >
          {tooltip.content}
          <div className={`tooltip-arrow ${tooltip.position.placement}`} />
        </div>
      )}
    </div>
  );
}
