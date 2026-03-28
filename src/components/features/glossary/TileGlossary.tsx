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

      <SuitsInfoPanel />

      <nav className="glossary-suit-nav" aria-label="Jump to suit">
        {SUITS.map(suit => (
          <a key={suit} href={`#suit-${suit.toLowerCase()}`} className="suit-nav-pill">{suit}</a>
        ))}
      </nav>

      {SUITS.map(suit => (
        <section key={suit} id={`suit-${suit.toLowerCase()}`} className="glossary-section">
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

      {selectedTile && (
        <TileDrawer tile={selectedTile} onClose={() => setSelectedTile(null)} />
      )}
    </PageContent>
  );
}
