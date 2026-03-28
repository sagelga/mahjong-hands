import './SectionHeader.css';

import type { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
  title: string;
}

export function SectionHeader({ icon, title }: Props) {
  return (
    <div className="section-header">
      <span className="section-icon" aria-hidden="true">{icon}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
