import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const location = useLocation();
  const isCreatorsPage = location.pathname === '/creators';

  return (
    <div className="site-shell">
      {/* Global Background Glow blobs */}
      <div className="site-bg-glow">
        <div className="glow-blob glow-blob-1" />
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
