import './InfoBox.css';
import { type ReactNode } from 'react';

type Accent = 'green' | 'pink' | 'amber' | 'blue' | 'violet';

interface Props {
  accent?: Accent;
  children: ReactNode;
}

export function InfoBox({ accent, children }: Props) {
  return (
    <div className="info-box" data-accent={accent}>
      {children}
    </div>
  );
}
