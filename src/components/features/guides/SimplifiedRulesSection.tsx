import './ScoringGuide.css';
import { SectionHeader } from '../../ui/SectionHeader';
import { InfoBox } from '../../ui/InfoBox';
import { MAHJONG_TILES } from '../../../lib/tiles';

interface TileImageProps {
  id: string;
}

const TileImage = ({ id }: TileImageProps) => {
  const tile = MAHJONG_TILES.find(t => t.id === id);
  return tile ? <img src={tile.image} alt={tile.name} className="explanation-tile" /> : null;
};

export default function SimplifiedRulesSection() {
  return (
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
    </div>
  );
}
