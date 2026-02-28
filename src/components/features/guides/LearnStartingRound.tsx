import './MahjongRules.css';
import { CtaCard } from '../../ui/CtaCard';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';

export default function LearnStartingRound() {
  return (
    <PageContent className="rules-container">
      <PageHeader title="Starting the Round" />

      <section className="rules-section">
        <h2 className="rules-subtitle">Setup</h2>
        <p>
          Each player receives <strong>13 tiles</strong> at the beginning of the round.
          The dealer (East) receives 14 tiles since they go first.
        </p>
      </section>

      <section className="rules-section">
        <h2 className="rules-subtitle">Game Flow</h2>
        <ol className="rules-list">
          <li><strong>Determine Dealer:</strong> Roll dice to determine who becomes the dealer (East)</li>
          <li><strong>Draw Tiles:</strong> Each player draws tiles from the wall until they have 13 tiles</li>
          <li><strong>Dealer Draws Extra:</strong> The dealer draws one additional tile (14 total)</li>
          <li><strong>Discard:</strong> The dealer discards one tile to end their first turn</li>
          <li><strong>Take Turns:</strong> Players take turns clockwise: draw one tile, then discard one tile</li>
        </ol>
      </section>

      <section className="rules-section">
        <h2 className="rules-subtitle">Drawing from Discard</h2>
        <p>You can claim a discarded tile to form a valid set:</p>
        <ul className="rules-list">
          <li><strong>Chow:</strong> Only from the player to your left (sequence of 3)</li>
          <li><strong>Pung:</strong> From any player (3 identical tiles)</li>
          <li><strong>Kong:</strong> From any player (4 identical tiles)</li>
          <li><strong>Win:</strong> From any player (completing your hand)</li>
        </ul>
      </section>

      <section className="rules-section">
        <h2 className="rules-subtitle">Important Rules</h2>
        <ul className="rules-list">
          <li>Always end your turn with exactly 13 tiles</li>
          <li>Flowers and Kongs don't count toward the 13-tile limit</li>
          <li>When you claim a tile, you must immediately expose it on the table</li>
          <li>After drawing a flower, you must immediately replace it with a tile from the wall</li>
        </ul>
      </section>

      <CtaCard
        title="Ready to learn strategy?"
        description="Learn how to develop your hand and win more often."
        buttons={[
          { label: 'Strategize Your Hand →', href: '/learn/strategize', variant: 'secondary' },
        ]}
      />
    </PageContent>
  );
}
