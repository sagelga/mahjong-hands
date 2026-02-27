import './SectionHeader.css';

interface Props {
  icon: string;
  title: string;
}

export function SectionHeader({ icon, title }: Props) {
  return (
    <div className="section-header">
      <span className="section-icon">{icon}</span>
      <h2 className="section-title">{title}</h2>
    </div>
  );
}
