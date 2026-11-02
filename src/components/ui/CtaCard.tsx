import { Link } from 'react-router-dom';
import './CtaCard.css';

interface CtaButton {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface CtaCardProps {
  title: string;
  description: string;
  buttons: CtaButton[];
}

export function CtaCard({ title, description, buttons }: CtaCardProps) {
  return (
    <div className="cta-card">
      <div className="cta-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="cta-buttons">
        {buttons.map((btn) => {
          const className = btn.variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
          return btn.href.startsWith('/') ? (
            <Link key={btn.href} to={btn.href} className={className}>
              {btn.label}
            </Link>
          ) : (
            <a
              key={btn.href}
              href={btn.href}
              className={className}
              target="_blank"
              rel="noopener noreferrer"
            >
              {btn.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
