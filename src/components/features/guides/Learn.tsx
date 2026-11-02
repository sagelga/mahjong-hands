import './Learn.css';
import { ArrowRight } from 'lucide-react';
import { CtaCard } from '../../ui/CtaCard';
import PageHeader from '../../layout/PageHeader';
import PageContent from '../../layout/PageContent';
import { Link } from 'react-router-dom';

const LEARN_STEPS = [
  {
    title: 'Rules',
    description: 'The tiles, the sets, and the flow of play — everything you need to get started.',
    hanzi: '規',
    path: '/learn/rules',
  },
  {
    title: 'Game Setup',
    description: 'Build the wall, pick seats, and start a round. Includes the East dealer rotation.',
    hanzi: '局',
    path: '/learn/setup',
  },
  {
    title: 'Strategize Your Hand',
    description: 'Waits, discards, and when to push. Learn to read the table before you commit.',
    hanzi: '策',
    path: '/learn/strategy',
  },
  {
    title: 'Rulesets',
    description: 'House rules, Hong Kong old style, and MCR — compare how each one scores.',
    hanzi: '分',
    path: '/scoring',
  },
];

export default function Learn() {
  return (
    <PageContent className="learn-container">

      <PageHeader
        title="Learn Mahjong"
        subtitle="From beginner to winner – follow this step-by-step guide"
      />

      <div className="learn-grid">
        {LEARN_STEPS.map((step, index) => (
          <Link to={step.path} key={step.path} className="learn-card">
            <span className="learn-hanzi" aria-hidden="true">{step.hanzi}</span>
            <span className="learn-step">Step {index + 1}</span>
            <h2 className="learn-card-title">{step.title}</h2>
            <p className="learn-card-description">{step.description}</p>
            <span className="learn-card-link">
              Start guide
              <ArrowRight size={14} aria-hidden="true" />
            </span>
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
