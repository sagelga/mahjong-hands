import type { PotentialCombo, ComboFormation } from '../lib/comboDetector';
import { useTooltip } from '../hooks/useTooltip';

interface Props {
  potentialCombos: PotentialCombo[];
  onComboSelect: (comboIndex: number, formation: ComboFormation, targetComboType?: 'pair' | 'pung' | 'kong') => void;
  onCancel: () => void;
}

export default function ComboSelector({ potentialCombos, onComboSelect, onCancel }: Props) {
  const concealedTooltip = useTooltip();
  const meldedTooltip = useTooltip();

  if (potentialCombos.length === 0) {
    return null;
  }

  // Function to render tooltip content based on combo type
  const renderTooltipContent = (type: string) => {
    let title, description, tilesCount, scoringInfo;

    switch(type) {
      case 'pair':
        title = 'Pair';
        description = 'Two identical tiles that form the "eye" (or head), an essential component to complete a standard winning hand.';
        tilesCount = 2;
        scoringInfo = 'Essential for all winning hands. Generally scores lower than sequences and triplets.';
        break;
      case 'chow':
        title = 'Chow';
        description = 'A numerical sequence of three consecutive tiles from the same suit (e.g., 2-3-4 of Bamboo).';
        tilesCount = 3;
        scoringInfo = 'Usually scores less than pungs. In most rulesets, a discarded tile can only be claimed for a chow from the player to your immediate left.';
        break;
      case 'pung':
        title = 'Pung';
        description = 'A triplet of three identical tiles. This can be formed using any suited tiles, winds, or dragons.';
        tilesCount = 3;
        scoringInfo = 'Scores higher than chows. Melded pungs score less than concealed pungs.';
        break;
      case 'kong':
        title = 'Kong';
        description = 'A quadruplet of four identical tiles. While it contains four tiles, it counts as a single triplet for hand completion and grants an extra tile draw.';
        tilesCount = 4;
        scoringInfo = 'Highest scoring meld. A kong can be formed by adding a fourth tile to an existing pung.';
        break;
      default:
        title = 'Unknown';
        description = 'Invalid or unrecognized tile combination.';
        tilesCount = 0;
        scoringInfo = '';
    }

    return (
      <div className="tooltip-content">
        <div className="tooltip-definition">{title}</div>
        <div className="tooltip-description">{description}</div>
        <div className="tooltip-tiles">
          {[...Array(tilesCount)].map((_, i) => (
            <div key={i} className="tooltip-tile" style={{ backgroundColor: '#ccc' }}></div>
          ))}
        </div>
        <div className="tooltip-scoring">{scoringInfo}</div>
      </div>
    );
  };

  // Unified display for all combo types
  return (
    <div className="combo-selector-overlay" onClick={onCancel}>
      <div className="combo-selector-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Formation</h3>
          <button
            className="close-button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p>Select the formation you want to use:</p>

        <div className="potential-combos-list">
          {potentialCombos.map((combo, index) => {
            // Check if this is an upgradeable combo (pair or pung)
            const isUpgradeable = combo.comboType === 'pair' || combo.comboType === 'pung';

            if (isUpgradeable) {
              // For upgradeable combos, show all possible upgrade options
              const baseTile = combo.tiles[0];
              const upgradeOptions = [];

              if (combo.comboType === 'pair') {
                // From pair, can form pair, pung, or kong
                upgradeOptions.push({
                  type: 'pair',
                  tiles: [baseTile, baseTile],
                  label: 'Pair',
                  description: 'Two identical tiles'
                });

                upgradeOptions.push({
                  type: 'pung',
                  tiles: [baseTile, baseTile, baseTile],
                  label: 'Pung',
                  description: 'Three identical tiles'
                });

                upgradeOptions.push({
                  type: 'kong',
                  tiles: [baseTile, baseTile, baseTile, baseTile],
                  label: 'Kong',
                  description: 'Four identical tiles'
                });
              } else if (combo.comboType === 'pung') {
                // From pung, can form pung or kong
                upgradeOptions.push({
                  type: 'pung',
                  tiles: [baseTile, baseTile, baseTile],
                  label: 'Pung',
                  description: 'Three identical tiles'
                });

                upgradeOptions.push({
                  type: 'kong',
                  tiles: [baseTile, baseTile, baseTile, baseTile],
                  label: 'Kong',
                  description: 'Four identical tiles'
                });
              }

              return upgradeOptions.map((option, optIndex) => (
                <div key={`${index}-${optIndex}`} className="potential-combo-item">
                  <div className="combo-tiles">
                    {option.tiles.map((tile, tileIndex) => (
                      <img
                        key={tileIndex}
                        src={tile.image}
                        alt={tile.name}
                        className="combo-tile-image"
                      />
                    ))}
                  </div>

                  <div className="combo-type">
                    {option.label}
                  </div>

                  <div className="combo-options">
                    <div
                      onMouseEnter={(e) => concealedTooltip.showTooltip(e, renderTooltipContent(option.type))}
                      onMouseLeave={concealedTooltip.hideTooltip}
                      onMouseMove={concealedTooltip.clearHideTimeout}
                    >
                      <button
                        className="combo-option-btn concealed"
                        onClick={() => onComboSelect(index, 'concealed', option.type as 'pair' | 'pung' | 'kong')}
                      >
                        <div className="main-label">Concealed</div>
                        <div className="sub-label">(self-drawn)</div>
                      </button>
                    </div>
                    <div
                      onMouseEnter={(e) => meldedTooltip.showTooltip(e, renderTooltipContent(option.type))}
                      onMouseLeave={meldedTooltip.hideTooltip}
                      onMouseMove={meldedTooltip.clearHideTimeout}
                    >
                      <button
                        className="combo-option-btn melded"
                        onClick={() => onComboSelect(index, 'melded', option.type as 'pair' | 'pung' | 'kong')}
                      >
                        <div className="main-label">Melded</div>
                        <div className="sub-label">(from discard)</div>
                      </button>
                    </div>
                  </div>
                </div>
              ));
            } else {
              // For non-upgradeable combos (like chows), use the original display
              return (
                <div key={index} className="potential-combo-item">
                  <div className="combo-tiles">
                    {combo.tiles.map((tile, tileIndex) => (
                      <img
                        key={tileIndex}
                        src={tile.image}
                        alt={tile.name}
                        className="combo-tile-image"
                      />
                    ))}
                  </div>

                  <div className="combo-type">
                    {combo.comboType === 'pair' ? 'Pair' : combo.comboType.charAt(0).toUpperCase() + combo.comboType.slice(1)}
                  </div>

                  <div className="combo-options">
                    <div
                      onMouseEnter={(e) => concealedTooltip.showTooltip(e, renderTooltipContent(combo.comboType))}
                      onMouseLeave={concealedTooltip.hideTooltip}
                      onMouseMove={concealedTooltip.clearHideTimeout}
                    >
                      <button
                        className="combo-option-btn concealed"
                        onClick={() => onComboSelect(index, 'concealed')}
                      >
                        <div className="main-label">Concealed</div>
                        <div className="sub-label">(self-drawn)</div>
                      </button>
                    </div>
                    <div
                      onMouseEnter={(e) => meldedTooltip.showTooltip(e, renderTooltipContent(combo.comboType))}
                      onMouseLeave={meldedTooltip.hideTooltip}
                      onMouseMove={meldedTooltip.clearHideTimeout}
                    >
                      <button
                        className="combo-option-btn melded"
                        onClick={() => onComboSelect(index, 'melded')}
                      >
                        <div className="main-label">Melded</div>
                        <div className="sub-label">(from discard)</div>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Render tooltips */}
      {concealedTooltip.show && (
        <div
          className={`tooltip ${concealedTooltip.position.placement}`}
          style={{
            top: `${concealedTooltip.position.top}px`,
            left: `${concealedTooltip.position.left}px`
          }}
        >
          {concealedTooltip.content}
          <div className={`tooltip-arrow ${concealedTooltip.position.placement}`}></div>
        </div>
      )}

      {meldedTooltip.show && (
        <div
          className={`tooltip ${meldedTooltip.position.placement}`}
          style={{
            top: `${meldedTooltip.position.top}px`,
            left: `${meldedTooltip.position.left}px`
          }}
        >
          {meldedTooltip.content}
          <div className={`tooltip-arrow ${meldedTooltip.position.placement}`}></div>
        </div>
      )}
    </div>
  );
}
