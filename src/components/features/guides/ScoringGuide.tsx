import './ScoringGuide.css';
import { CtaCard } from '../../ui/CtaCard';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { FanCard } from '../../ui/FanCard';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import { HouseRuleSelector } from '../builder/HouseRuleSelector';
import { MAHJONG_TILES } from '../../../lib/tiles';

const TileImage = ({ id }: { id: string }) => {
  const tile = MAHJONG_TILES.find(t => t.id === id);
  return tile ? <img src={tile.image} alt={tile.name} className="explanation-tile" /> : null;
};

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function ScoringGuide() {
  return (
    <PageContent className="scoring-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Mahjong Scoring Guide"
        subtitle="When the game is finally over, it's time to count the score!"
      />

      <HouseRuleSelector />

      <div className="scoring-section">
        <SectionHeader icon="📖" title="Simplified House Rules" />
        <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          My family has played mahjong for a long time, and they focus on only one thing: winning. So I think this rule is perfect for friends or family members who are getting used to mahjong. Understand the basics of how to win first, then focus on strategy next.
        </p>

        <InfoBox accent="blue">
          <p style={{ margin: 0, marginBottom: '1rem' }}>
            <strong>Quick reminder</strong><br />
            A winning hand consists of either 4 sets (Chow, Pung, or Kong; concealed or melded) and one pair, or 7 concealed pairs.
          </p>
          <div className="hand-example">
            <div className="hand-example-title">4 Sets + 1 Pair (from chow, pung, kong)</div>
            <div className="hand-example-tiles">
              {/* Pung */}
              <TileImage id="c1" /><TileImage id="c1" /><TileImage id="c1" />
              <span className="hand-example-divider" />
              {/* Chow */}
              <TileImage id="b2" /><TileImage id="b3" /><TileImage id="b4" />
              <span className="hand-example-divider" />
              {/* Chow */}
              <TileImage id="d5" /><TileImage id="d6" /><TileImage id="d7" />
              <span className="hand-example-divider" />
              {/* Kong */}
              <TileImage id="h1" /><TileImage id="h1" /><TileImage id="h1" /><TileImage id="h1" />
              <span className="hand-example-divider" />
              {/* Pair */}
              <TileImage id="h7" /><TileImage id="h7" />
            </div>
          </div>

          <div className="hand-example" style={{ marginTop: '0.75rem' }}>
            <div className="hand-example-title">7 Pairs</div>
            <div className="hand-example-tiles">
              <TileImage id="b1" /><TileImage id="b1" />
              <span className="hand-example-divider" />
              <TileImage id="b2" /><TileImage id="b2" />
              <span className="hand-example-divider" />
              <TileImage id="b3" /><TileImage id="b3" />
              <span className="hand-example-divider" />
              <TileImage id="b4" /><TileImage id="b4" />
              <span className="hand-example-divider" />
              <TileImage id="b5" /><TileImage id="b5" />
              <span className="hand-example-divider" />
              <TileImage id="b6" /><TileImage id="b6" />
              <span className="hand-example-divider" />
              <TileImage id="h1" /><TileImage id="h1" />
            </div>
          </div>
        </InfoBox>
        <br />


        <SectionHeader icon="💰" title="Paying a price for being a loser" />
        <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          When the player calls a win, the other players will have to pay the winner. The discard player must pay more when they make the winner wins the game.
          This is only to discourage players from playing games without caring about the game.
        </p>

        <div className="payment-grid" style={{ marginTop: '1rem' }}>
          <FanCard 
            fan="15" 
            fanLabel="Points" 
            title="Simple Win" 
            description="Paid by only discard player"
            accent="green"
          />
          <FanCard 
            fan="10" 
            fanLabel="Points" 
            title="Simple Win" 
            description="Paid by everyone else"
            accent="blue"
          />
        </div>
      </div>

      <div className="scoring-section">
        <SectionHeader icon="🎓" title="After getting the grip" />
        <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          When you understand how to win, you can start this additional scoring.
        </p>

        <div className="payment-grid" style={{ marginTop: '1rem' }}>
          <FanCard 
            fan="30" 
            fanLabel="Points" 
            title="One Suit Only" 
            description="Hands are made out of one suit only, with honors allowed."
            accent="green"
          />
          <FanCard 
            fan="30" 
            fanLabel="Points" 
            title="All Chows" 
            description="Hands are made out of chows (sequence melds) only."
            accent="blue"
          />
          <FanCard 
            fan="30" 
            fanLabel="Points" 
            title="All Pung" 
            description="Hands are made out of pungs (triplet melds) only."
            accent="violet"
          />
          <FanCard 
            fan="5" 
            fanLabel="more Points" 
            title="Matching Flower" 
            description="For each drawn flower tile that matches your seat wind."
            accent="pink"
          />
          <FanCard 
            fan="5" 
            fanLabel="more Points" 
            title="Discarder" 
            description="Discarder still pays 5 more points"
            accent="red"
          />
        </div>
      </div>

      <div className="scoring-section">
        <SectionHeader icon="🧠" title="Hone your skills" />
        <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          I understand that you can't win with only the theory alone. It requires a strategy, managing risks, cutting losses, and the most important thing: recognizing the tile patterns.
        </p>
        <InfoBox accent="amber">
          <p style={{ margin: 0 }}>
            Practice the pattern by playing the game alone. Start with the standard 13 tiles, and with your strategy, try to be 1 tile off from winning within 17 wall draws.
          </p>
        </InfoBox>
      </div>

      <div className="scoring-section">
        <SectionHeader icon="🚀" title="Upgrade the game to the next level" />
        <p style={{ margin: 0, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
          There are so many variants of mahjong in the world, some might contain additional rulesets or even new tiles.
        </p>
        <InfoBox accent="violet">
          <p style={{ margin: 0, marginBottom: '0.5rem' }}>
            But people in Reddit suggest you to go for <strong>Hong Kong Old Style (HKOS)</strong>, as they focus on having a good hand first and do not reward a weak winning hand.
          </p>
          <p style={{ margin: 0 }}>
            And there's Guangzhou, New Hong Kong Style, and more. So send us the guide and we will add it here!
          </p>
        </InfoBox>
      </div>

      {/* ── CTA ── */}
      <CtaCard
        title="Build a high-Fan hand now"
        description="Use the Hand Builder to construct and validate scoring patterns like Pung Hand or Seven Pairs."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Strategy Guide →', href: '/strategy', variant: 'secondary' },
        ]}
      />

    </PageContent >
  );
}
