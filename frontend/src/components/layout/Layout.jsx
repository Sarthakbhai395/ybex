import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import { useLocation } from 'react-router-dom';
import { getGlowColor } from '../../theme/navbarTheme';

export default function Layout({ children }) {
  const location = useLocation();
  const isCreatorsPage = location.pathname === '/creators';
  const glowColor = getGlowColor(location.pathname);

  return (
    <div className="site-shell">
      {/* Global Background Glow blobs */}
      <div className="site-bg-glow">
        <div 
          className="glow-blob glow-blob-1" 
          style={{
            background: glowColor,
            backgroundColor: glowColor,
            transition: 'background 0.4s ease, background-color 0.4s ease'
          }}
        />
        <div className="glow-blob glow-blob-2" />
        <div className="glow-blob glow-blob-3" />
      </div>
      <ScrollToTop />
      <Navbar />
      <main className="site-main">{children}</main>
      {!isCreatorsPage && <Footer />}
    </div>
  );
}

