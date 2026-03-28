import './Learn.css';
import { CtaCard } from '../../ui/CtaCard';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import { Link } from 'react-router-dom';

const LEARN_STEPS = [
  {
    title: 'Rules',
    icon: '規',
    path: '/learn/rules',
  },
  {
    title: 'Game Setup',
    icon: '局',
    path: '/learn/setup',
  },
  {
    title: 'Strategize Your Hand',
    icon: '策',
    path: '/learn/strategy',
  },
  {
    title: 'Rulesets',
    icon: '分',
    path: '/scoring',
  },
];

export default function Learn() {
  return (
    <PageContent className="learn-container">

      {/* ── Hero ── */}
      <PageHeader
        title="Learn Mahjong"
        subtitle="From beginner to winner – follow this step-by-step guide"
      />

      {/* ── Button Grid ── */}
      <div className="learn-grid">
        {LEARN_STEPS.map((step, index) => (
          <Link to={step.path} key={index} className="learn-card">
            <div className="learn-content">
              <div className="learn-number">{index + 1}</div>
              <div className="learn-title">{step.title}</div>
            </div>
            <div className="learn-icon">{step.icon}</div>
          </Link>
        ))}
      </div>

      <CtaCard
        title="Ready to practice?"
        description="Use the Hand Builder to construct winning hands and apply what you've learned."
        buttons={[
          { label: 'Open Hand Builder', href: '/' },
        ]}
      />

    </PageContent>
  );
}
