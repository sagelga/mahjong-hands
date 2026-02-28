import Navbar from './Navbar';
import BetaBanner from '../ui/AnnouncementBanner';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <BetaBanner />
      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <Footer />
    </div>
  );
}
