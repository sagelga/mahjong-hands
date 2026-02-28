import './MahjongRules.css';
import { FanCard } from '../../ui/FanCard';

const WIN_CONDITIONS = [
  {
    fan: '4+1',
    title: 'Sets & Pair',
    desc: 'Four groups of tiles (Chow, Pung, or Kong) plus one matching pair — the most common winning pattern.',
    accent: 'green' as const,
  },
  {
    fan: '7',
    title: 'Seven Pairs',
    desc: 'Seven different pairs of identical tiles. Allowed in most variants — a fun alternative route to winning.',
    accent: 'violet' as const,
  },
];

export default function WinConditionsSection() {
  return (
    <div className="rules-section">
      <h2>How to win in mahjong</h2>
      <p className="rules-body">
        In mahjong, we will play in multiple rounds, with at least 4 rounds will be played in a single game. This allows everyone to take part as a banker and start the round first. But we will walkthrough all the stages of the games later.
      </p>

      <p className="rules-body">
        For each round, 4 players will each have <strong>13 tiles in their hand</strong> either hidden (concealed) or declaired (melded), and combined with another one tile from previous player's discard tile or drawn from the center (known as wall) forming a 14-tile that can consists of:
      </p>
      <div className="rules-fan-grid">
        {WIN_CONDITIONS.map(w => (
          <FanCard
            key={w.title}
            fan={w.fan}
            title={w.title}
            description={w.desc}
            accent={w.accent}
          />
        ))}
      </div>
       <p className="rules-body">
        Disclaimer: For new people that want to learn a generic mahjong ruleset, stick with the 4 sets and 1 pair. Other game variants might have something that is on top of this basic rule.
        </p>
    </div>
  );
}
