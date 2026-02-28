import { useState } from 'react';
import { MAHJONG_TILES, SUITS } from '../../../lib/tiles';
import type { TileDef } from '../../../lib/tiles';
import './TileGlossary.css';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import GlossaryTileCard from './GlossaryTileCard';
import SuitsInfoPanel from './SuitsInfoPanel';
import TileDrawer from './TileDrawer';

export default function TileGlossary() {
  const [selectedTile, setSelectedTile] = useState<TileDef | null>(null);

  return (
    <PageContent className="glossary-container">
      <PageHeader
        title="Mahjong Tile Glossary"
        subtitle={
          <>
            A complete visual guide to the 144 tiles used in standard Mahjong gameplay.
            <br />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Click any tile for quick facts and top scoring hands.
            </span>
          </>
        }
      />

      {SUITS.map(suit => (
        <section key={suit} className="glossary-section">
          <h2 className="section-label">{suit}</h2>
          <div className="glossary-grid">
            {MAHJONG_TILES.filter(tile => tile.suit === suit).map(tile => (
              <GlossaryTileCard
                key={tile.id}
                tile={tile}
                isSelected={selectedTile?.id === tile.id}
                onSelect={setSelectedTile}
              />
            ))}
          </div>
        </section>
      ))}

      <SuitsInfoPanel />

      {selectedTile && (
        <TileDrawer tile={selectedTile} onClose={() => setSelectedTile(null)} />
      )}
    </PageContent>
  );
}
