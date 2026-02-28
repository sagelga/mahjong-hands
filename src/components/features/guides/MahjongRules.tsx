import './MahjongRules.css';
import { memo } from 'react';
import PageContent from '../../layout/PageContent';
import PageHeader from '../../layout/PageHeader';
import { CtaCard } from '../../ui/CtaCard';
import { InfoBox } from '../../ui/InfoBox';
import LearnPageNav from './LearnPageNav';
import GameComponentsSection from './GameComponentsSection';
import WinConditionsSection from './WinConditionsSection';
import HandTypesSection from './HandTypesSection';

const MahjongRules = () => {
  return (
    <PageContent className="rules-container">
      <PageHeader
        title="How to Play Mahjong"
        subtitle="The tiles, the sets, and the flow of play — everything you need to get started."
      />

      <GameComponentsSection />
      <WinConditionsSection />
      <HandTypesSection />

      <InfoBox accent='green'>
        We will go through your turn rule again in the next section. Right now you need to remember the set name and how it is sequenced.
      </InfoBox>

      {/* ── Closing ── */}
      <div className="rules-section">
        <p className="rules-body">
          Players must use their strategies to win the games before the tile runs out from the wall. The game ends when player cannot play any further move or the player announced the win.
        </p>
        <p className="rules-body">
          In the next page, you will learn how to setup the game.
        </p>
      </div>

      <CtaCard
        title="Practice what you've learned"
        description="Use the Hand Builder to construct valid winning hands and test your understanding of the four set types."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Tile Glossary →', href: '/glossary', variant: 'secondary' },
        ]}
      />
      <LearnPageNav />
    </PageContent>
  );
};

export default memo(MahjongRules);
