import { Link } from 'react-router-dom';
import { BookOpen, Scale, Lightbulb, ArrowRight } from 'lucide-react';
import './TileKeyboard.css';

export default function LearnPromo() {
  return (
    <aside className="learn-promo" aria-label="Learn mahjong">
      <p className="learn-promo-copy">
        <strong>New to mahjong?</strong> Learn to play — tiles, rules, and strategy.
      </p>
      <div className="learn-promo-links">
        <Link to="/learn/rules" className="learn-promo-chip">
          <BookOpen size={13} aria-hidden="true" />
          Rules
        </Link>
        <Link to="/scoring" className="learn-promo-chip">
          <Scale size={13} aria-hidden="true" />
          Scoring
        </Link>
        <Link to="/learn/strategy" className="learn-promo-chip">
          <Lightbulb size={13} aria-hidden="true" />
          Strategy
        </Link>
        <Link to="/learn" className="learn-promo-cta">
          Start Learning
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
