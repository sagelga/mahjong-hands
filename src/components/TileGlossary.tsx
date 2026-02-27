import { MAHJONG_TILES, SUITS } from '../lib/tiles';
import './TileGlossary.css';

export default function TileGlossary() {
  return (
    <main className="glossary-container">
      <h1 className="glossary-title">Mahjong Tile Glossary</h1>
      <p className="subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        A complete visual guide to the 144 tiles used in standard Mahjong gameplay.
      </p>

      {SUITS.map(suit => (
        <section key={suit} className="glossary-section">
          <h2 className="section-label">{suit}</h2>
          <div className="glossary-grid">
            {MAHJONG_TILES.filter(tile => tile.suit === suit).map(tile => (
              <div key={tile.id} className="glossary-item">
                <img
                  src={tile.image}
                  alt={tile.name}
                  className="glossary-tile-image"
                />
                <div className="glossary-info">
                  <div className="glossary-tile-name">{tile.name}</div>
                  <div className="glossary-tile-desc">{suit}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* All Suit SEO block */}
      <section className="glossary-section">
        <h2 className="section-label">Why are there different suits?</h2>
        <div className="glass-panel" style={{ padding: '1.5rem', lineHeight: '1.6' }}>
          <p>
            Traditional Mahjong is played with three main suits: <strong>Characters (Wan)</strong>,
            <strong>Dots (Tong)</strong>, and <strong>Bamboo (Tiao)</strong>. Each suit consists
            of tiles numbered 1 through 9. To form a standard winning hand, players must
            typically create three-tile sequences (Chows) or triplets (Pungs) within these suits.
          </p>
          <p style={{ marginTop: '1rem' }}>
            In addition to the numbered tiles, players use <strong>Honors</strong> (Winds and Dragons)
            and <strong>Flowers/Seasons</strong>. These special tiles add layers of strategy
            and complexity to the scoring system, often serving as high-point multipliers or bonus points.
          </p>
        </div>
      </section>
    </main>
  );
}
