import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { MAHJONG_TILES } from '../../lib/tiles';
import './NotFound.css';

// Tenpai hand: three chows + a pung, waiting for the pair
const HAND_TILE_IDS = [
  'c1', 'c2', 'c3',
  'd4', 'd5', 'd6',
  'b7', 'b8', 'b9',
  'h7', 'h7', 'h7',
  'h6',
];

const BG_TILE_IDS = ['c5', 'd3', 'b2', 'h2', 'f1', 'h5', 'd9', 'c8'];

export default function NotFound() {
  const navigate = useNavigate();

  const handTiles = HAND_TILE_IDS.map(id => MAHJONG_TILES.find(t => t.id === id)!);
  const bgTiles = BG_TILE_IDS.map(id => MAHJONG_TILES.find(t => t.id === id)!);

  return (
    <div className="not-found-container">
      <div className="nf-bg" aria-hidden="true">
        {bgTiles.map((tile, i) => (
          <div key={i} className={`nf-bg-tile nf-bg-tile-${i}`}>
            <img src={tile.image} alt="" />
          </div>
        ))}
      </div>

      <div className="not-found-content">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Page Not Found</h1>

        <div className="nf-hand" role="img" aria-label="Mahjong hand missing the winning tile">
          {handTiles.map((tile, i) => (
            <div
              key={i}
              className="nf-tile"
              style={{ '--i': i } as React.CSSProperties}
            >
              <div className="nf-tile-inner">
                <div className="nf-tile-back" />
                <div className="nf-tile-front">
                  <img src={tile.image} alt="" />
                </div>
              </div>
            </div>
          ))}
          <div
            className="nf-tile nf-tile-missing"
            style={{ '--i': 13 } as React.CSSProperties}
          >
            <div className="nf-missing">?</div>
          </div>
        </div>

        <p className="nf-hand-label">Tenpai — waiting for a tile that no longer exists</p>

        <div className="nf-bottom">
          <p className="not-found-description">
            The page you're looking for has been discarded.
          </p>
          <div className="not-found-actions">
            <button
              className="not-found-back-btn"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
            <Link to="/" className="not-found-home-link">
              <Home size={16} />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
