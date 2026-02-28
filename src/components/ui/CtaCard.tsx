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
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="cta-buttons">
        {buttons.map((btn) => (
          <a
            key={btn.href}
            href={btn.href}
            className={btn.variant === 'secondary' ? 'btn-secondary' : 'btn-primary'}
          >
            {btn.label}
          </a>
        ))}
      </div>
    </div>
  );
}
