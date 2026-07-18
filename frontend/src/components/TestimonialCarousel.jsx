import React from 'react';

const testimonialsData = [
  {
    name: 'Anshika Thapa',
    role: 'Creator',
    followers: '50K+ Followers',
    quote: 'Had three brand deals lined up with no clue how to price any of them. Ybex handled the entire negotiation and I ended up locking a deal at almost double what I\'d have asked on my own.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2022'
  },
  {
    name: 'Arjun Mehta',
    role: 'Founder, GrowthBox',
    followers: 'Brand Partner',
    quote: 'YBEX helped us scale our influencer campaigns from scratch. Within 3 months, we saw a 6x ROI on our brand campaigns. Their creator network is unmatched.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2022'
  },
  {
    name: 'Priya Sharma',
    role: 'Content Creator',
    followers: '500K+ Followers',
    quote: 'As a creator, finding the right brand collaborations was always tough. YBEX connected me with brands that truly align with my content. My earnings doubled in just 2 months.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2023'
  },
  {
    name: 'Rohit Kapoor',
    role: 'Marketing Head, FreshCart',
    followers: 'Brand Partner',
    quote: 'The YBEX team understands both the brand side and the creator side perfectly. They matched us with creators who genuinely resonated with our audience. Best marketing decision we made.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2021'
  },
  {
    name: 'Sneha Iyer',
    role: 'Lifestyle Creator',
    followers: '1M+ Reach',
    quote: 'YBEX is not just an agency — they are a growth partner. They handle everything from campaign planning to analytics. I just focus on creating great content.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2022'
  },
  {
    name: 'Vikram Desai',
    role: 'CEO, NovaBrand Studios',
    followers: 'Brand Partner',
    quote: 'We partnered with YBEX for our product launch campaign. The results were incredible — 250M+ organic views and a 40% increase in brand awareness within weeks.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2023'
  },
  {
    name: 'Ananya Reddy',
    role: 'Fashion Creator',
    followers: 'Brand Ambassador',
    quote: 'YBEX supported me at every step — from negotiating deals to optimizing my content strategy. They truly care about creator growth, not just brand metrics.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2022'
  },
  {
    name: 'Karan Malhotra',
    role: 'Co-founder, UrbanBite',
    followers: 'Brand Partner',
    quote: 'Working with YBEX transformed our digital presence completely. Their creator-first approach means the content feels authentic, and our customers can tell the difference.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2022'
  },
  {
    name: 'Deepika Nair',
    role: 'Tech Creator',
    followers: '300K+ Community',
    quote: 'The team at YBEX is incredibly professional and responsive. They matched me with tech brands that were a perfect fit. Every collaboration has been smooth and rewarding.',
    stars: 5,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&auto=format',
    since: 'Since 2023'
  },
];

