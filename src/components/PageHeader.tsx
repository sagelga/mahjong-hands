import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
}

export default function PageHeader({ title, subtitle, align = 'center' }: PageHeaderProps) {
  return (
    <header className={`page-header page-header--${align}`}>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}
