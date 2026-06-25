import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';


const ybexServices = [
  {
    id: 'paid-pr',
    eyebrow: 'Paid PR',
    title: 'Paid PR',
    description: 'Build authority where trust matters most. Get featured across top-tier publications, digital media, and industry platforms to strengthen credibility, improve search visibility, and create the social proof your brand needs to convert faster.',
    features: ['Top-tier Publications', 'Press Release Writing', 'Outreach Campaigns', 'Authority Building'],
    benefits: ['Boost brand credibility', 'Improve organic search rankings', 'Drive high-intent referral traffic'],
    stats: '95% Placement Rate'
  },
  {
    id: 'social-media-management',
    eyebrow: 'Social Media Management',
    title: 'Social Media Management',
    description: 'We build internet relevance, not just social media pages. Our Gen-Z driven team creates trend-aware, human-first content designed to stop the scroll and grow your brand across platforms.',
    features: ['Platform-optimized Content Strategy', 'Daily Posting Calendars', 'Aesthetic Curation', 'Community Management'],
    benefits: ['Consistent posting consistency', 'Higher engagement rate', 'Grow digital presence organically'],
    stats: '3.5x Engagement Growth'
  },
  {
    id: 'brand-architecture',
    eyebrow: 'Brand Architecture',
    title: 'Brand Architecture',
    description: 'A clear brand structure that aligns every touchpoint. We define your positioning, messaging, and visual identity so your audience instantly understands what you stand for.',
    features: ['Brand Positioning Analysis', 'Core Message Framework', 'Visual Identity Design', 'Brand Guidelines'],
    benefits: ['Differentiate from competitors', 'Clear product tiering', 'Build long-term brand equity'],
    stats: '100% Identity Alignment'
  },
  {
    id: 'creative-production',
    eyebrow: 'Creative Production',
    title: 'Creative Production',
    description: 'Gen-Z driven creative production built to make brands impossible to ignore. From reels to ad creatives, we produce scroll-stopping content that communicates your value.',
    features: ['Concept Development', 'Trend-driven Shorts & Reels', 'Ad Creative Scripting', 'Studio & On-Site Shoots'],
    benefits: ['High scroll-stopping rate', 'Modern, premium aesthetic', 'High conversion performance'],
    stats: '15M+ Monthly Views'
  },
  {
    id: 'talent-management',
    eyebrow: 'Talent Management',
    title: 'Talent Management',
    description: 'The right creators, managed the right way. We discover, negotiate, and coordinate with influencers and creators to ensure every collaboration is smooth, strategic, and ROI-driven.',
    features: ['Creator Sourcing', 'Contract Negotiation', 'Campaign Management', 'Content Compliance Check'],
    benefits: ['Access vetted digital talent', 'Scale creator campaigns easily', 'Maximized campaign efficiency'],
    stats: '200+ Exclusive Creators'
  },
  {
    id: 'performance-marketing',
    eyebrow: 'Performance Marketing',
    title: 'Performance Marketing',
    description: 'Data-backed campaigns focused on profitable growth. We run and optimize ad campaigns across Google and Meta to generate leads, sales, and measurable returns.',
    features: ['Ad Account Structuring', 'Creative Testing & Analytics', 'Pixel & API Tracking', 'Budget Management'],
    benefits: ['Profitable scale', 'Transparent ROI metrics', 'Improved conversion rates'],
    stats: '4.8x Average ROAS'
  },
  {
    id: 'in-house-team-setups',
    eyebrow: 'In-House Team Setups',
    title: 'In-House Team Setups',
    description: 'Our marketing experts, embedded directly in your office. We deploy dedicated team members from our agency to work from your location, ensuring faster execution and complete alignment.',
    features: ['On-Site Personnel Placement', 'Daily Team Standups', 'Real-Time Execution Check', 'Direct Collaboration Setup'],
    benefits: ['Zero communication lag', 'Rapid asset delivery', 'Perfect internal synchronization'],
    stats: '100% Collaboration Rate'
  },
  {
    id: 'website-tech',
    eyebrow: 'Website & Tech',
    title: 'Website & Tech',
    description: 'Digital infrastructure built to convert. We create high-performance websites, landing pages, and tech systems that support marketing, improve user experience, and maximize conversions.',
    features: ['Web Design & Development', 'Landing Page Funnels', 'Core Web Vitals Optimization', 'Tech Integration'],
    benefits: ['Ultra-fast load times', 'Frictionless checkout/lead forms', 'Modern responsive visuals'],
    stats: '95+ Lighthouse Score'
  },
  {
    id: 'content-ecosystem',
    eyebrow: 'Content Ecosystem',
    title: 'Content Ecosystem',
    description: 'A connected system where every piece of content works together. We turn one idea into multi-platform content — helping brands stay consistent, visible, and culturally relevant.',
    features: ['Omnichannel Distribution Plan', 'Asset Repurposing Pipeline', 'Consistent Brand Voice Engine', 'Platform Specific Formatting'],
    benefits: ['Maximize content ROI', 'Ubiquitous brand footprint', 'Continuous organic lead source'],
    stats: '5x Content Output'
  }
];

function GalaxyBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX - width / 2;
      mouseRef.current.y = e.clientY - height / 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const starCount = 180;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12,
        parallax: Math.random() * 0.04 + 0.01,
      });
    }

    const nebulaOrbs = [
      { x: width * 0.2, y: height * 0.3, size: 280, color: 'rgba(228, 241, 65, 0.025)' },
      { x: width * 0.8, y: height * 0.7, size: 380, color: 'rgba(228, 241, 65, 0.02)' },
      { x: width * 0.5, y: height * 0.5, size: 450, color: 'rgba(228, 241, 65, 0.015)' },
    ];

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      nebulaOrbs.forEach((orb) => {
        orb.x += (Math.random() - 0.5) * 0.15;
        orb.y += (Math.random() - 0.5) * 0.15;

        const targetX = orb.x - mouseRef.current.x * 0.04;
        const targetY = orb.y - mouseRef.current.y * 0.04;

        const grad = ctx.createRadialGradient(targetX, targetY, 0, targetX, targetY, orb.size);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(targetX, targetY, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#ffffff';
      stars.forEach((star) => {
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        const renderX = star.x - mouseRef.current.x * star.parallax;
        const renderY = star.y - mouseRef.current.y * star.parallax;

        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="galaxy-canvas" />;
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. CINEMATIC LOADER COMPONENT — Instant text, zoom-out page reveal
// ═════════════════════════════════════════════════════════════════════════════

function CinematicLoader({ onComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    tl.set(containerRef.current, { opacity: 1 });

    // Animate "we are providing" with a high-end fade, scale and blur
    tl.fromTo('.loader-static-1',
      { filter: 'blur(10px)', scale: 0.85, opacity: 0, y: 15 },
      { filter: 'blur(0px)', scale: 1, opacity: 0.6, y: 0, duration: 0.7, ease: 'power3.out' }
    );

    // Animate "many services" shortly after with the same sleek effect
    tl.fromTo('.loader-static-2',
      { filter: 'blur(12px)', scale: 0.85, opacity: 0, y: 20 },
      { filter: 'blur(0px)', scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' },
      '-=0.45'
    );

    // Give a nice text glow pulse to "many services"
    tl.to('.loader-static-2', {
      textShadow: '0 0 25px rgba(255, 255, 255, 0.45)',
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }, '-=0.2');

    // Hold the complete title for a brief cinematic moment
    tl.to({}, { duration: 1.1 });

    // Fade out and scale up the loader container smoothly
    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.65,
      ease: 'power3.inOut'
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="cinematic-loader-container" style={{ opacity: 0 }}>
      <div className="loader-cycle-text">
        <span className="loader-static-1">we are providing</span>
        <span className="loader-static-2">many services</span>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. IN-HOUSE TEAM — Glass Hexagonal Orbs with GSAP Floating Animation
// ═════════════════════════════════════════════════════════════════════════════

function InHouseTeamSection() {
  const sectionRef = useRef(null);
  const orbRefs = useRef([]);
  const canvasRef = useRef(null);
  const tweensRef = useRef([]);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const categories = [
    { 
      title: 'Studio Setup', 
      desc: 'Complete acoustic treatments, lighting rigs, and professional camera architecture in your empty room.', 
      icon: '◆',
      highlights: [
        'Acoustic treatment design & execution',
        'Professional lighting & camera calibration',
        'Fully integrated creator workstation'
      ]
    },
    { 
      title: 'Creator Hiring', 
      desc: "Scouting, vetting, and interviewing digital talent matching your brand's voice.", 
      icon: '◈',
      highlights: [
        'Talent sourcing & audition cycles',
        'Brand voice alignment auditing',
        'Contracts, rates & vetting protocols'
      ]
    },
    { 
      title: 'Training', 
      desc: 'Hook psychology bootcamps, platform algorithms, retention editing handovers.', 
      icon: '◇',
      highlights: [
        'Gen-Z attention grabbing hooks',
        'High-retention video editing style',
        'Algorithm optimization playbook'
      ]
    },
    { 
      title: 'Content Systems', 
      desc: 'Notion workspaces, content calendars, script-writing checklists.', 
      icon: '⬡',
      highlights: [
        'Custom Notion Workspace build',
        'Content scheduling pipelines',
        'Script templates and guidelines'
      ]
    },
    { 
      title: 'Creative Operations', 
      desc: 'Review workflows, fast approval loops, output pacing SOPs.', 
      icon: '▽',
      highlights: [
        'Real-time production tracking',
        'Accelerated feedback/approval loop',
        'Scaled output velocity plans'
      ]
    }
  ];

  useEffect(() => {
    // GSAP floating animation for each orb wrapper
    orbRefs.current.forEach((el, i) => {
      if (!el) return;
      const t = gsap.to(el, {
        y: -12 + Math.random() * 8,
        x: (Math.random() - 0.5) * 6,
        rotation: (Math.random() - 0.5) * 2,
        duration: 2.5 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3,
      });
      tweensRef.current[i] = t;
    });

    // Background particle canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const dots = [];
    for (let i = 0; i < 60; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.speedX;
        d.y += d.speedY;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;

        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = '#E4F141';
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
      tweensRef.current.forEach(t => {
        if (t) t.kill();
      });
    };
  }, []);

  // Pause and reset float-wrapper transforms when hovering
  useEffect(() => {
    if (hoveredIdx !== null) {
      tweensRef.current.forEach((t, i) => {
        if (t) t.pause();
        const el = orbRefs.current[i];
        if (el) {
          gsap.to(el, { x: 0, y: 0, rotation: 0, duration: 0.4, overwrite: 'auto' });
        }
      });
    } else {
      tweensRef.current.forEach(t => {
        if (t) t.play();
      });
    }
  }, [hoveredIdx]);

  return (
    <section ref={sectionRef} className="universe-section inhouse-section-wrap">
      <canvas ref={canvasRef} className="inhouse-bg-canvas" />
      <div className="universe-container" style={{ position: 'relative', zIndex: 2 }}>

        <div className="section-header">
          <span className="section-eyebrow">INTERNAL ACCELERATOR</span>
          <h2 className="section-heading">Want To Bring This Magic In-House?</h2>
          <p className="section-subheading">
            We build your content engine, recruit creators, equip the space, and hand you the keys.
          </p>
        </div>

        <motion.div 
          layout
          className={`ih-interactive-container ${hoveredIdx !== null ? 'has-active-hover' : ''}`}
          onMouseLeave={() => setHoveredIdx(null)}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        >
          <motion.div layout className="ih-orb-grid">
            {categories.map((card, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.7, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{
                  scale: hoveredIdx === null ? 1 : (hoveredIdx === i ? 0.85 : 0.55),
                  opacity: hoveredIdx === null ? 1 : (hoveredIdx === i ? 1 : 0.35),
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 26
                }}
                className={`ih-orb ${hoveredIdx === i ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHoveredIdx(i)}
              >
                <div ref={el => orbRefs.current[i] = el} className="ih-orb-float-wrapper">
                  <div className="ih-orb-glow" />
                  <div className="ih-orb-inner">
                    <span className="ih-orb-num">0{i + 1}</span>
                    <span className="ih-orb-icon">{card.icon}</span>
                    <h3 className="ih-orb-title">{card.title}</h3>
                    <p className="ih-orb-desc">{card.desc}</p>
                  </div>
                  <div className="ih-orb-shine" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatePresence>
            {hoveredIdx !== null && (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="ih-hover-details"
              >
                <span className="ih-details-eyebrow">capability overview</span>
                <span className="ih-details-num">0{hoveredIdx + 1}</span>
                <h3 className="ih-details-title">{categories[hoveredIdx].title}</h3>
                <p className="ih-details-desc">{categories[hoveredIdx].desc}</p>
                
                <div className="ih-details-divider" />
                
                <div className="ih-details-highlights">
                  <span className="ih-highlights-label">Key Highlights</span>
                  <ul className="ih-highlights-list">
                    {categories[hoveredIdx].highlights.map((highlight, idx) => (
                      <li key={idx}>
                        <span className="ih-details-check">✓</span> 
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. SWIRLING PORTAL CTA SECTION
// ═════════════════════════════════════════════════════════════════════════════

function PortalCTA() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 140;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 200 + 10,
        speed: Math.random() * 0.015 + 0.005,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, 120);
      grad.addColorStop(0, 'rgba(228, 241, 65, 0.15)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 120, 0, Math.PI * 2);
      ctx.fill();

      particles.forEach((p) => {
        p.angle += p.speed;
        p.radius -= 0.15;

        if (p.radius <= 10) {
          p.radius = Math.random() * 200 + 10;
          p.angle = Math.random() * Math.PI * 2;
        }

        const x = width / 2 + Math.cos(p.angle) * p.radius;
        const y = height / 2 + Math.sin(p.angle) * p.radius;

        ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : '#E4F141';
        ctx.globalAlpha = p.alpha * (p.radius / 200);
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="portal-section">
      <canvas ref={canvasRef} className="portal-canvas" />

      <div className="portal-content">
        <span className="portal-eyebrow">READY TO ELEVATE?</span>
        <h2 className="portal-heading">Pitch Us Your Idea.</h2>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="portal-btn-wrapper"
        >
          <div className="portal-glow" />
          <Link to="/contact" className="portal-btn">
            Let&apos;s Build Something Big
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. SERVICES SPLIT-VIEW — Fixed 2-col: left=list with shapes, right=detail
//    NO layout shifts on hover. Completely flicker-free.
// ═════════════════════════════════════════════════════════════════════════════

function ServicesShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const detailRef = useRef(null);
  const shapeRefs = useRef([]);
  const lineRef = useRef(null);

  // Animate the detail panel content on change
  useEffect(() => {
    if (detailRef.current) {
      gsap.fromTo(detailRef.current,
        { opacity: 0, x: 30, filter: 'blur(6px)' },
        { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [activeIdx]);

  // Animate shapes on mount
  useEffect(() => {
    shapeRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0, scale: 0, rotate: -90 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.5, delay: i * 0.06, ease: 'back.out(1.7)' }
      );
    });
  }, []);

  const active = ybexServices[activeIdx];

  return (
    <section id="universe" className="universe-section">
      <div className="universe-container">

        <div className="section-header">
          <span className="section-eyebrow">THE CAPABILITIES</span>
          <h2 className="section-heading">Our Services Universe</h2>
          <p className="section-subheading">
            Surgically executed capabilities designed to scale brands, capture attention, and convert.
          </p>
        </div>

        <div className="svc-split">
          {/* LEFT COLUMN — Service list with diamond shapes */}
          <div className="svc-split__list">
            {ybexServices.map((svc, idx) => (
              <div
                key={svc.id}
                className={`svc-item ${activeIdx === idx ? 'svc-item--active' : ''}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '16px' }}>
                  {/* Diamond shape indicator */}
                  <div
                    className="svc-item__shape"
                    ref={el => shapeRefs.current[idx] = el}
                  >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <rect
                        x="14" y="1" width="18.38" height="18.38"
                        transform="rotate(45 14 1)"
                        stroke={activeIdx === idx ? '#E4F141' : 'rgba(255,255,255,0.15)'}
                        strokeWidth="1.5"
                        fill={activeIdx === idx ? 'rgba(228,241,65,0.12)' : 'transparent'}
                        style={{ transition: 'all 0.35s ease' }}
                      />
                    </svg>
                  </div>

                  <div className="svc-item__text" style={{ display: 'flex', flex: 1, alignItems: 'baseline', gap: '10px' }}>
                    <span className="svc-item__num">0{idx + 1}</span>
                    <span className="svc-item__title">{svc.title}</span>
                  </div>

                  <span className="svc-item__stat">{svc.stats}</span>
                </div>

                {/* Mobile-only inline detail panel */}
                {activeIdx === idx && (
                  <div className="svc-item__mobile-detail">
                    <div className="svc-detail__eyebrow">{svc.eyebrow}</div>
                    <h3 className="svc-detail__title">{svc.title}</h3>
                    <p className="svc-detail__desc">{svc.description}</p>

                    <div className="svc-detail__caps">
                      <span className="svc-detail__caps-label">Capabilities</span>
                      <div className="svc-detail__tags">
                        {svc.features.map((f, i) => (
                          <span key={i} className="svc-detail__tag">{f}</span>
                        ))}
                      </div>
                    </div>

                    <div className="svc-detail__benefits">
                      <span className="svc-detail__caps-label">Benefits</span>
                      {svc.benefits.map((b, i) => (
                        <div key={i} className="svc-detail__benefit">
                          <span className="svc-detail__check">✓</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>

                    <div className="svc-detail__stat-box">
                      <span className="svc-detail__stat-label">YBEX IMPACT</span>
                      <strong className="svc-detail__stat-val">{svc.stats}</strong>
                    </div>

                    <Link to="/contact" className="svc-detail__cta" onClick={(e) => e.stopPropagation()}>
                      Get Started <span className="svc-detail__cta-arrow">→</span>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DIVIDER LINE */}
          <div className="svc-split__divider">
            <div className="svc-split__divider-line" ref={lineRef} />
            <motion.div
              className="svc-split__divider-dot"
              animate={{
                top: `${(activeIdx / (ybexServices.length - 1)) * 100}%`
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* RIGHT COLUMN — Detail panel (fixed size, no layout shift) */}
          <div className="svc-split__detail" ref={detailRef} key={activeIdx}>
            <div className="svc-detail__eyebrow">{active.eyebrow}</div>
            <h3 className="svc-detail__title">{active.title}</h3>
            <p className="svc-detail__desc">{active.description}</p>

            <div className="svc-detail__caps">
              <span className="svc-detail__caps-label">Capabilities</span>
              <div className="svc-detail__tags">
                {active.features.map((f, i) => (
                  <motion.span
                    key={`${activeIdx}-${i}`}
                    className="svc-detail__tag"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                  >
                    {f}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="svc-detail__benefits">
              <span className="svc-detail__caps-label">Benefits</span>
              {active.benefits.map((b, i) => (
                <motion.div
                  key={`${activeIdx}-b-${i}`}
                  className="svc-detail__benefit"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <span className="svc-detail__check">✓</span>
                  <span>{b}</span>
                </motion.div>
              ))}
            </div>

            <div className="svc-detail__stat-box">
              <span className="svc-detail__stat-label">YBEX IMPACT</span>
              <strong className="svc-detail__stat-val">{active.stats}</strong>
            </div>

            <Link to="/contact" className="svc-detail__cta">
              Get Started <span className="svc-detail__cta-arrow">→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 7. EXPORT MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

const heroPillars = [
  {
    title: 'PR & Authority',
    icon: '✦',
    desc: 'Build trust with top-tier media placements and clear brand architecture.',
    tags: ['Paid PR', 'Brand Architecture', 'Talent Sourcing']
  },
  {
    title: 'Content & Production',
    icon: '⚡',
    desc: 'Gen-Z driven creative production and trend-aware social media engines.',
    tags: ['Creative Production', 'SMM', 'Content Ecosystem']
  },
  {
    title: 'Tech & Performance',
    icon: '⚙️',
    desc: 'Data-driven performance campaigns, custom websites, and in-house setups.',
    tags: ['Meta & Google Ads', 'Web & Landing Pages', 'Embedded Teams']
  }
];

export default function Services() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

        /* ═════════════════════════════════════════════════════════════════════
           SERVICES PAGE — Black, White, #E4F141 (Lime) Theme
           ═════════════════════════════════════════════════════════════════════ */
        .services-page-wrapper,
        .services-page-wrapper * {
          font-family: 'Montserrat', sans-serif !important;
        }

        .services-page-wrapper {
          background-color: #000000;
          color: #ffffff;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          margin-top: -64px;
        }

        .svc-item__mobile-detail {
          display: none;
          width: 100%;
          padding: 20px 0 0;
          margin-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          animation: slideDown 0.3s ease-out forwards;
          text-align: left;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .svc-item__mobile-detail .svc-detail__eyebrow {
          color: rgba(228, 241, 65, 0.6);
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 8px;
        }

        .svc-item__mobile-detail .svc-detail__title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(1.3rem, 4vw, 1.8rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
          line-height: 1.15;
          color: #ffffff;
        }

        .svc-item__mobile-detail .svc-detail__desc {
          font-size: 0.92rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.65);
          margin: 0 0 24px 0;
          font-weight: 500 !important;
        }

        .svc-item__mobile-detail .svc-detail__caps {
          margin-bottom: 20px;
        }

        .svc-item__mobile-detail .svc-detail__caps-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 12px;
        }

        .svc-item__mobile-detail .svc-detail__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .svc-item__mobile-detail .svc-detail__tag {
          font-size: 0.72rem;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.02em;
        }

        .svc-item__mobile-detail .svc-detail__benefits {
          margin-bottom: 24px;
        }

        .svc-item__mobile-detail .svc-detail__benefit {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }

        .svc-item__mobile-detail .svc-detail__check {
          color: #E4F141;
          font-weight: 900;
        }

        .svc-item__mobile-detail .svc-detail__stat-box {
          padding: 16px 20px;
          border-radius: 12px;
          background: rgba(228, 241, 65, 0.05);
          border: 1px solid rgba(228, 241, 65, 0.15);
          margin-bottom: 24px;
        }

        .svc-item__mobile-detail .svc-detail__stat-label {
          display: block;
          font-size: 0.6rem;
          font-weight: 900;
          color: rgba(228, 241, 65, 0.6);
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .svc-item__mobile-detail .svc-detail__stat-val {
          font-size: 1.4rem;
          font-weight: 900;
          color: #E4F141;
        }

        .svc-item__mobile-detail .svc-detail__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 900;
          color: #E4F141;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          transition: transform 0.2s;
        }

        .svc-item__mobile-detail .svc-detail__cta:hover {
          transform: translateX(4px);
        }

        @media (max-width: 900px) {
          .svc-split {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            min-height: auto !important;
          }
          
          .svc-item {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            padding: 20px !important;
            border-left: 2px solid rgba(255, 255, 255, 0.08) !important;
          }

          .svc-item--active {
            border-left-color: #E4F141 !important;
          }

          .svc-item--active .svc-item__mobile-detail {
            display: block !important;
          }

          .svc-split__detail {
            display: none !important;
          }

          .svc-split__divider {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .services-page-wrapper {
            margin-top: -84px;
          }
        }

        /* ── CINEMATIC LOADER ── */
        .cinematic-loader-container,
        .cinematic-loader-container * {
          font-family: 'Montserrat', sans-serif !important;
        }

        .cinematic-loader-container {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background-color: #000000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          user-select: none;
          will-change: opacity;
        }
        .loader-cycle-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
          max-width: 90%;
        }
        .loader-static-1 {
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(0.95rem, 2.5vw, 1.35rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          line-height: 1.2;
        }
        .loader-static-2 {
          color: #ffffff;
          font-size: clamp(1.4rem, 4vw, 2.6rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          line-height: 1.1;
          margin-bottom: 8px;
        }
        .loader-dynamic {
          font-size: clamp(1.8rem, 5vw, 3.6rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #E4F141;
          text-shadow: 0 0 25px rgba(228, 241, 65, 0.85);
          display: inline-block;
        }

        /* ── BACKGROUND CANVAS ── */
        .galaxy-canvas {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-color: #000000;
        }

        /* ── HERO ── */
        .hero-universe {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          z-index: 10;
          padding: 160px 24px 120px;
          box-sizing: border-box;
          background-color: #000000;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: center top;
        }
        .hero-universe::before {
          content: '';
          position: absolute;
          top: 35%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.055) 0%, transparent 70%);
          pointer-events: none;
          z-index: 1;
        }
        .hero-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1100px;
          margin: 60px auto;
        }
        @media (max-width: 900px) {
          .hero-pillars-grid {
            grid-template-columns: 1fr;
            margin: 40px auto;
          }
        }
        .hero-pillar-card {
          padding: 32px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          text-align: left;
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .hero-pillar-card:hover {
          background: rgba(228, 241, 65, 0.05);
          border-color: rgba(228, 241, 65, 0.3);
          transform: translateY(-8px);
        }
        .hero-pillar-icon {
          font-size: 1.5rem;
          margin-bottom: 16px;
          display: block;
        }
        .hero-pillar-title {
          font-size: 1.1rem;
          font-weight: 800;
          text-transform: uppercase;
          margin: 0 0 12px 0;
          color: #ffffff;
        }
        .hero-pillar-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.5;
          margin: 0 0 20px 0;
        }
        .hero-pillar-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .hero-pillar-tag {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 4px 10px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.5);
        }
        .hero-content {
          position: relative;
          z-index: 20;
          max-width: 1100px;
          width: 100%;
          text-align: center;
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .hero-content {
            padding: 110px 20px 0;
          }
        }
        .hero-eyebrow {
          color: #E4F141;
          font-size: 0.8rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.35em;
          margin-bottom: 16px;
          display: inline-block;
        }
        .hero-heading {
          color: #ffffff;
          font-size: clamp(1.6rem, 3.8vw, 2.5rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 24px;
          margin-top: 0;
          text-shadow: 0 2px 40px rgba(0,0,0,0.5);
        }
        .hero-heading-gradient {
          background: linear-gradient(90deg, #ffffff 0%, #E4F141 50%, #ffffff 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .hero-subheading {
          color: rgba(255, 255, 255, 0.85);
          font-size: clamp(1rem, 2vw, 1.3rem);
          font-weight: 600;
          max-width: 820px;
          margin: 0 auto 40px;
          line-height: 1.6;
          text-shadow: 0 1px 20px rgba(0,0,0,0.6);
        }
        .hero-cta-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        @media (max-width: 640px) {
          .hero-cta-group {
            flex-direction: column;
            width: 100%;
          }
        }
        .btn-primary {
          background-color: #E4F141;
          color: #000000;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          padding: 18px 36px;
          border-radius: 12px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 25px rgba(228, 241, 65, 0.35);
          display: inline-block;
          border: none;
          text-align: center;
          cursor: pointer;
          text-decoration: none;
        }
        .btn-primary:hover {
          background-color: #d4e134;
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .btn-primary {
            width: 100%;
          }
        }
        .btn-secondary {
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          padding: 18px 36px;
          border-radius: 12px;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
          display: inline-block;
          text-align: center;
          cursor: pointer;
          background: rgba(255,255,255,0.05);
          text-decoration: none;
        }
        .btn-secondary:hover {
          border-color: #E4F141;
          color: #E4F141;
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .btn-secondary {
            width: 100%;
          }
        }

        /* ── SCROLL INDICATOR ── */
        .hero-scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0.5;
        }
        .scroll-indicator-text {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.5);
        }
        .scroll-indicator-track {
          width: 4px;
          height: 32px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 99px;
          overflow: hidden;
          position: relative;
        }
        .scroll-indicator-bar {
          width: 100%;
          height: 33%;
          background-color: #E4F141;
          position: absolute;
          top: 0;
        }

        /* ── GENERIC SECTION ── */
        .universe-section {
          position: relative;
          z-index: 10;
          padding: 96px 0;
          background-color: #000000;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .universe-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .section-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .section-eyebrow {
          color: #E4F141;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          margin-bottom: 12px;
          display: block;
        }
        .section-heading {
          color: #ffffff;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1.1;
          margin-bottom: 24px;
          margin-top: 0;
        }
        .section-subheading {
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(0.95rem, 1.8vw, 1.1rem);
          font-weight: 500;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ══════════════════════════════════════════════════════════════
           SERVICES SPLIT VIEW — Fixed 2-column, zero layout shift
           ══════════════════════════════════════════════════════════════ */
        .svc-split {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
          align-items: start;
          min-height: 500px;
        }
        @media (max-width: 900px) {
          .svc-split {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }

        /* Left — Service list */
        .svc-split__list {
          display: flex;
          flex-direction: column;
        }

        .svc-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          cursor: pointer;
          transition: background 0.3s ease;
          border-left: 2px solid transparent;
          position: relative;
        }
        .svc-item:hover {
          background: rgba(228, 241, 65, 0.03);
        }
        .svc-item--active {
          background: rgba(228, 241, 65, 0.05);
          border-left-color: #E4F141;
        }

        .svc-item__shape {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.35s ease;
        }
        .svc-item--active .svc-item__shape {
          transform: rotate(90deg) scale(1.15);
        }

        .svc-item__text {
          flex: 1;
          display: flex;
          align-items: baseline;
          gap: 10px;
          min-width: 0;
        }
        .svc-item__num {
          color: rgba(228, 241, 65, 0.4);
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          transition: color 0.3s;
        }
        .svc-item--active .svc-item__num {
          color: #E4F141;
        }
        .svc-item__title {
          color: rgba(255, 255, 255, 0.6);
          font-size: clamp(0.85rem, 1.5vw, 1.05rem);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          transition: color 0.3s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .svc-item--active .svc-item__title {
          color: #E4F141;
        }
        .svc-item:hover .svc-item__title {
          color: rgba(255,255,255,0.9);
        }
        .svc-item--active:hover .svc-item__title {
          color: #E4F141;
        }

        .svc-item__stat {
          color: rgba(255, 255, 255, 0.15);
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          flex-shrink: 0;
          transition: color 0.3s;
          white-space: nowrap;
        }
        .svc-item--active .svc-item__stat {
          color: rgba(228, 241, 65, 0.35);
        }

        /* Divider between columns */
        .svc-split__divider {
          position: relative;
          width: 1px;
          align-self: stretch;
        }
        .svc-split__divider-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent 0%, rgba(228,241,65,0.2) 20%, rgba(228,241,65,0.2) 80%, transparent 100%);
        }
        .svc-split__divider-dot {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #E4F141;
          box-shadow: 0 0 12px rgba(228,241,65,0.6);
        }
        @media (max-width: 900px) {
          .svc-split__divider {
            display: none;
          }
        }

        /* Right — Detail panel */
        .svc-split__detail {
          padding: 20px 32px;
          will-change: opacity, transform;
        }
        @media (max-width: 900px) {
          .svc-split__detail {
            padding: 0;
          }
        }

        .svc-detail__eyebrow {
          color: rgba(228, 241, 65, 0.6);
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          margin-bottom: 8px;
          display: block;
        }
        .svc-detail__title {
          color: #ffffff;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          line-height: 1.1;
          margin: 0 0 16px 0;
        }
        .svc-detail__desc {
          color: rgba(255, 255, 255, 0.65);
          font-size: 0.9rem;
          font-weight: 500;
          line-height: 1.7;
          margin: 0 0 24px 0;
        }

        .svc-detail__caps {
          margin-bottom: 20px;
        }
        .svc-detail__caps-label {
          display: block;
          color: rgba(228, 241, 65, 0.6);
          font-size: 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 10px;
        }
        .svc-detail__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .svc-detail__tag {
          display: inline-block;
          padding: 5px 14px;
          border: 1px solid rgba(228, 241, 65, 0.15);
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          background: rgba(228, 241, 65, 0.04);
          white-space: nowrap;
        }

        .svc-detail__benefits {
          margin-bottom: 24px;
        }
        .svc-detail__benefit {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 0;
          color: rgba(255,255,255,0.7);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .svc-detail__check {
          color: #E4F141;
          font-weight: 800;
          font-size: 0.8rem;
        }

        .svc-detail__stat-box {
          border: 1px solid rgba(228, 241, 65, 0.12);
          background: rgba(228, 241, 65, 0.03);
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .svc-detail__stat-label {
          color: rgba(228, 241, 65, 0.5);
          font-size: 0.6rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .svc-detail__stat-val {
          color: #E4F141;
          font-size: 1.3rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .svc-detail__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #E4F141;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          text-decoration: none;
          transition: all 0.25s;
          padding: 10px 0;
        }
        .svc-detail__cta:hover {
          letter-spacing: 0.2em;
        }
        .svc-detail__cta-arrow {
          transition: transform 0.25s;
        }
        .svc-detail__cta:hover .svc-detail__cta-arrow {
          transform: translateX(6px);
        }

        /* ══════════════════════════════════════════════════════════════
           IN-HOUSE — Glass Hexagonal Orbs (no card shapes)
           ══════════════════════════════════════════════════════════════ */
        .inhouse-section-wrap {
          position: relative;
          overflow: hidden;
        }
        .inhouse-bg-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.5;
        }

        .ih-interactive-container {
          position: relative;
          width: 100%;
        }
        .ih-interactive-container.has-active-hover {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .ih-interactive-container.has-active-hover {
            grid-template-columns: 1fr;
            gap: 32px;
            align-items: center;
          }
        }

        .ih-orb-grid {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 32px;
        }
        .ih-interactive-container.has-active-hover .ih-orb-grid {
          flex-direction: column;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;
          gap: 0;
          width: 240px;
        }
        @media (max-width: 900px) {
          .ih-interactive-container.has-active-hover .ih-orb-grid {
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            gap: 16px;
          }
        }

        .ih-orb {
          position: relative;
          width: 290px;
          min-width: 290px;
          height: 300px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Default state of non-hovered orbs when hover is active: scale down to 0.55, keep perfect hex shape */
        .ih-interactive-container.has-active-hover .ih-orb:not(.is-hovered) {
          margin: -70px 0; /* vertical overlap to make it look like a honeycomb list */
        }
        @media (max-width: 900px) {
          .ih-interactive-container.has-active-hover .ih-orb:not(.is-hovered) {
            margin: 0 -40px;
          }
        }

        /* Highlighted/Hovered orb: scales to 0.85, full opacity, correct margins */
        .ih-interactive-container.has-active-hover .ih-orb.is-hovered {
          z-index: 10;
          margin: 10px 0;
        }
        @media (max-width: 900px) {
          .ih-interactive-container.has-active-hover .ih-orb.is-hovered {
            transform: scale(0.8);
            margin: 0 10px;
          }
        }

        .ih-orb-float-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Glass morphism hexagonal shape via clip-path */
        .ih-orb-inner {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          padding: 40px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: none;
          transition: background 0.4s ease;
        }
        .ih-orb:hover .ih-orb-inner {
          background: rgba(228, 241, 65, 0.06);
        }

        /* Glowing outline behind hexagon */
        .ih-orb-glow {
          position: absolute;
          inset: -2px;
          z-index: 1;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          background: linear-gradient(135deg, rgba(228,241,65,0.15), rgba(255,255,255,0.05), rgba(228,241,65,0.1));
          transition: all 0.4s ease;
        }
        .ih-orb:hover .ih-orb-glow {
          background: linear-gradient(135deg, rgba(228,241,65,0.35), rgba(255,255,255,0.08), rgba(228,241,65,0.25));
          filter: blur(1px);
        }

        /* Light sweep / shine */
        .ih-orb-shine {
          position: absolute;
          inset: 0;
          z-index: 3;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          background: linear-gradient(
            135deg,
            transparent 30%,
            rgba(255, 255, 255, 0.06) 45%,
            transparent 55%
          );
          pointer-events: none;
          transition: opacity 0.4s;
        }
        .ih-orb:hover .ih-orb-shine {
          opacity: 1.5;
        }

        .ih-orb-num {
          color: rgba(228, 241, 65, 0.5);
          font-size: 0.7rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          margin-bottom: 6px;
          transition: color 0.3s;
        }
        .ih-orb:hover .ih-orb-num {
          color: #E4F141;
        }

        .ih-orb-icon {
          font-size: 1.8rem;
          color: #E4F141;
          margin-bottom: 12px;
          filter: drop-shadow(0 0 6px rgba(228,241,65,0.4));
          transition: transform 0.3s;
        }
        .ih-orb:hover .ih-orb-icon {
          transform: scale(1.2);
        }

        .ih-orb-title {
          color: #ffffff;
          font-size: 1.05rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 10px 0;
          line-height: 1.2;
        }
        .ih-orb-desc {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.82rem;
          font-weight: 500;
          line-height: 1.5;
          margin: 0;
        }

        /* ── INTERACTIVE HOVER DETAILS PANEL ── */
        .ih-hover-details {
          padding: 40px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(228, 241, 65, 0.15);
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          pointer-events: auto;
          margin-left: 40px;
        }

        @media (max-width: 992px) {
          .ih-hover-details {
            padding: 24px;
            margin-top: 16px;
          }
        }
        .ih-details-eyebrow {
          color: #E4F141;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          margin-bottom: 8px;
        }
        .ih-details-num {
          color: rgba(255, 255, 255, 0.15);
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 12px;
          font-family: 'Outfit', sans-serif;
        }
        .ih-details-title {
          color: #ffffff;
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin: 0 0 16px 0;
        }
        .ih-details-desc {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.95rem;
          line-height: 1.65;
          margin: 0 0 24px 0;
          font-weight: 400;
        }
        .ih-details-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, rgba(228, 241, 65, 0.3) 0%, transparent 100%);
          margin-bottom: 24px;
        }
        .ih-details-highlights {
          width: 100%;
        }
        .ih-highlights-label {
          color: rgba(255, 255, 255, 0.45);
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
          display: block;
        }
        .ih-highlights-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ih-highlights-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .ih-details-check {
          color: #E4F141;
          font-weight: 900;
          font-size: 0.9rem;
          filter: drop-shadow(0 0 4px rgba(228, 241, 65, 0.5));
        }

        /* ── SWIRLING PORTAL CTA ── */
        .portal-section {
          position: relative;
          z-index: 10;
          padding: 128px 0;
          background-color: #000000;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 450px;
        }
        .portal-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.7;
        }
        .portal-content {
          position: relative;
          z-index: 10;
          max-width: 900px;
          padding: 0 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .portal-eyebrow {
          color: #E4F141;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          margin-bottom: 16px;
          display: block;
        }
        .portal-heading {
          color: #ffffff;
          font-size: clamp(2rem, 7vw, 4.5rem);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.05em;
          line-height: 1;
          margin-bottom: 32px;
          margin-top: 0;
        }
        .portal-btn-wrapper {
          position: relative;
        }
        .portal-glow {
          position: absolute;
          inset: 0;
          background-color: #E4F141;
          border-radius: 9999px;
          filter: blur(20px);
          opacity: 0.3;
          transition: opacity 0.3s;
        }
        .portal-btn-wrapper:hover .portal-glow {
          opacity: 0.75;
        }
        .portal-btn {
          position: relative;
          background-color: #ffffff;
          color: #000000;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          font-size: clamp(0.8rem, 2vw, 0.95rem);
          padding: 20px 40px;
          border-radius: 9999px;
          display: inline-block;
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.15);
          transition: all 0.3s;
          text-decoration: none;
        }
        .portal-btn:hover {
          background-color: rgba(255, 255, 255, 0.9);
          transform: scale(1.02);
        }

        /* ── HELPER ── */
        .inline-block { display: inline-block; }
      `}</style>

      <AnimatePresence>
        {loading && (
          <CinematicLoader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div className="services-page-wrapper">
        {/* ── HERO SECTION WITH GRID ACCENTS ── */}
        <section className="hero-universe">
          {/* Core Content */}
          <div className="hero-content">
            <span className="hero-eyebrow">YBEX MEDIA SYSTEM</span>
            <h1 className="hero-heading">
              We Design the Future of <span className="hero-heading-gradient">Creative & Influence</span>
            </h1>
            <p className="hero-subheading">
              YBEX builds performance-driven content pipelines, digital systems, and authority frameworks that scale businesses and define modern internet culture.
            </p>

            {/* Interactive Pillars Grid */}
            <motion.div 
              className="hero-pillars-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {heroPillars.map((pillar) => (
                <motion.div 
                  key={pillar.title} 
                  className="hero-pillar-card"
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 80,
                        damping: 12
                      }
                    }
                  }}
                >
                  <span className="hero-pillar-icon">{pillar.icon}</span>
                  <h3 className="hero-pillar-title">{pillar.title}</h3>
                  <p className="hero-pillar-desc">{pillar.desc}</p>
                  <div className="hero-pillar-tags">
                    {pillar.tags.map((tag) => (
                      <span key={tag} className="hero-pillar-tag">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <div className="hero-cta-group">
              <a href="#universe" className="btn-primary">
                Explore Services
              </a>
              <Link to="/contact" className="btn-secondary">
                Pitch Your Ideas
              </Link>
            </div>
          </div>

          {/* Scroll indicators */}
          <div className="hero-scroll-indicator">
            <span className="scroll-indicator-text">Scroll to Explore</span>
            <div className="scroll-indicator-track">
              <motion.div
                animate={{ y: [0, 24, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="scroll-indicator-bar"
              />
            </div>
          </div>
        </section>

        {/* ── SERVICES — Split View (no flicker) ── */}
        <ServicesShowcase />

        {/* In-House — Glass Hexagonal Orbs */}
        <InHouseTeamSection />

        {/* Swirling portal CTA */}
        <PortalCTA />

      </div>
    </>
  );
}