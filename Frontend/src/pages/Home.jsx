import { useEffect, useRef } from 'react'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0d0d0d;
    --paper: #f7f5f0;
    --accent: #1a6b4a;
    --accent2: #e8673a;
    --muted: #6b6b63;
    --border: #e0ddd5;
    --card: #ffffff;
    --serif: 'DM Serif Display', Georgia, serif;
    --sans: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  .dt-body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    font-weight: 400;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* NAV */
  .dt-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 48px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(247,245,240,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .dt-nav-logo { font-family: var(--serif); font-size: 1.2rem; color: var(--ink); }
  .dt-nav-logo span { color: var(--accent); }
  .dt-nav-links { display: flex; align-items: center; gap: 32px; }
  .dt-nav-links a {
    font-size: 0.875rem; color: var(--muted); text-decoration: none; transition: color 0.2s;
  }
  .dt-nav-links a:hover { color: var(--ink); }
  .dt-nav-cta {
    background: var(--ink); color: #fff;
    padding: 10px 22px; border-radius: 100px;
    font-size: 0.875rem; font-weight: 500; text-decoration: none;
    transition: background 0.2s, transform 0.15s;
  }
  .dt-nav-cta:hover { background: var(--accent); transform: translateY(-1px); }

  /* HERO */
  .dt-hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 48px 80px;
    position: relative; overflow: hidden;
  }
  .dt-hero-bg { position: absolute; inset: 0; pointer-events: none; }
  .dt-circle {
    position: absolute; border-radius: 50%; opacity: 0.06;
  }
  .dt-circle-1 { width: 600px; height: 600px; background: var(--accent); top: -100px; right: -150px; }
  .dt-circle-2 { width: 400px; height: 400px; background: var(--accent2); bottom: -100px; left: -80px; }

  .dt-hero-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center;
    max-width: 1200px; margin: 0 auto; width: 100%;
  }

  .dt-hero-label {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.75rem; font-weight: 500;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 24px;
  }
  .dt-hero-label::before { content: ''; width: 24px; height: 1px; background: var(--accent); }

  .dt-h1 {
    font-family: var(--serif);
    font-size: clamp(2.6rem, 5vw, 4.2rem);
    line-height: 1.1; letter-spacing: -0.02em;
    color: var(--ink); margin-bottom: 24px;
  }
  .dt-h1 em { font-style: italic; color: var(--accent); }

  .dt-hero-desc {
    font-size: 1.05rem; color: var(--muted);
    line-height: 1.7; max-width: 420px; margin-bottom: 40px;
  }

  .dt-hero-actions { display: flex; align-items: center; gap: 16px; }

  .dt-btn-primary {
    background: var(--ink); color: #fff;
    padding: 14px 30px; border-radius: 100px;
    font-size: 0.9rem; font-weight: 500; text-decoration: none;
    display: inline-flex; align-items: center; gap: 8px;
    transition: background 0.2s, transform 0.15s;
  }
  .dt-btn-primary:hover { background: var(--accent); transform: translateY(-2px); }

  .dt-btn-secondary {
    color: var(--ink); font-size: 0.9rem; text-decoration: none;
    display: inline-flex; align-items: center; gap: 6px;
    border-bottom: 1px solid var(--border); padding-bottom: 2px;
    transition: border-color 0.2s;
  }
  .dt-btn-secondary:hover { border-color: var(--ink); }

  /* HERO CARDS */
  .dt-hero-visual { position: relative; }

  .dt-card-main {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.07);
    position: relative; z-index: 2;
    animation: dtFloatUp 6s ease-in-out infinite;
  }
  .dt-card-tag {
    font-size: 0.7rem; font-weight: 500; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 12px;
  }
  .dt-route { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .dt-route-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); flex-shrink: 0; }
  .dt-route-dot-end { width: 10px; height: 10px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }
  .dt-route-line { flex: 1; height: 1px; background: var(--border); position: relative; }
  .dt-route-line::after {
    content: ''; position: absolute;
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent2); border: 2px solid var(--paper);
  }
  .dt-route-labels {
    display: flex; justify-content: space-between;
    font-size: 0.78rem; color: var(--muted); margin-bottom: 20px;
  }
  .dt-route-labels strong { color: var(--ink); font-weight: 500; }

  .dt-travellers { display: flex; align-items: center; margin-bottom: 16px; }
  .dt-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    border: 2px solid var(--paper);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 500; color: #fff;
    margin-left: -8px;
  }
  .dt-avatar:first-child { margin-left: 0; }
  .dt-av1 { background: #1a6b4a; }
  .dt-av2 { background: #e8673a; }
  .dt-av3 { background: #4a6ee8; }
  .dt-av4 { background: #b84aaa; }
  .dt-travellers-info { font-size: 0.82rem; color: var(--muted); margin-left: 8px; }
  .dt-travellers-info strong { color: var(--ink); }

  .dt-fare-row {
    background: #f0faf5; border-radius: 10px; padding: 14px 16px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .dt-fare-label { font-size: 0.78rem; color: var(--muted); }
  .dt-fare-discount { font-size: 0.72rem; color: var(--accent); margin-top: 2px; }
  .dt-fare-amount { font-family: var(--serif); font-size: 1.4rem; color: var(--accent); line-height: 1; }
  .dt-fare-was { font-size: 0.72rem; color: var(--muted); text-decoration: line-through; margin-top: 2px; text-align: right; }

  .dt-card-poi {
    position: absolute; bottom: -24px; right: -24px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 14px 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    width: 210px; z-index: 3;
    animation: dtFloatRight 7s ease-in-out infinite 1s;
  }
  .dt-poi-tag { font-size: 0.65rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent2); margin-bottom: 6px; }
  .dt-poi-name { font-size: 0.88rem; font-weight: 500; color: var(--ink); margin-bottom: 4px; }
  .dt-poi-desc { font-size: 0.72rem; color: var(--muted); line-height: 1.4; }

  .dt-card-users {
    position: absolute; top: -20px; left: -20px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 14px; padding: 12px 16px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08); z-index: 3;
    animation: dtFloatLeft 5.5s ease-in-out infinite 0.5s;
  }
  .dt-users-row { display: flex; align-items: center; gap: 8px; }
  .dt-green-dot { width: 8px; height: 8px; border-radius: 50%; background: #1a6b4a; animation: dtPulse 2s infinite; }
  .dt-users-text { font-size: 0.78rem; color: var(--muted); }
  .dt-users-text strong { color: var(--ink); }

  @keyframes dtFloatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes dtFloatRight { 0%,100%{transform:translate(0,0)} 50%{transform:translate(4px,-6px)} }
  @keyframes dtFloatLeft { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-4px,6px)} }
  @keyframes dtPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }

  /* STATS */
  .dt-stats {
    padding: 60px 48px;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  }
  .dt-stats-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(4,1fr); gap: 40px;
  }
  .dt-stat { text-align: center; }
  .dt-stat-num { font-family: var(--serif); font-size: 2.8rem; color: var(--ink); line-height: 1; margin-bottom: 6px; }
  .dt-stat-num span { color: var(--accent); }
  .dt-stat-label { font-size: 0.82rem; color: var(--muted); }

  /* HOW IT WORKS */
  .dt-how { padding: 100px 48px; max-width: 1200px; margin: 0 auto; }
  .dt-section-label {
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .dt-section-label::before { content: ''; width: 24px; height: 1px; background: var(--accent); }
  .dt-h2 {
    font-family: var(--serif);
    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.15; letter-spacing: -0.02em;
    color: var(--ink); margin-bottom: 48px;
  }
  .dt-h2 em { font-style: italic; color: var(--accent); }

  .dt-steps { display: grid; grid-template-columns: repeat(4,1fr); gap: 32px; position: relative; }
  .dt-steps::before {
    content: ''; position: absolute; top: 28px; left: 10%; right: 10%;
    height: 1px; background: var(--border); z-index: 0;
  }
  .dt-step { position: relative; z-index: 1; }
  .dt-step-num {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--card); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--serif); font-size: 1.2rem; color: var(--ink);
    margin-bottom: 20px; transition: background 0.2s, color 0.2s;
  }
  .dt-step:hover .dt-step-num { background: var(--ink); color: var(--paper); }
  .dt-step-title { font-size: 0.95rem; font-weight: 500; color: var(--ink); margin-bottom: 8px; }
  .dt-step-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }

  /* FEATURES */
  .dt-features { padding: 80px 48px; background: var(--ink); }
  .dt-features-inner { max-width: 1200px; margin: 0 auto; }
  .dt-features .dt-section-label { color: #6ec99a; }
  .dt-features .dt-section-label::before { background: #6ec99a; }
  .dt-features .dt-h2 { color: var(--paper); }
  .dt-features .dt-h2 em { color: #6ec99a; }
  .dt-features-grid {
    display: grid; grid-template-columns: repeat(3,1fr);
    gap: 1px; background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden;
  }
  .dt-feature-card { padding: 36px; background: var(--ink); transition: background 0.2s; cursor: default; }
  .dt-feature-card:hover { background: #161616; }
  .dt-feature-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: rgba(255,255,255,0.06);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px; font-size: 1.2rem;
  }
  .dt-feature-title { font-size: 0.95rem; font-weight: 500; color: var(--paper); margin-bottom: 8px; }
  .dt-feature-desc { font-size: 0.82rem; color: rgba(247,245,240,0.5); line-height: 1.6; }

  /* FARE SECTION */
  .dt-fare-section {
    padding: 100px 48px; max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  }
  .dt-fare-visual { background: var(--card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
  .dt-fare-header {
    padding: 24px 28px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .dt-fare-header-title { font-size: 0.9rem; font-weight: 500; color: var(--ink); }
  .dt-fare-badge {
    font-size: 0.7rem; font-weight: 500;
    background: #e8f5ef; color: var(--accent);
    padding: 4px 10px; border-radius: 100px;
  }
  .dt-fare-bars { padding: 28px; }
  .dt-fare-bar-item { margin-bottom: 20px; }
  .dt-fare-bar-label { display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 8px; }
  .dt-fare-bar-label span:first-child { color: var(--muted); }
  .dt-fare-bar-label span:last-child { font-weight: 500; color: var(--ink); }
  .dt-fare-bar-track { height: 8px; background: #f0ede6; border-radius: 100px; overflow: hidden; }
  .dt-fare-bar-fill { height: 100%; border-radius: 100px; }
  .dt-fill-green { background: var(--accent); }
  .dt-fill-orange { background: var(--accent2); }
  .dt-fill-blue { background: #4a6ee8; }
  .dt-fare-saving {
    padding: 20px 28px; background: #f0faf5;
    border-top: 1px solid #d5eee2;
    display: flex; justify-content: space-between; align-items: center;
  }
  .dt-saving-label { font-size: 0.82rem; color: var(--muted); }
  .dt-saving-amount { font-family: var(--serif); font-size: 1.8rem; color: var(--accent); }

  /* REVIEWS */
  .dt-reviews { padding: 100px 48px; background: #f2efe9; }
  .dt-reviews-inner { max-width: 1200px; margin: 0 auto; }
  .dt-reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; margin-top: 48px; }
  .dt-review-card {
    background: var(--card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .dt-review-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
  .dt-review-stars { color: var(--accent2); font-size: 0.9rem; margin-bottom: 14px; letter-spacing: 2px; }
  .dt-review-text { font-size: 0.88rem; color: var(--ink); line-height: 1.7; margin-bottom: 20px; }
  .dt-review-author { display: flex; align-items: center; gap: 10px; }
  .dt-review-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 500; color: #fff;
  }
  .dt-review-name { font-size: 0.82rem; font-weight: 500; color: var(--ink); }
  .dt-review-meta { font-size: 0.72rem; color: var(--muted); }

  /* CTA */
  .dt-cta { padding: 100px 48px; text-align: center; }
  .dt-cta-inner { max-width: 600px; margin: 0 auto; }
  .dt-cta .dt-h2 { margin-bottom: 20px; }
  .dt-cta-desc { color: var(--muted); margin-bottom: 36px; font-size: 1rem; }
  .dt-cta-form { display: flex; gap: 12px; max-width: 420px; margin: 0 auto; }
  .dt-cta-input {
    flex: 1; padding: 14px 20px;
    border: 1px solid var(--border); border-radius: 100px;
    font-size: 0.9rem; font-family: var(--sans);
    background: var(--card); color: var(--ink); outline: none;
    transition: border-color 0.2s;
  }
  .dt-cta-input:focus { border-color: var(--accent); }
  .dt-cta-input::placeholder { color: var(--muted); }

  /* FOOTER */
  .dt-footer {
    padding: 40px 48px; border-top: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
  }
  .dt-footer-logo { font-family: var(--serif); font-size: 1rem; color: var(--ink); }
  .dt-footer-logo span { color: var(--accent); }
  .dt-footer-links { display: flex; gap: 24px; }
  .dt-footer-links a { font-size: 0.78rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .dt-footer-links a:hover { color: var(--ink); }
  .dt-footer-copy { font-size: 0.72rem; color: var(--muted); }

  /* FADE IN */
  .dt-fade { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .dt-fade.visible { opacity: 1; transform: none; }
`

export default function Home() {
  const bodyRef = useRef(null)

  useEffect(() => {
    // Inject styles
    const styleEl = document.createElement('style')
    styleEl.innerHTML = styles
    document.head.appendChild(styleEl)

    // Scroll fade-in observer
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 }
    )
    document.querySelectorAll('.dt-fade').forEach(el => observer.observe(el))

    return () => {
      document.head.removeChild(styleEl)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="dt-body" ref={bodyRef}>

      {/* NAV */}
      <nav className="dt-nav">
        <div className="dt-nav-logo">Destination<span>Together</span></div>
        <div className="dt-nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#fare">Fare calculator</a>
          <a href="#reviews">Reviews</a>
          <a href="/login" className="dt-nav-cta">Join now</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="dt-hero">
        <div className="dt-hero-bg">
          <div className="dt-circle dt-circle-1" />
          <div className="dt-circle dt-circle-2" />
        </div>
        <div className="dt-hero-grid">
          <div className="dt-hero-text dt-fade">
            <div className="dt-hero-label">Collaborative travel</div>
            <h1 className="dt-h1">Travel smarter,<br /><em>together.</em></h1>
            <p className="dt-hero-desc">
              Find fellow travellers heading to the same destination. Share rides, split fares,
              and discover places along the way — powered by AI.
            </p>
            <div className="dt-hero-actions">
              <a href="/login" className="dt-btn-primary">
                Get started free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <a href="#how" className="dt-btn-secondary">See how it works</a>
            </div>
          </div>

          <div className="dt-hero-visual dt-fade" style={{ transitionDelay: '0.2s' }}>
            <div className="dt-card-users">
              <div className="dt-users-row">
                <div className="dt-green-dot" />
                <div className="dt-users-text"><strong>4 people</strong> near you heading to Miami</div>
              </div>
            </div>

            <div className="dt-card-main">
              <div className="dt-card-tag">🗓 Trip on Dec 24 · New York → Miami</div>
              <div className="dt-route">
                <div className="dt-route-dot" />
                <div className="dt-route-line" />
                <div className="dt-route-dot-end" />
              </div>
              <div className="dt-route-labels">
                <div><strong>New York, NY</strong><br />08:00 AM</div>
                <div style={{ textAlign: 'right' }}><strong>Miami, FL</strong><br />~19 hrs</div>
              </div>
              <div className="dt-travellers">
                <div className="dt-avatar dt-av1">JC</div>
                <div className="dt-avatar dt-av2">SM</div>
                <div className="dt-avatar dt-av3">DN</div>
                <div className="dt-avatar dt-av4">+2</div>
                <span className="dt-travellers-info"><strong>6 travelers</strong> matched</span>
              </div>
              <div className="dt-fare-row">
                <div>
                  <div className="dt-fare-label">Per person fare</div>
                  <div className="dt-fare-discount">↓ 38% group discount applied</div>
                </div>
                <div>
                  <div className="dt-fare-amount">$85</div>
                  <div className="dt-fare-was">$340</div>
                </div>
              </div>
            </div>

            <div className="dt-card-poi">
              <div className="dt-poi-tag">🤖 AI suggestion · On your route</div>
              <div className="dt-poi-name">Savannah, GA</div>
              <div className="dt-poi-desc">A stunning historic city right on your route. Perfect for a lunch stop!</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="dt-stats dt-fade">
        <div className="dt-stats-inner">
          <div className="dt-stat"><div className="dt-stat-num">48<span>K+</span></div><div className="dt-stat-label">Trips completed</div></div>
          <div className="dt-stat"><div className="dt-stat-num">240<span>K+</span></div><div className="dt-stat-label">Registered users</div></div>
          <div className="dt-stat"><div className="dt-stat-num">38<span>%</span></div><div className="dt-stat-label">Avg. fare savings</div></div>
          <div className="dt-stat"><div className="dt-stat-num">4<span>.8★</span></div><div className="dt-stat-label">Average rating</div></div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="dt-how" id="how">
        <div className="dt-section-label">Process</div>
        <h2 className="dt-h2">Four steps to your<br /><em>next adventure</em></h2>
        <div className="dt-steps dt-fade">
          {[
            { num: '01', title: 'Plan your trip', desc: 'Enter your destination and travel date. Set preferences for co-travellers.' },
            { num: '02', title: 'Get matched', desc: 'Our algorithm finds other verified users heading the same way on the same date.' },
            { num: '03', title: 'Chat & plan', desc: 'Use the built-in group chat to coordinate, discuss the route, and finalise plans.' },
            { num: '04', title: 'Travel & save', desc: 'Book with Uber, Lyft, or Waymo as a group — and pay a fraction of solo fare.' },
          ].map((s) => (
            <div className="dt-step" key={s.num}>
              <div className="dt-step-num">{s.num}</div>
              <div className="dt-step-title">{s.title}</div>
              <div className="dt-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="dt-features" id="features">
        <div className="dt-features-inner">
          <div className="dt-section-label">Features</div>
          <h2 className="dt-h2" style={{ color: 'var(--paper)', marginBottom: '48px' }}>
            Everything you need<br />to <em style={{ color: '#6ec99a' }}>travel together</em>
          </h2>
          <div className="dt-features-grid">
            {[
              { icon: '🤝', title: 'Smart matching', desc: 'AI-powered matching pairs you with verified travellers going your way on the same date.' },
              { icon: '💬', title: 'Group chat', desc: 'Real-time messaging to coordinate with your travel group before and during the trip.' },
              { icon: '💰', title: 'Dynamic fare split', desc: 'More people means lower fares. Auto-negotiated group pricing with Uber, Lyft & Waymo.' },
              { icon: '🚗', title: 'Own vehicle listing', desc: 'Got a car? List your trip and let others join. Fare auto-calculated based on miles & fuel.' },
              { icon: '🤖', title: 'AI destination guide', desc: 'Get real-time pop-ups about popular spots along your route, with AI-generated briefs.' },
              { icon: '⭐', title: 'Trust & reviews', desc: 'A points-based reputation system so you always know who you\'re travelling with.' },
            ].map((f) => (
              <div className="dt-feature-card" key={f.title}>
                <div className="dt-feature-icon">{f.icon}</div>
                <div className="dt-feature-title">{f.title}</div>
                <div className="dt-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FARE SECTION */}
      <section className="dt-fare-section" id="fare">
        <div className="dt-fade">
          <div className="dt-section-label">Fare calculator</div>
          <h2 className="dt-h2">The more you are,<br />the <em>less you pay</em></h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
            Our dynamic fare engine negotiates group rates with ride providers in real time.
            Add more travellers, watch the price drop.
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
            Own a vehicle? Our smart calculator splits fuel cost, toll charges, and vehicle wear fairly among all passengers — calculated per mile.
          </p>
        </div>
        <div className="dt-fare-visual dt-fade" style={{ transitionDelay: '0.15s' }}>
          <div className="dt-fare-header">
            <div className="dt-fare-header-title">New York → Miami · Dec 24</div>
            <div className="dt-fare-badge">Group booking</div>
          </div>
          <div className="dt-fare-bars">
            {[
              { label: 'Solo ride (Uber)', price: '$340', width: '100%', cls: 'dt-fill-orange' },
              { label: '2 travelers', price: '$195', width: '57%', cls: 'dt-fill-blue' },
              { label: '4 travelers', price: '$115', width: '34%', cls: 'dt-fill-green' },
              { label: '6 travelers', price: '$85', width: '25%', cls: 'dt-fill-green' },
            ].map((b) => (
              <div className="dt-fare-bar-item" key={b.label}>
                <div className="dt-fare-bar-label"><span>{b.label}</span><span>{b.price}</span></div>
                <div className="dt-fare-bar-track">
                  <div className={`dt-fare-bar-fill ${b.cls}`} style={{ width: b.width }} />
                </div>
              </div>
            ))}
          </div>
          <div className="dt-fare-saving">
            <div className="dt-saving-label">You save per person</div>
            <div className="dt-saving-amount">$255</div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="dt-reviews" id="reviews">
        <div className="dt-reviews-inner">
          <div className="dt-section-label">Reviews</div>
          <h2 className="dt-h2">What travellers<br /><em>are saying</em></h2>
          <div className="dt-reviews-grid dt-fade">
            {[
              { stars: '★★★★★', text: '"Rode from NYC to Boston with 5 strangers who became friends. Paid just $18 each. The AI suggested a great diner stop midway — perfect!"', name: 'James Carter', meta: 'New York · 12 trips', color: '#1a6b4a', initials: 'JC' },
              { stars: '★★★★★', text: '"Listed my car for an LA–San Diego trip. App calculated the fuel split perfectly. Covered my gas cost entirely — brilliant concept."', name: 'Sarah Mitchell', meta: 'Los Angeles · 8 trips', color: '#e8673a', initials: 'SM' },
              { stars: '★★★★☆', text: '"The POI alerts are a game changer. Didn\'t know Savannah was so beautiful on the way to Miami — unplanned stop, best decision ever."', name: 'David Nguyen', meta: 'Chicago · 5 trips', color: '#4a6ee8', initials: 'DN' },
            ].map((r) => (
              <div className="dt-review-card" key={r.name}>
                <div className="dt-review-stars">{r.stars}</div>
                <div className="dt-review-text">{r.text}</div>
                <div className="dt-review-author">
                  <div className="dt-review-avatar" style={{ background: r.color }}>{r.initials}</div>
                  <div>
                    <div className="dt-review-name">{r.name}</div>
                    <div className="dt-review-meta">{r.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="dt-cta" id="join">
        <div className="dt-cta-inner dt-fade">
          <h2 className="dt-h2">Ready to travel<br /><em>together?</em></h2>
          <p className="dt-cta-desc">Join thousands of travellers who are already saving money and making memories.</p>
          <div className="dt-cta-form">
            <input className="dt-cta-input" type="email" placeholder="Enter your email" />
            <a href="/login" className="dt-btn-primary" style={{ whiteSpace: 'nowrap' }}>Get early access</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dt-footer">
        <div className="dt-footer-logo">Destination<span>Together</span></div>
        <div className="dt-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
          <a href="#">Blog</a>
        </div>
        <div className="dt-footer-copy">© 2025 DestinationTogether</div>
      </footer>

    </div>
  )
}