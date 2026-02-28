import './TileGlossary.css';

export default function SuitsInfoPanel() {
  return (
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
  );
}