export default function TestimonialCarousel() {
  const doubleTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData, ...testimonialsData];

  const renderQuote = (text) => {
    if (!text.includes('YBEX') && !text.includes('Ybex')) return text;
    const parts = text.split(/(YBEX|Ybex)/);
    return parts.map((part, i) => 
      part.toLowerCase() === 'ybex' ? <strong key={i} className="quote-bold-text">Ybex</strong> : part
    );
  };

  return (
    <section className="ganox-review-section py-20 w-full overflow-hidden flex flex-col items-center justify-center relative">
      <style>{`
        .ganox-review-section {
          background: #000000;
          position: relative;
          width: 100%;
        }

        .ganox-review-section::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.06) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          filter: blur(90px);
          pointer-events: none;
          z-index: 1;
        }

        .ganox-review-section::after {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(228, 241, 65, 0.04) 0%, transparent 70%);
          bottom: -100px;
          right: -100px;
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
        }

        .ganox-review-header {
          text-align: center;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          padding: 0 20px;
        }

        .ganox-title-row-1 {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: relative;
          margin-bottom: 0.4rem;
        }

        .ganox-title-our {
          font-size: clamp(1.8rem, 4.5vw, 2.8rem);
          font-weight: 400;
          color: transparent;
          -webkit-text-stroke: 1.5px #ffffff;
          text-transform: uppercase;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          margin-right: 0.6rem;
          letter-spacing: -0.02em;
        }

        .ganox-title-clients {
          font-size: clamp(2rem, 5.5vw, 3.5rem);
          font-weight: 900;
          color: #ffffff;
          text-transform: lowercase;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.03em;
        }

        .ganox-title-line-right {
          flex-grow: 1;
          height: 1.5px;
          background-color: rgba(255, 255, 255, 0.15);
          margin-left: 1rem;
        }

        .ganox-title-row-2 {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          padding-left: 2%;
          margin-top: -0.2rem;
        }

        .ganox-title-line-left {
          width: clamp(25px, 7vw, 50px);
          height: 1.5px;
          background-color: rgba(255, 255, 255, 0.15);
          margin-right: 1rem;
        }

        .ganox-title-story {
          font-size: clamp(2.2rem, 6vw, 3.6rem);
          font-family: 'Playfair Display', 'Georgia', serif;
          font-style: italic;
          color: #ffffff;
          text-transform: lowercase;
          margin-right: 0.6rem;
          line-height: 1;
        }

        .ganox-title-highlights {
          font-size: clamp(1.5rem, 4vw, 2.4rem);
          font-weight: 700;
          color: #ffffff;
          text-transform: lowercase;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.01em;
        }

        .ganox-carousel-container {
          position: relative;
          width: 100vw;
          max-width: 100%;
          overflow: hidden;
          padding: 16px 0;
          z-index: 10;
        }

        .ganox-carousel-container::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          background: linear-gradient(to right, #000000 0%, transparent 100%);
          z-index: 5;
          pointer-events: none;
        }

        .ganox-carousel-container::after {
          content: '';
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 120px;
          background: linear-gradient(to left, #000000 0%, transparent 100%);
          z-index: 5;
          pointer-events: none;
        }

        .ganox-marquee-track {
          display: flex;
          gap: 20px;
          width: max-content;
          animation: ganox-marquee-scroll 60s linear infinite;
        }

        .ganox-marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes ganox-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .ganox-review-card {
          width: 420px;
          min-height: 380px;
          background: #f8f8f6;
          border-radius: 0 24px 0 0;
          padding: 36px 34px 32px 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          box-shadow: 0 8px 40px rgba(0,0,0,0.18);
          position: relative;
          clip-path: polygon(
            /* Top edge — straight */
            0% 0%, 100% 0%,
            /* Right edge — straight down */
            100% 100%,
            /* Bottom edge — subtle organic torn effect right-to-left */
            97% 99.5%, 95% 100%, 92% 99.1%, 90% 100%, 87% 99.4%,
            85% 100%, 82% 98.9%, 80% 100%, 77% 99.3%, 74% 100%,
            72% 99.6%, 69% 100%, 67% 98.8%, 64% 100%, 62% 99.2%,
            59% 100%, 57% 99.5%, 54% 100%, 51% 98.9%, 49% 100%,
            46% 99.4%, 44% 100%, 41% 99.1%, 38% 100%, 36% 99.6%,
            33% 100%, 31% 98.8%, 28% 100%, 25% 99.3%, 23% 100%,
            20% 99.5%, 18% 100%, 15% 99.1%, 12% 100%, 10% 99.4%,
            7% 100%, 5% 98.9%, 3% 100%, 1% 99.3%, 0% 100%,
            /* Left edge — natural torn paper going bottom-to-top */
            1.5% 97%, 0.3% 95%, 2.2% 93%, 0% 91.5%, 1.8% 89%,
            0.5% 87%, 2.5% 85%, 0.2% 83.5%, 1.4% 81%, 0% 79%,
            2.1% 77%, 0.6% 75.5%, 1.9% 73%, 0.1% 71%, 2.3% 69%,
            0.4% 67.5%, 1.6% 65%, 0% 63%, 2.4% 61%, 0.3% 59.5%,
            1.7% 57%, 0.5% 55%, 2.0% 53%, 0.1% 51.5%, 1.3% 49%,
            0% 47%, 2.2% 45%, 0.6% 43.5%, 1.8% 41%, 0.2% 39%,
            2.5% 37%, 0.4% 35.5%, 1.5% 33%, 0% 31%, 2.1% 29%,
            0.3% 27.5%, 1.9% 25%, 0.5% 23%, 2.3% 21%, 0.1% 19.5%,
            1.6% 17%, 0% 15%, 2.0% 13%, 0.4% 11.5%, 1.4% 9%,
            0.2% 7%, 2.4% 5%, 0.6% 3.5%, 1.8% 2%, 0% 0%
          );
        }

        .ganox-review-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 60px rgba(0,0,0,0.25);
        }

        .card-header-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 22px;
        }

        .card-avatar {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 4px solid #E4F141;
          object-fit: cover;
          flex-shrink: 0;
        }

        .card-reviewer-info {
          display: flex;
          flex-direction: column;
        }

        .card-reviewer-name {
          font-size: 1.28rem;
          font-weight: 800;
          color: #E4F141;
          margin: 0;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          letter-spacing: -0.01em;
        }

        .card-reviewer-role {
          font-size: 0.85rem;
          color: #888888;
          margin: 4px 0 0 0;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          font-weight: 500;
        }

        .card-reviewer-role span {
          font-weight: 700;
          color: #555555;
        }

        .card-quote-text {
          font-size: 1.08rem;
          line-height: 1.7;
          color: #222222;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          margin: 0 0 26px 0;
          font-weight: 400;
        }

        .quote-bold-text {
          color: #111111;
          font-weight: 800;
        }

        .card-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-bottom: 32px;
        }

        .card-stars-row {
          display: flex;
          gap: 5px;
        }

        .card-star-icon {
          width: 30px;
          height: 30px;
          fill: #E4F141;
        }

        .card-badge-since {
          background-color: #E4F141;
          color: #000000;
          padding: 7px 16px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
        }

        @media (max-width: 768px) {
          .ganox-review-card {
            width: 320px;
            min-height: 340px;
            padding: 28px 24px 0 36px;
          }
          .card-avatar {
            width: 70px;
            height: 70px;
          }
          .card-reviewer-name {
            font-size: 1.08rem;
          }
          .card-quote-text {
            font-size: 0.95rem;
          }
          .card-star-icon {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>

      {/* Header — ganox removed */}
      <div className="ganox-review-header">
        <div className="ganox-title-row-1">
          <span className="ganox-title-our">Our</span>
          <span className="ganox-title-clients">clients</span>
          <span className="ganox-title-line-right"></span>
        </div>
        <div className="ganox-title-row-2">
          <span className="ganox-title-line-left"></span>
          <span className="ganox-title-story">story</span>
          <span className="ganox-title-highlights">highlights</span>
        </div>
      </div>

      {/* Scrolling Carousel of cards */}
      <div className="ganox-carousel-container">
        <div className="ganox-marquee-track">
          {doubleTestimonials.map((item, idx) => (
            <div key={idx} className="ganox-review-card">
              <div>
                <div className="card-header-row">
                  <img src={item.avatar} alt={item.name} className="card-avatar" />
                  <div className="card-reviewer-info">
                    <h4 className="card-reviewer-name">{item.name}</h4>
                    <p className="card-reviewer-role">
                      {item.role} {item.followers && <span>• {item.followers}</span>}
                    </p>
                  </div>
                </div>
                <p className="card-quote-text">{renderQuote(item.quote)}</p>
              </div>
              <div className="card-footer-row">
                <div className="card-stars-row">
                  {[...Array(item.stars)].map((_, i) => (
                    <svg key={i} className="card-star-icon" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <div className="card-badge-since">
                  {item.since || 'Since 2022'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
