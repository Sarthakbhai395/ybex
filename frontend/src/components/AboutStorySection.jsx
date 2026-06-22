import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import {
  aboutJoinStrip,
  aboutStats,
  aboutTimeline,
} from '../content/siteData';

// Resolve image URL — handles local /uploads/ paths and external URLs
function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith('/uploads/')) {
    // On localhost: Vite proxies /uploads → backend:5000, so use path directly
    // On IP access (mobile/LAN): point directly to backend port 5000
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `http://${window.location.hostname}:5000${url}`;
    }
    return url; // Vite proxy handles it on localhost
  }
  return url;
}

/* ─── Hiring Application Modal ─────────────────────────────────────────────── */
function HiringModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', position: '',
    resumeLink: '', portfolioLink: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.position.trim()) e.position = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await axiosInstance.post('/hiring', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        position: form.position.trim(),
        resumeLink: form.resumeLink.trim(),
        portfolioLink: form.portfolioLink.trim(),
        message: form.message.trim(),
      });
      setDone(true);
      setTimeout(onClose, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}{['name', 'email', 'phone', 'position'].includes(key) && <span style={{ color: '#a78bfa', marginLeft: '3px' }}>*</span>}
      </label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })); }}
        style={{
          padding: '12px 14px',
          background: errors[key] ? 'rgba(255,61,16,0.06)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${errors[key] ? 'rgba(255,61,16,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', color: '#fff', fontSize: '0.9rem',
          outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#a78bfa'}
        onBlur={e => e.target.style.borderColor = errors[key] ? 'rgba(255,61,16,0.5)' : 'rgba(255,255,255,0.1)'}
      />
      {errors[key] && <span style={{ fontSize: '0.65rem', color: '#FF3D10' }}>{errors[key]}</span>}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={e => e.target === e.currentTarget && onClose()}
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', overflowY: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          style={{
            width: '100%', maxWidth: '560px',
            background: 'linear-gradient(160deg, #0d0d0d 0%, #111 100%)',
            border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(167,139,250,0.1)',
            position: 'relative',
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #a78bfa, #7c3aed, #a78bfa)' }} />

          {/* Close button */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >✕</button>

          <div style={{ padding: '2rem 2rem 1.5rem' }}>
            {done ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  style={{ fontSize: '3rem', marginBottom: '1rem' }}
                >🎉</motion.div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#a78bfa', margin: '0 0 0.5rem' }}>Application Sent!</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: 0 }}>We'll review your application and get back to you soon.</p>
              </motion.div>
            ) : (
              <>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                    Apply to <span style={{ color: '#a78bfa' }}>Team YBEX</span>
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                    Let's build something crazy together.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {field('name', 'Full Name', 'text', 'Aman Verma')}
                    {field('email', 'Email Address', 'email', 'aman@example.com')}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {field('phone', 'WhatsApp Number', 'tel', '+91 00000 00000')}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Role Interested In <span style={{ color: '#a78bfa' }}>*</span>
                      </label>
                      <select
                        value={form.position}
                        onChange={e => { setForm(p => ({ ...p, position: e.target.value })); setErrors(p => ({ ...p, position: '' })); }}
                        style={{
                          padding: '12px 14px',
                          background: errors.position ? 'rgba(255,61,16,0.06)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${errors.position ? 'rgba(255,61,16,0.5)' : 'rgba(255,255,255,0.1)'}`,
                          borderRadius: '10px', color: form.position ? '#fff' : 'rgba(255,255,255,0.35)',
                          fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
                          cursor: 'pointer', width: '100%',
                        }}
                      >
                        <option value="" style={{ background: '#111' }}>Select role...</option>
                        {['Creative Designer', 'Video Editor', 'Content Creator', 'Social Media Manager', 'Digital Marketer', 'Copywriter', 'Brand Strategist', 'Other'].map(r => (
                          <option key={r} value={r} style={{ background: '#111' }}>{r}</option>
                        ))}
                      </select>
                      {errors.position && <span style={{ fontSize: '0.65rem', color: '#FF3D10' }}>{errors.position}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {field('resumeLink', 'Resume Link (GDrive/Dropbox)', 'url', 'https://...')}
                    {field('portfolioLink', 'Portfolio Link', 'url', 'Behance/Instagram/Drive')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      Why do you want to join YBEX?
                    </label>
                    <textarea
                      value={form.message}
                      placeholder="Tell us something about yourself..."
                      rows={4}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      style={{
                        padding: '12px 14px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                        color: '#fff', fontSize: '0.9rem', outline: 'none',
                        fontFamily: 'inherit', resize: 'vertical', width: '100%', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = '#a78bfa'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '1rem',
                      background: submitting ? 'rgba(167,139,250,0.4)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                      border: 'none', borderRadius: '12px',
                      color: '#fff', fontSize: '0.95rem', fontWeight: 800,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      letterSpacing: '0.05em', textTransform: 'uppercase',
                      boxShadow: '0 8px 30px rgba(124,58,237,0.4)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {submitting ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>⟳</motion.span> Sending...</>
                    ) : (
                      <><span>✈</span> Send Application</>
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function AboutStorySection() {
  const [viewCount, setViewCount] = useState(47804210);
  const [showHiringModal, setShowHiringModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewCount(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axiosInstance.get('/team-members')
      .then((res) => setTeamMembers(res.data.members || []))
      .catch(console.error)
      .finally(() => setTeamLoading(false));
  }, []);

  const formatNumber = (num) => num.toLocaleString();

  // Split by category
  const founders = teamMembers.filter((m) => m.coreTeam === 'Founder');
  const powerhouse = teamMembers.filter((m) => m.coreTeam !== 'Founder');

  return (
    <>
      <style>{`
        /* Montserrat override for about page */
        .about-page-premium,
        .about-page-premium *,
        .about-story-journey,
        .about-story-journey *,
        .about-new-chapter-section,
        .about-new-chapter-section *,
        .about-team-premium,
        .about-team-premium * {
          font-family: 'Montserrat', sans-serif !important;
        }

        .about-story-hero {
          position: relative !important;
          overflow: hidden !important;
        }

        .about-story-hero,
        .about-story-hero * {
          font-family: 'Inter', sans-serif !important;
        }

        .about-hero-shell {
          position: relative !important;
          z-index: 2 !important;
        }

        .about-story-title {
          letter-spacing: 0.02em !important;
          word-spacing: 0.12em !important;
        }

        .about-hero-spotlight {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          width: 600px !important;
          height: 600px !important;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.15) 0%, rgba(228, 241, 65, 0.03) 55%, transparent 75%) !important;
          pointer-events: none !important;
          z-index: 1 !important;
          filter: blur(50px) !important;
          animation: about-spotlight-pulse 6s infinite ease-in-out !important;
        }

        @keyframes about-spotlight-pulse {
          0%, 100% {
            opacity: 0.25;
            transform: translate(-50%, -50%) scale(0.9) !important;
          }
          50% {
            opacity: 0.55;
            transform: translate(-50%, -50%) scale(1.1) !important;
          }
        }

        .views-counter-container {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          align-items: center;
          justify-content: center;
          gap: 0.22em;
          line-height: 0.95;
          width: 100% !important;
        }

        .views-counter-char {
          display: inline-block !important;
          white-space: nowrap !important;
        }

        .about-big-stat p {
          max-width: none !important;
          display: flex !important;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 1.2rem;
        }

        .big-stat-main-label {
          color: #e4f141 !important;
          opacity: 0.72;
          font-size: 0.72rem !important;
          font-weight: 800 !important;
          text-transform: uppercase;
          letter-spacing: 0.22em !important;
          word-spacing: 0.15em !important;
          margin: 0;
          display: block;
        }

        .big-stat-sub-label {
          color: rgba(255, 255, 255, 0.35) !important;
          font-size: 0.95rem !important;
          font-weight: 900 !important;
          font-style: italic !important;
          text-transform: uppercase;
          letter-spacing: 0.38em !important;
          word-spacing: 0.2em !important;
          margin: 0;
          display: block;
        }
        
        .about-page-premium p,
        .about-page-premium span,
        .about-page-premium div,
        .about-page-premium li,
        .about-page-premium label,
        .about-page-premium input,
        .about-page-premium select,
        .about-page-premium textarea,
        .about-page-premium a {
          font-weight: 700 !important;
        }

        .about-page-premium h1,
        .about-page-premium h2,
        .about-page-premium h3,
        .about-page-premium strong {
          font-weight: 900 !important;
        }

        /* How it Started - Simultaneous Hover Effect */
        .about-pill-image:hover {
          transform: none !important;
          filter: grayscale(1) brightness(0.78) !important;
        }
        .about-timeline-media:hover .about-pill-image {
          transform: translateY(-8px) scale(1.02) !important;
          filter: grayscale(0.15) brightness(0.96) !important;
        }

        /* A New Chapter Circle Track layout styling */
        .about-new-chapter-section {
          padding: 5rem 0 6rem;
          background-color: #000;
          position: relative;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .new-chapter-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
          max-width: 1160px;
          margin: 0 auto;
        }
        
        .new-chapter-visuals {
          position: relative;
          width: 440px;
          height: 440px;
          margin: 0 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .main-office-circle {
          width: 320px;
          height: 320px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 35px rgba(228, 241, 65, 0.15);
          position: relative;
          z-index: 2;
          transition: transform 0.5s ease, border-color 0.5s ease;
        }
        
        .main-office-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .main-office-circle:hover {
          transform: scale(1.02);
          border-color: rgba(228, 241, 65, 0.45);
        }
        
        /* Full circular track ring */
        .track-arc-line {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          border: 2.5px solid rgba(228, 241, 65, 0.45);
          pointer-events: none;
          z-index: 1;
          opacity: 0.85;
          filter: drop-shadow(0 0 8px rgba(228, 241, 65, 0.4));
          transition: border-color 0.3s ease;
        }
        
        /* Wrappers for orbit nodes + labels */
        .track-node-wrapper {
          position: absolute;
          width: 90px;
          height: 90px;
          z-index: 3;
        }
        
        .track-node {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 3.5px solid rgba(255, 255, 255, 0.85);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
          cursor: pointer;
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.35s ease, box-shadow 0.35s ease;
        }
        
        .track-node img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .track-node-wrapper:hover .track-node,
        .track-node-wrapper.wrapper-active .track-node {
          transform: scale(1.18);
          border-color: #e4f141 !important;
          box-shadow: 0 0 25px rgba(228, 241, 65, 0.8), 0 8px 30px rgba(0,0,0,0.6) !important;
        }
        
        .node-top-wrapper {
          top: 25px;
          left: 20px;
        }
        
        .node-middle-wrapper {
          top: 175px;
          left: -30px;
        }
        
        .node-bottom-wrapper {
          bottom: 25px;
          left: 20px;
        }
        
        /* Floating premium label card next to the node */
        .orbit-text-label {
          position: absolute;
          right: 115%;
          top: 50%;
          transform: translateY(-50%);
          width: 200px;
          text-align: right;
          pointer-events: none;
          opacity: 0.85;
          transition: opacity 0.3s ease, transform 0.3s ease;
          background: rgba(8, 8, 8, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .orbit-text-label h3 {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.92rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 3px 0;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: color 0.3s ease;
        }
        
        .orbit-text-label p {
          font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          line-height: 1.35;
          font-weight: 500 !important;
        }
        
        .track-node-wrapper:hover .orbit-text-label h3,
        .track-node-wrapper.wrapper-active .orbit-text-label h3 {
          color: #e4f141;
        }
        
        .track-node-wrapper:hover .orbit-text-label,
        .track-node-wrapper.wrapper-active .orbit-text-label {
          opacity: 1;
          transform: translateY(-50%) translateX(-4px);
        }
        
        /* Details side */
        .new-chapter-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .new-chapter-header-copy {
          margin-bottom: 0;
        }
        
        .new-chapter-header-copy h2 {
          font-size: clamp(2rem, 5vw, 3.8rem);
          text-transform: uppercase;
          margin: 0.5rem 0 1rem;
          line-height: 0.94;
          letter-spacing: -0.04em;
        }
        
        .new-chapter-header-copy .main-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 480px;
          font-style: italic;
        }
        
        @media (max-width: 960px) {
          .new-chapter-wrapper {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
          .new-chapter-visuals {
            order: 1;
            width: 320px;
            height: 320px;
          }
          .new-chapter-details {
            order: 2;
          }
          
          .main-office-circle {
            width: 230px;
            height: 230px;
          }
          
          .track-arc-line {
            width: 270px;
            height: 270px;
          }
          
          .track-node-wrapper {
            width: 70px;
            height: 70px;
          }
          
          .node-top-wrapper {
            top: 20px;
            right: 12px;
            left: auto;
          }
          
          .node-middle-wrapper {
            top: 125px;
            right: -20px;
            left: auto;
          }
          
          .node-bottom-wrapper {
            bottom: 20px;
            right: 12px;
            left: auto;
          }
          
          .new-chapter-header-copy {
            text-align: center;
          }
          
          .new-chapter-header-copy .main-desc {
            margin: 0 auto;
          }

          .orbit-text-label {
            right: 105%;
            left: auto;
            text-align: right;
            width: 160px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
          }

          .track-node-wrapper:hover .orbit-text-label,
          .track-node-wrapper.wrapper-active .orbit-text-label {
            transform: translateY(-50%) translateX(-4px);
          }
        }
      `}</style>

      {showHiringModal && <HiringModal onClose={() => setShowHiringModal(false)} />}
      <section className="section-block about-story-hero">
        <div className="about-hero-spotlight" />
        <div className="container">
          <motion.div
            className="about-hero-shell"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="about-story-title">
              The <span>YBEX</span> Story
            </h1>

            <div className="about-big-stat">
              <strong className="views-counter-container">
                {formatNumber(viewCount).split('').map((char, index) => (
                  <span key={index} className="views-counter-char">
                    {char}
                  </span>
                ))}
              </strong>
              <p>
                <span className="big-stat-main-label">
                  {aboutStats[0].label.toLowerCase().endsWith('for brands')
                    ? aboutStats[0].label.substring(0, aboutStats[0].label.toLowerCase().lastIndexOf('for brands')).trim()
                    : aboutStats[0].label}
                </span>
                {aboutStats[0].label.toLowerCase().endsWith('for brands') && (
                  <span className="big-stat-sub-label">FOR BRANDS</span>
                )}
              </p>
            </div>

            <div className="about-mini-stats">
              {aboutStats.slice(1).map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-block about-story-journey">
        <div className="container about-timeline-shell">
          {aboutTimeline.slice(0, 2).map((item, index) => (
            <motion.article
              key={item.title}
              className={`about-timeline-row ${index % 2 ? 'is-reverse' : ''}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <div className="about-timeline-copy">
                <span className="about-phase">{item.phase}</span>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <div className="about-timeline-rule">
                  <span>{item.icon}</span>
                </div>
              </div>

              {index === 1 ? (
                <div className="about-growth-logos">
                  {item.images.map((image, imageIndex) => (
                    <div key={image} className={`about-logo-card about-logo-card-${imageIndex + 1}`}>
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="about-timeline-media">
                  {item.images.map((image, imageIndex) => (
                    <div key={image} className={`about-pill-image about-pill-image-${imageIndex + 1}`}>
                      <img src={image} alt={`${item.title} ${imageIndex + 1}`} loading="lazy" />
                    </div>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      {/* A New Chapter Circle Track Section */}
      <section className="section-block about-new-chapter-section">
        <div className="container">
          <div className="new-chapter-wrapper">

            {/* Left side: synchronized description block */}
            <div className="new-chapter-details">
              <div className="new-chapter-header-copy">
                <span className="about-phase">{aboutTimeline[2].phase}</span>
                <h2>{aboutTimeline[2].title}</h2>
                <p className="main-desc" style={{ maxWidth: '440px' }}>{aboutTimeline[2].description}</p>
              </div>
            </div>

            {/* Right side: Circular track visuals with point text inside orbit */}
            <div className="new-chapter-visuals">
              {/* Main Center Image */}
              <div className="main-office-circle">
                <img src={resolveImg(aboutTimeline[2].images[0])} alt="Main Office Exterior" loading="lazy" />
              </div>

              {/* Glowing circular arc track */}
              <div className="track-arc-line" />

              {/* Floating Small Images with Labels in Orbit */}
              <div
                className={`track-node-wrapper node-top-wrapper ${activeNode === 'top' ? 'wrapper-active' : ''}`}
                onMouseEnter={() => setActiveNode('top')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="orbit-text-label">
                  <h3>NEW OFFICE</h3>
                  <p>Our first official physical space</p>
                </div>
                <motion.div
                  className="track-node"
                  whileHover={{ scale: 1.18 }}
                >
                  <img src={resolveImg(aboutTimeline[2].images[1])} alt="Office interior top" loading="lazy" />
                </motion.div>
              </div>

              <div
                className={`track-node-wrapper node-middle-wrapper ${activeNode === 'middle' ? 'wrapper-active' : ''}`}
                onMouseEnter={() => setActiveNode('middle')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="orbit-text-label">
                  <h3>CREATIVE HUB</h3>
                  <p>Designed for creators, built for ideas</p>
                </div>
                <motion.div
                  className="track-node"
                  whileHover={{ scale: 1.18 }}
                >
                  <img src={resolveImg(aboutTimeline[2].images[2])} alt="Office interior middle" loading="lazy" />
                </motion.div>
              </div>

              <div
                className={`track-node-wrapper node-bottom-wrapper ${activeNode === 'bottom' ? 'wrapper-active' : ''}`}
                onMouseEnter={() => setActiveNode('bottom')}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="orbit-text-label">
                  <h3>NEXT LEVEL</h3>
                  <p>Scaling projects & impact globally</p>
                </div>
                <motion.div
                  className="track-node"
                  whileHover={{ scale: 1.18 }}
                >
                  {/* Reusing image 1 for bottom circle */}
                  <img src={resolveImg(aboutTimeline[2].images[1])} alt="Office interior bottom" loading="lazy" />
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="section-block about-team-premium">
        <div className="container">
          <motion.div
            className="about-team-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="about-section-display">The Visionaries</h2>
            <div className="team-team-meta" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingTop: '1.1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <p className="section-subtitle" style={{ margin: 0, color: 'rgba(255, 255, 255, 0.48)', textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.95rem' }}>The Founders of YBEX</p>
            </div>
          </motion.div>

          {teamLoading ? (
            <div className="team-grid founders-grid">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  style={{ height: '320px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}
                />
              ))}
            </div>
          ) : founders.length > 0 ? (
            <div className="team-grid founders-grid">
              {founders.map((member, index) => (
                <motion.article
                  key={member._id}
                  className="team-member"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                >
                  <div className="team-photo">
                    {resolveImg(member.imageUrl) ? (
                      <img src={resolveImg(member.imageUrl)} alt={member.name} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'rgba(255,255,255,0.04)' }}>👤</div>
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role || member.coreTeam}</p>
                  {member.socialLink && (
                    <a
                      href={member.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-link"
                      aria-label={`${member.name} social profile`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          ) : null}

          <motion.div
            className="about-team-heading team-header-secondary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="about-section-display">Our Powerhouse</h2>
            <div className="about-team-meta">
              <p className="section-subtitle">Meet the creatives behind the scenes</p>
            </div>
          </motion.div>

          {teamLoading ? (
            <div className="team-grid team-grid-powerhouse">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.15, 0.35, 0.15] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2 }}
                  style={{ height: '280px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' }}
                />
              ))}
            </div>
          ) : powerhouse.length > 0 ? (
            <div className="team-grid team-grid-powerhouse">
              {powerhouse.map((member, index) => (
                <motion.article
                  key={member._id}
                  className="team-member"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                >
                  <div className="team-photo">
                    {resolveImg(member.imageUrl) ? (
                      <img src={resolveImg(member.imageUrl)} alt={member.name} loading="lazy" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', background: 'rgba(255,255,255,0.04)' }}>👤</div>
                    )}
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role || member.coreTeam}</p>
                  {member.socialLink && (
                    <a
                      href={member.socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="team-social-link"
                      aria-label={`${member.name} social profile`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  )}
                </motion.article>
              ))}
            </div>
          ) : null}
        </div>
      </section>

    </>
  );
}
