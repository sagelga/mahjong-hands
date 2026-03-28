import type { TileDef } from '../../../lib/tiles';
import './TileGlossary.css';

interface Props {
  tile: TileDef;
  isSelected: boolean;
  onSelect: (tile: TileDef | null) => void;
}

export default function GlossaryTileCard({ tile, isSelected, onSelect }: Props) {
  return (
    <div
      className={`glossary-item${isSelected ? ' glossary-item--active' : ''}`}
      onClick={() => onSelect(isSelected ? null : tile)}
      role="button"
      tabIndex={0}
      aria-label={`${tile.name}, ${tile.suit}`}
      aria-pressed={isSelected}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(tile); }}
    >
      <img src={tile.image} alt="" aria-hidden="true" className="glossary-tile-image" width="60" height="84" />
      <div className="glossary-info" aria-hidden="true">
        <div className="glossary-tile-name">{tile.name}</div>
        <div className="glossary-tile-desc">{tile.suit}</div>
      </div>
    </div>
  );
}
