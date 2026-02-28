import './FanCard.css';

interface FanCardProps {
  fan: string | number;
  fanLabel?: string;
  title: string;
  description?: string;
  accent?: 'green' | 'pink' | 'amber' | 'blue' | 'violet' | 'red' | 'orange' | 'yellow';
  showDivider?: boolean;
}

export function FanCard({ 
  fan, 
  fanLabel, 
  title, 
  description, 
  accent = 'green',
  showDivider = true
}: FanCardProps) {
  const accentClasses = {
    green: '--pay-accent: linear-gradient(90deg,#10b981,#34d399);',
    pink: '--pay-accent: linear-gradient(90deg,#ec4899,#f472b6);',
    amber: '--pay-accent: linear-gradient(90deg,#f59e0b,#fbbf24);',
    blue: '--pay-accent: linear-gradient(90deg,#3b82f6,#60a5fa);',
    violet: '--pay-accent: linear-gradient(90deg,#8b5cf6,#a78bfa);',
    red: '--pay-accent: linear-gradient(90deg,#ef4444,#f87171);',
    orange: '--pay-accent: linear-gradient(90deg,#f97316,#fb923c);',
    yellow: '--pay-accent: linear-gradient(90deg,#fbbf24,#fde68a);',
  };

  const style = {
    ['--pay-accent' as string]: accentClasses[accent].match(/linear-gradient\([^)]+\)/)?.[0],
  } as React.CSSProperties;

  return (
    <div className="fan-card" style={style}>
      <div className="fan-value">
        {fan}
        {fanLabel && <span className="fan-label">{fanLabel}</span>}
      </div>
      {showDivider && <div className="fan-divider" />}
      <div className="fan-title">{title}</div>
      {description && <div className="fan-desc">{description}</div>}
    </div>
  );
}