import './BuilderIntro.css';

export default function BuilderIntro() {
  return (
    <header className="builder-intro">
      <div className="builder-intro-copy">
        <h1>Build a winning hand.</h1>
        <p>
          Tap tiles to assemble 14. Group your sets and the shape is checked as you go —
          standard or seven pairs.
        </p>
      </div>
      <div className="builder-intro-chips" aria-label="Winning conditions">
        <span className="builder-chip"><strong>4</strong> sets + <strong>1</strong> pair</span>
        <span className="builder-chip"><strong>7</strong> pairs</span>
      </div>
    </header>
  );
}
