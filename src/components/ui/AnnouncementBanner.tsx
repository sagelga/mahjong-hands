import './AnnouncementBanner.css';
import { TriangleAlert } from 'lucide-react';

export default function AnnouncementBanner() {
  return (
    <div className="beta-banner">
      <div className="beta-banner-content">
        <span className="beta-banner-icon"><TriangleAlert size={16} /></span>
        <span className="beta-banner-message">
          <strong>This website is still in beta.</strong> We're constantly improving it!
        </span>
      </div>
      <a
        href="https://sagelga.notion.site/3147f2a665aa80dbb658cd6ce31fcd08?pvs=105"
        target="_blank"
        rel="noopener noreferrer"
        className="beta-banner-button"
      >
        Give Feedback
      </a>
    </div>
  );
}
