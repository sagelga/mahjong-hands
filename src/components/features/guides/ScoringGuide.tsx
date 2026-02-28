import './ScoringGuide.css';
import { CtaCard } from '../../ui/CtaCard';
import PageHeader from '../../layout/PageHeader';
import LearnPageNav from './LearnPageNav';
import PageContent from '../../layout/PageContent';
import HouseRuleSelector from '../builder/HouseRuleSelector';
import SimplifiedRulesSection from './SimplifiedRulesSection';
import PaymentGridSection from './PaymentGridSection';
import ProgressionSection from './ProgressionSection';
import PracticeSection from './PracticeSection';
import VariantsSection from './VariantsSection';

export default function ScoringGuide() {
  return (
    <PageContent className="scoring-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Mahjong Scoring Guide"
        subtitle="When the game is finally over, it's time to count the score!"
      />

      <HouseRuleSelector />

      <SimplifiedRulesSection />
      <PaymentGridSection />
      <ProgressionSection />
      <PracticeSection />
      <VariantsSection />

      {/* ── CTA ── */}
      <CtaCard
        title="Build a high-Fan hand now"
        description="Use the Hand Builder to construct and validate scoring patterns like Pung Hand or Seven Pairs."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
          { label: 'Strategy Guide →', href: '/strategy', variant: 'secondary' },
        ]}
      />
      <LearnPageNav />
    </PageContent>
  );
}
