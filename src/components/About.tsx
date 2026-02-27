import './MahjongRules.css';
import { CtaCard } from './CtaCard';
import PageHeader from './PageHeader';
import PageContent from './PageContent';

export default function About() {
  return (
    <PageContent className="rules-container">
      <PageHeader title="About Mahjong Hand Builder" />

      <section className="rules-section">
        <h2 className="rules-subtitle">The Mission</h2>
        <p>
          Mahjong is a game of skill, strategy, and calculation. Our goal is to provide
          enthusiasts—from beginners to veterans—with a premium, real-time validator
          to analyze their hands and master the complex rules of Mahjong winning conditions.
        </p>
      </section>

      <section className="rules-section">
        <h2 className="rules-subtitle">Key Features</h2>
        <ul className="rules-list">
          <li><strong>Real-time Validation:</strong> Instantly check if your hand is valid.</li>
          <li><strong>Hand Analysis:</strong> Identifies Pungs, Chows, and potential Kongs.</li>
          <li><strong>Visual Glossary:</strong> A deep dive into every tile in the deck.</li>
          <li><strong>Premium Experience:</strong> Designed with a "Midnight Black" aesthetic for focus and clarity.</li>
        </ul>
      </section>

      <section className="rules-section">
        <h2 className="rules-subtitle">How it Works</h2>
        <p>
          Our validator uses a sophisticated recursive algorithm to decompose your hand
          into its constituent sets. It checks for standard 4-Set + 1-Pair wins as well
          as special conditions like 7-Pairs (Chitoitsu).
        </p>
      </section>

      <CtaCard
        title="Ready to build your hand?"
        description="Start adding tiles to see our validator in action."
        buttons={[
          { label: 'Go to Builder', href: '/' },
        ]}
      />
    </PageContent>
  );
}
