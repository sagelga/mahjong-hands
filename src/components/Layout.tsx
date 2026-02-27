import Navbar from './Navbar';
import './Footer.css';


interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <footer className="footer-container">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} Mahjong Hands • mahjong.sagelga.com</p>
        <p className="footer-links">
          <a href="https://github.com/sagelga/mahjong-hands/issues" target="_blank" rel="noopener noreferrer">Feedback</a> •
          <a href="/about">About Us</a> •
          <a href="/rules">Rules</a>
        </p>
        <p className="footer-attribution">
          Mahjong tile images sourced from Wikipedia under CC BY-SA 3.0
        </p>
      </footer>
    </div>
  );
}
