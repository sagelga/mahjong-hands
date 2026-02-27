import './PageContent.css';

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContent({ children, className = '' }: PageContentProps) {
  return (
    <main className={`page-content ${className}`}>
      {children}
    </main>
  );
}
