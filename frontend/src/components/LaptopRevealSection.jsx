import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

const ACCENT = '#E4F141';

export default function LaptopRevealSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll progress to lid rotation: 90deg (closed flat) → 0deg (fully open)
  const lidRotation = useTransform(scrollYProgress, [0.15, 0.55], [90, 0]);
  // Shadow intensity increases as lid opens
  const lidShadowOpacity = useTransform(scrollYProgress, [0.15, 0.55], [0, 0.6]);
  // Screen content fades in as lid opens
  const screenOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="laptop-reveal-section"
    >
      <style>{`
        .laptop-reveal-section {
          min-height: 130vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #000000;
          padding: 120px 20px 80px 20px;
          position: relative;
          overflow: hidden;
        }

        .laptop-wrapper {
          perspective: 1800px;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .accent-yellow-text {
          color: #E4F141 !important;
          text-shadow: 0 0 25px rgba(228, 241, 65, 0.25);
        }

        /* The screen lid that rotates open */
        .laptop-lid {
          width: 100%;
          transform-origin: bottom center;
          position: relative;
          z-index: 2;
        }

        .laptop-screen-frame {
          background: #1a1a1a;
          border-radius: 16px 16px 0 0;
          border: 2px solid #333;
          border-bottom: none;
          overflow: hidden;
          position: relative;
          aspect-ratio: 16 / 10;
        }

        /* Bezel top bar with camera dot */
        .screen-bezel {
          height: 28px;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 5;
        }

        .camera-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #444;
          border: 1px solid #555;
        }

        /* Blurred dashboard content */
        .screen-content {
          position: relative;
          width: 100%;
          height: calc(100% - 28px);
          background: linear-gradient(135deg, #f5f0ff 0%, #e8e0f5 40%, #f0e6ff 100%);
          overflow: hidden;
        }

        .dashboard-blur {
          filter: blur(1.5px);
          opacity: 0.85;
          width: 100%;
          height: 100%;
          padding: 16px;
          display: flex;
          gap: 12px;
          background: linear-gradient(135deg, #f3eefc 0%, #e5daf7 100%);
        }

        .dash-sidebar {
          width: 50px;
          background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0;
          gap: 14px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(91,33,182,0.15);
        }

        .dash-sidebar-icon {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .dash-sidebar-icon.active {
          background: rgba(255,255,255,0.25);
          color: #ffffff;
          box-shadow: 0 0 10px rgba(255,255,255,0.1);
        }

        .dash-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dash-title {
          font-size: 1.05rem;
          font-weight: 900;
          color: #1e1b4b;
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.02em;
        }

        .dash-date-pills {
          display: flex;
          gap: 6px;
        }

        .dash-date-pill {
          padding: 3px 8px;
          background: #ffffff;
          border-radius: 6px;
          font-size: 0.55rem;
          color: #6366f1;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .dash-stats-row {
          display: flex;
          gap: 8px;
        }

        .dash-stat-card {
          flex: 1;
          background: #ffffff;
          border-radius: 12px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          border: 1px solid rgba(255,255,255,0.7);
        }

        .dash-stat-icon-wrapper {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dash-stat-icon-wrapper.blue { background: rgba(59,130,246,0.1); color: #2563eb; }
        .dash-stat-icon-wrapper.purple { background: rgba(168,85,247,0.1); color: #7c3aed; }
        .dash-stat-icon-wrapper.red { background: rgba(239,68,68,0.1); color: #dc2626; }
        .dash-stat-icon-wrapper.amber { background: rgba(245,158,11,0.1); color: #d97706; }

        .dash-stat-val {
          font-size: 0.85rem;
          font-weight: 900;
          color: #1e1b4b;
          line-height: 1.1;
        }

        .dash-stat-label {
          font-size: 0.5rem;
          color: #6b7280;
          font-weight: 600;
        }

        .dash-panels-row {
          display: flex;
          gap: 10px;
          flex: 1;
        }

        .dash-panel {
          flex: 1;
          background: #ffffff;
          border-radius: 14px;
          padding: 10px 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          border: 1px solid rgba(255,255,255,0.7);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .dash-panel-header {
          font-size: 0.65rem;
          font-weight: 800;
          color: #1e1b4b;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 4px;
        }

        /* Coming Soon Overlay */
        .coming-soon-overlay {
          position: absolute;
          inset: 28px 0 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          background: rgba(15,10,25,0.18);
          backdrop-filter: blur(1px);
        }

        .coming-soon-text {
          font-size: clamp(1.6rem, 4vw, 2.8rem);
          font-weight: 900;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 60px rgba(228,241,65,0.3);
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }

        /* Laptop base / keyboard */
        .laptop-base {
          width: 104%;
          height: 14px;
          background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
          border-radius: 0 0 10px 10px;
          border: 2px solid #333;
          border-top: 1px solid #444;
          position: relative;
          z-index: 3;
        }

        .laptop-base::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 2px;
          transform: translateX(-50%);
          width: 60px;
          height: 4px;
          background: #444;
          border-radius: 0 0 4px 4px;
        }

        /* Surface shadow beneath the laptop */
        .laptop-shadow {
          width: 90%;
          height: 20px;
          background: radial-gradient(ellipse, rgba(228,241,65,0.1) 0%, transparent 70%);
          filter: blur(12px);
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .laptop-reveal-section {
            min-height: 90vh;
            padding: 80px 16px 60px 16px;
          }
          .laptop-wrapper {
            max-width: 100%;
          }
          .dash-sidebar {
            width: 28px;
            padding: 8px 0;
            gap: 10px;
            border-radius: 8px;
          }
          .dash-sidebar-icon {
            width: 16px;
            height: 16px;
            border-radius: 4px;
          }
          .dash-sidebar-icon svg {
            width: 10px;
            height: 10px;
          }
          .dash-main {
            gap: 6px;
          }
          .dash-title {
            font-size: 0.65rem;
          }
          .dash-date-pill {
            padding: 2px 5px;
            font-size: 0.35rem;
          }
          .dash-stat-card {
            padding: 4px 6px;
            gap: 4px;
            border-radius: 8px;
          }
          .dash-stat-icon-wrapper {
            width: 14px;
            height: 14px;
            border-radius: 4px;
          }
          .dash-stat-icon-wrapper svg {
            width: 9px;
            height: 9px;
          }
          .dash-stat-val {
            font-size: 0.55rem;
          }
          .dash-stat-label {
            font-size: 0.35rem;
            line-height: 1;
          }
          .dash-panel {
            padding: 6px;
            border-radius: 8px;
          }
          .dash-panel-header {
            font-size: 0.45rem;
            margin-bottom: 4px;
            padding-bottom: 2px;
          }
          .coming-soon-text {
            font-size: 1.1rem;
            letter-spacing: 0.15em;
          }
        }
`}</style>

      {/* Heading Block above the Laptop Animation */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-20 max-w-4xl z-10 px-4"
      >
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none">
          Something new is happening <br /> in the <span className="accent-yellow-text">creator economy</span>.
        </h2>
        <p className="text-white/50 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          The future of transparent brand & creator collaborations is almost here.
        </p>
      </motion.div>

      <div className="laptop-wrapper">
        {/* Laptop Lid (rotates open on scroll) */}
        <motion.div
          className="laptop-lid"
          style={{
            rotateX: lidRotation,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="laptop-screen-frame">
            {/* Bezel */}
            <div className="screen-bezel">
              <div className="camera-dot" />
            </div>

            {/* Dashboard Content (blurred) */}
                        <motion.div className="screen-content" style={{ opacity: screenOpacity }}>
              <div className="dashboard-blur">
                {/* Sidebar */}
                <div className="dash-sidebar">
                  <div className="dash-sidebar-icon active">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                  <div className="dash-sidebar-icon">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  <div className="dash-sidebar-icon">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div className="dash-sidebar-icon">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                  </div>
                  <div className="dash-sidebar-icon">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </div>
                </div>

                {/* Main Dashboard Area */}
                <div className="dash-main">
                  <div className="dash-header">
                    <div className="dash-title">Campaign Manager</div>
                    <div className="dash-date-pills">
                      <span className="dash-date-pill">Q3 Live</span>
                      <span className="dash-date-pill">Global Analytics</span>
                    </div>
                  </div>

                  <div className="dash-stats-row">
                    <div className="dash-stat-card">
                      <div className="dash-stat-icon-wrapper blue">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="dash-stat-val">500+</div>
                        <div className="dash-stat-label">Brands</div>
                      </div>
                    </div>
                    
                    <div className="dash-stat-card">
                      <div className="dash-stat-icon-wrapper purple">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div>
                        <div className="dash-stat-val">10K+</div>
                        <div className="dash-stat-label">Creators</div>
                      </div>
                    </div>

                    <div className="dash-stat-card">
                      <div className="dash-stat-icon-wrapper red">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          <path d="M2 12h20"/>
                        </svg>
                      </div>
                      <div>
                        <div className="dash-stat-val">250M+</div>
                        <div className="dash-stat-label">Reach</div>
                      </div>
                    </div>

                    <div className="dash-stat-card">
                      <div className="dash-stat-icon-wrapper amber">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </div>
                      <div>
                        <div className="dash-stat-val">98%</div>
                        <div className="dash-stat-label">Client Match</div>
                      </div>
                    </div>
                  </div>

                  <div className="dash-panels-row">
                    {/* Left Panel: Detailed Area Chart */}
                    <div className="dash-panel">
                      <div className="dash-panel-header">Campaign Reports</div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="relative w-full overflow-hidden mt-1 select-none" style={{ height: '56px' }}>
                          <svg viewBox="0 0 400 120" className="w-full h-full" style={{ overflow: 'visible' }}>
                            <defs>
                              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.35" />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            <line x1="0" y1="20" x2="400" y2="20" stroke="#e8e2f2" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="0" y1="60" x2="400" y2="60" stroke="#e8e2f2" strokeWidth="1" strokeDasharray="3 3" />
                            <line x1="0" y1="100" x2="400" y2="100" stroke="#e8e2f2" strokeWidth="1" strokeDasharray="3 3" />
                            
                            {/* Area fill */}
                            <path d="M 0 100 L 0 75 Q 50 50 100 65 T 200 35 T 300 45 T 400 20 L 400 100 Z" fill="url(#chartGrad)" />
                            
                            {/* Spline line */}
                            <path d="M 0 75 Q 50 50 100 65 T 200 35 T 300 45 T 400 20" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
                            
                            {/* Glowing Vertex circles */}
                            <circle cx="100" cy="65" r="3.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.2" />
                            <circle cx="200" cy="35" r="3.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.2" />
                            <circle cx="300" cy="45" r="3.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.2" />
                            <circle cx="400" cy="20" r="3.5" fill="#7c3aed" stroke="#ffffff" strokeWidth="1.2" />
                          </svg>
                        </div>
                        
                        {/* Active campaigns mini tracker */}
                        <div className="space-y-1 mt-1 border-t pt-1.5 border-slate-100">
                          <div className="flex items-center justify-between text-[6.5px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                            <span>Campaign</span>
                            <span>Progress</span>
                            <span>Reach</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-[8px] leading-tight">
                            <span className="font-bold text-slate-700">Nike Jordan UGC</span>
                            <div className="w-14 bg-slate-100 h-1 rounded-full overflow-hidden mx-1.5 flex-1 max-w-[80px]">
                              <div className="bg-purple-600 h-full rounded-full" style={{ width: '85%' }} />
                            </div>
                            <span className="font-mono text-purple-600 font-bold">14.8M</span>
                          </div>

                          <div className="flex items-center justify-between text-[8px] leading-tight">
                            <span className="font-bold text-slate-700">Spotify Premium</span>
                            <div className="w-14 bg-slate-100 h-1 rounded-full overflow-hidden mx-1.5 flex-1 max-w-[80px]">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: '48%' }} />
                            </div>
                            <span className="font-mono text-amber-500 font-bold">6.2M</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Donut Chart with Segment Legend */}
                    <div className="dash-panel">
                      <div className="dash-panel-header">Platform Share</div>
                      
                      <div className="flex-1 flex items-center justify-center gap-4 py-1">
                        <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* Track background */}
                            <circle cx="50" cy="50" r="38" stroke="#f1edf7" strokeWidth="10" fill="none" />
                            {/* YouTube Segment (Red) */}
                            <circle cx="50" cy="50" r="38" stroke="#ef4444" strokeWidth="10" fill="none"
                                    strokeDasharray="238.76" strokeDashoffset="120" strokeLinecap="round" />
                            {/* Instagram Segment (Purple) */}
                            <circle cx="50" cy="50" r="38" stroke="#8b5cf6" strokeWidth="10" fill="none"
                                    strokeDasharray="238.76" strokeDashoffset="180" strokeLinecap="round" />
                            {/* TikTok Segment (Amber) */}
                            <circle cx="50" cy="50" r="38" stroke="#f59e0b" strokeWidth="10" fill="none"
                                    strokeDasharray="238.76" strokeDashoffset="220" strokeLinecap="round" />
                          </svg>
                          <div className="absolute text-center">
                            <div className="text-[9px] font-black text-slate-800 leading-none">84.2%</div>
                            <div className="text-[5px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">CTR</div>
                          </div>
                        </div>

                        {/* Custom Legends list */}
                        <div className="flex flex-col justify-center gap-1.5 flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            <span className="text-[7.5px] font-bold text-slate-500 whitespace-nowrap">YouTube (48%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                            <span className="text-[7.5px] font-bold text-slate-500 whitespace-nowrap">Instagram (36%)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            <span className="text-[7.5px] font-bold text-slate-500 whitespace-nowrap">TikTok (16%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coming Soon overlay */}
              <div className="coming-soon-overlay">
                <span className="coming-soon-text">Coming Soon</span>
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Laptop Base */}
        <motion.div
          className="laptop-base"
          style={{
            boxShadow: useTransform(
              lidShadowOpacity,
              (v) => `0 10px 40px rgba(0,0,0,${v})`
            ),
          }}
        />

        {/* Surface shadow */}
        <div className="laptop-shadow" />
      </div>
    </section>
  );
}
