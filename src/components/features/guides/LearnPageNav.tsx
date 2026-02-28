import { Link, useLocation } from 'react-router-dom';
import './LearnPageNav.css';

const LEARN_PAGES = [
  { path: '/learn/rules',    title: 'Rules' },
  { path: '/learn/starting', title: 'Starting the Round' },
  { path: '/learn/strategy', title: 'Strategy' },
  { path: '/learn/scoring',  title: 'Scoring' },
];

export default function LearnPageNav() {
  const { pathname } = useLocation();
  const index = LEARN_PAGES.findIndex(p => p.path === pathname);
  if (index === -1) return null;

  const prev = LEARN_PAGES[index - 1] ?? null;
  const next = LEARN_PAGES[index + 1] ?? null;

  return (
    <nav className="learn-page-nav">
      <div className="lpn-prev">
        {prev && (
          <Link to={prev.path} className="lpn-btn lpn-btn--prev">
            <span className="lpn-arrow">←</span>
            <span className="lpn-label">
              <span className="lpn-hint">Previous</span>
              <span className="lpn-title">{prev.title}</span>
            </span>
          </Link>
        )}
      </div>

      <span className="lpn-position">{index + 1} / {LEARN_PAGES.length}</span>

      <div className="lpn-next">
        {next && (
          <Link to={next.path} className="lpn-btn lpn-btn--next">
            <span className="lpn-label">
              <span className="lpn-hint">Next</span>
              <span className="lpn-title">{next.title}</span>
            </span>
            <span className="lpn-arrow">→</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
