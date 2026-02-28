import { Link } from 'react-router-dom';
import { BookOpen, Scale, Lightbulb, ArrowRight } from 'lucide-react';
import './TileKeyboard.css';

export default function LearnPromo() {
  return (
    <div className="learn-promo">
      <div className="learn-promo-inner">
        <div className="learn-promo-text">
          <p className="learn-promo-eyebrow">New to Mahjong?</p>
          <p className="learn-promo-headline">Learn to play — tiles, rules, and strategy</p>
        </div>
        <div className="learn-promo-links">
          <Link to="/learn/rules" className="learn-promo-chip">
            <BookOpen size={13} />
            Rules
          </Link>
          <Link to="/learn/scoring" className="learn-promo-chip">
            <Scale size={13} />
            Scoring
          </Link>
          <Link to="/learn/strategy" className="learn-promo-chip">
            <Lightbulb size={13} />
            Strategy
          </Link>
        </div>
        <Link to="/learn" className="learn-promo-cta">
          Start Learning
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
