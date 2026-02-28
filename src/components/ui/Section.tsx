import type { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
}

export default function Section({ children }: SectionProps) {
  return <section className="section-full-width">{children}</section>;
}
