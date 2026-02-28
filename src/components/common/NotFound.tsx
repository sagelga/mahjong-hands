import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.css';

const JOKES = [
  "Why did the mahjong tile go missing? Because it couldn't find its pung!",
  "I tried to find this page, but like a discarded tile, it's gone to the dead wall.",
  "404: This page ran away faster than a player calling 'Hu!'",
  "Looks like this page pulled a disappearing act — even the flowers couldn't find it.",
  "This page is like a missing honor tile: rare, valuable, and nowhere to be found.",
  "I asked the East Wind where this page went. He just shrugged and drew another tile.",
  "Like a ghost tile in a wall, this page simply doesn't exist.",
  "The page you're looking for has been discarded. Nobody called it.",
];

function getJoke(): string {
  const index = Math.floor(Date.now() / 1000) % JOKES.length;
  return JOKES[index];
}

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="not-found-joke">{getJoke()}</p>
        <div className="not-found-actions">
          <button
            className="not-found-back-btn"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back to Previous Page
          </button>
          <Link to="/" className="not-found-home-link">
            <Home size={16} />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
