import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">

        <div className="footer-brand">
          <div className="footer-logo">MH</div>
          <p className="footer-tagline">
            A fast, interactive Mahjong hand validator and builder.
            Supports standard wins, 7 Pairs, and intelligent combo detection.
          </p>
          <a
            className="footer-github"
            href="https://github.com/sagelga/mahjong-hands"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4 className="footer-col-heading">Tools</h4>
            <Link to="/" className="footer-link">Hand Builder</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-heading">Learn</h4>
            <Link to="/rules"    className="footer-link">Rules</Link>
            <Link to="/glossary" className="footer-link">Tile Glossary</Link>
            <Link to="/scoring"  className="footer-link">Scoring Guide</Link>
            <Link to="/strategy" className="footer-link">Strategy Guide</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-heading">Project</h4>
            <Link to="/about" className="footer-link">About</Link>
            <a
              className="footer-link"
              href="https://github.com/sagelga/mahjong-hands/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback
            </a>
            <a
              className="footer-link"
              href="https://github.com/sagelga/mahjong-hands/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              Changelog
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Mahjong Hands &bull; mahjong.sagelga.com
        </p>
        <p className="footer-attribution">
          Mahjong tile images sourced from Wikipedia under CC BY-SA 3.0
        </p>
        <p className="footer-attribution">
          Made with <Heart size={12} className="footer-heart" /> by{' '}
          <a href="https://sagelga.com" target="_blank" rel="noopener noreferrer" className="footer-author-link">
            @sagelga
          </a>
        </p>
      </div>
    </footer>
  );
}
