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
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(tile); }}
    >
      <img src={tile.image} alt={tile.name} className="glossary-tile-image" />
      <div className="glossary-info">
        <div className="glossary-tile-name">{tile.name}</div>
        <div className="glossary-tile-desc">{tile.suit}</div>
      </div>
    </div>
  );
}
