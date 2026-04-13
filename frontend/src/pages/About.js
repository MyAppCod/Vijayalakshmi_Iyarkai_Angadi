import { Link } from 'react-router-dom';

const VALUES = [
  {
    icon: '🌱',
    title: 'Chemical-Free Farming',
    desc: 'We work exclusively with farmers who use no synthetic pesticides or fertilisers — only age-old, natural techniques passed down through generations.'
  },
  {
    icon: '🤝',
    title: 'Farmer Partnerships',
    desc: 'Every product is sourced directly from verified farmers. Fair pricing, transparent supply chains, no middlemen.'
  },
  {
    icon: '🌍',
    title: 'Soil Health First',
    desc: 'Healthy soil = healthy food. Our farmers practice crop rotation, composting and water conservation to keep the land alive.'
  },
  {
    icon: '♻️',
    title: 'Eco Packaging',
    desc: 'All our packaging is biodegradable or recyclable. We are committed to leaving the planet better than we found it.'
  }
];

const MILESTONES = [
  { year: '1976', label: 'Founded', desc: 'Started with 3 farmers and a belief in real food' },
  { year: '2000', label: '10+ Products', desc: 'Expanded to include millets, dairy, and traditional rice varieties' },
  { year: '2024', label: 'Online Store', desc: 'Launched our digital platform to reach customers across the region' },
  { year: '2026', label: '50+ Families', desc: 'Now serving over 500 families with fresh organic produce every month' }
];

const TEAM = [
  { name: 'Vignesh Selvaraj', role: 'Founder & CEO', icon: '🤵🏻', desc: 'Third-generation farmer who turned her family\'s land into a movement.' },
  // { name: 'Ravi Sundaram', role: 'Head of Sourcing', icon: '👨‍🌾', desc: 'Travels to farms personally to ensure quality and ethical practices.' },
  // { name: 'Priya Menon', role: 'Nutrition Advisor', icon: '👩‍⚕️', desc: 'Certified nutritionist helping customers make the right food choices.' }
];

const About = () => {
  return (
    <div style={{ marginTop: '-16px' }}>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)',
        color: '#fff',
        padding: '80px 0 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />

        <div className="container text-center position-relative">
          <p style={{ color: '#a5d6a7', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>
            Our Story
          </p>
          <div className="mb-3">
            <img src="/VIA LOGO WITH NAME.png" alt="Vijayalakshmi Iyarkai Angadi" style={{ height: '64px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <h1 className="display-5 fw-bold mb-3" style={{ color: '#fff' }}>About Us</h1>
          <p className="lead mb-0" style={{ color: '#c8e6c9', maxWidth: '560px', margin: '0 auto' }}>
            Rooted in tradition. Grown with care. Delivered with purpose.
          </p>
        </div>
      </div>

      {/* ── MISSION STRIP ── */}
      <div style={{ background: '#f9fbe7', borderBottom: '1px solid #c8e6c9' }} className="py-4">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { num: '500+', label: 'Families Served' },
              { num: '30+', label: 'Partner Farmers' },
              { num: '100+', label: 'Organic Products' },
              { num: '6+', label: 'Years of Trust' }
            ].map(s => (
              <div key={s.label} className="col-6 col-md-3">
                <h3 className="fw-bold mb-0" style={{ color: '#1b5e20' }}>{s.num}</h3>
                <p className="text-muted small mb-0">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <p className="fw-semibold mb-2" style={{ color: '#2e7d32', letterSpacing: '1px', fontSize: '13px', textTransform: 'uppercase' }}>Who We Are</p>
            <h2 className="fw-bold mb-4" style={{ color: '#1b5e20', lineHeight: 1.3 }}>
              Reconnecting people<br />with real food
            </h2>
            <p className="text-muted mb-3" style={{ lineHeight: 1.8 }}>
              Our organic shop is rooted in the traditions of natural farming, inspired by ancestors who cultivated food in harmony with nature. What started as a small family initiative has grown into a trusted platform connecting conscious consumers with dedicated farmers.
            </p>
            <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>
              We believe chemical-free agriculture, preserved soil health, and transparent sourcing is not a trend — it is the only way forward. From traditional rice varieties and ancient millets to fresh dairy, every item is carefully selected from farmers we know personally and trust completely.
            </p>
            <Link to="/products" className="btn btn-success px-4 py-2 fw-semibold" style={{ borderRadius: '50px' }}>
              Explore Our Products →
            </Link>
          </div>

          <div className="col-md-6">
            {/* Visual card stack */}
            <div className="position-relative" style={{ minHeight: '320px' }}>
              <div className="card border-0 shadow p-4 text-center" style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', position: 'absolute', top: 0, left: '10%', right: '10%' }}>
                <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🌾</div>
                <h5 className="fw-bold" style={{ color: '#1b5e20' }}>Farm to Table</h5>
                <p className="text-muted small mb-0">Every product travels directly from our partner farms to your doorstep — no warehouses, no compromises.</p>
              </div>
              <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '14px', background: '#fff', position: 'absolute', bottom: 0, right: '5%', width: '180px' }}>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.8rem' }}>✅</span>
                  <div>
                    <p className="fw-semibold mb-0 small" style={{ color: '#1b5e20' }}>Certified Organic</p>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}>All products verified</p>
                  </div>
                </div>
              </div>
              <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '14px', background: '#fff8e1', position: 'absolute', top: '30px', left: '0', width: '170px' }}>
                <div className="d-flex align-items-center gap-2">
                  <span style={{ fontSize: '1.8rem' }}>🤝</span>
                  <div>
                    <p className="fw-semibold mb-0 small" style={{ color: '#1b5e20' }}>Fair Trade</p>
                    <p className="text-muted mb-0" style={{ fontSize: '11px' }}>Farmers paid fairly</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── OUR VALUES ── */}
      <div style={{ background: '#f9fbe7', borderTop: '1px solid #dcedc8', borderBottom: '1px solid #dcedc8' }} className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <p className="fw-semibold mb-1" style={{ color: '#2e7d32', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>What We Stand For</p>
            <h3 className="fw-bold" style={{ color: '#1b5e20' }}>Our Core Values</h3>
          </div>
          <div className="row g-4">
            {VALUES.map((v, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <div className="card border-0 shadow-sm h-100 p-4" style={{ borderRadius: '16px', borderTop: '4px solid #a5d6a7' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; e.currentTarget.style.transition = 'all 0.2s'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{v.icon}</div>
                  <h6 className="fw-bold mb-2" style={{ color: '#1b5e20' }}>{v.title}</h6>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="container py-5">
        <div className="text-center mb-5">
          <p className="fw-semibold mb-1" style={{ color: '#2e7d32', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>How Far We've Come</p>
          <h3 className="fw-bold" style={{ color: '#1b5e20' }}>Our Journey</h3>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {MILESTONES.map((m, i) => (
              <div key={i} className="d-flex gap-4 mb-4">
                {/* Year bubble */}
                <div className="flex-shrink-0 text-center" style={{ width: '80px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', color: '#fff', borderRadius: '12px', padding: '10px 8px', fontWeight: 700, fontSize: '15px' }}>
                    {m.year}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div style={{ width: '2px', height: '40px', background: '#c8e6c9', margin: '0 auto' }} />
                  )}
                </div>
                {/* Content */}
                <div className="card border-0 shadow-sm p-3 flex-grow-1" style={{ borderRadius: '14px', borderLeft: '3px solid #a5d6a7' }}>
                  <h6 className="fw-bold mb-1" style={{ color: '#1b5e20' }}>{m.label}</h6>
                  <p className="text-muted small mb-0">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEAM ── */}
      <div style={{ background: '#f9fbe7', borderTop: '1px solid #dcedc8', borderBottom: '1px solid #dcedc8' }} className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <p className="fw-semibold mb-1" style={{ color: '#2e7d32', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>The People Behind It</p>
            <h3 className="fw-bold" style={{ color: '#1b5e20' }}>Meet Our Team</h3>
          </div>
          <div className="row g-4 justify-content-center">
            {TEAM.map((member, i) => (
              <div key={i} className="col-sm-6 col-md-4">
                <div className="card border-0 shadow-sm text-center p-4 h-100" style={{ borderRadius: '20px' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.transition = 'all 0.2s'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}>
                  <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 16px' }}>
                    {member.icon}
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1b5e20' }}>{member.name}</h6>
                  <p className="text-success small fw-medium mb-2">{member.role}</p>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="py-5" style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', color: '#fff' }}>
        <div className="container text-center">
          <h3 className="fw-bold mb-2" style={{ color: '#fff' }}>Ready to eat better?</h3>
          <p style={{ color: '#c8e6c9', marginBottom: '28px' }}>Join hundreds of families who've made the switch to organic.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/products" className="btn btn-light btn-lg px-5 fw-semibold" style={{ color: '#1b5e20', borderRadius: '50px' }}>
              Shop Now →
            </Link>
            <Link to="/register" className="btn btn-outline-light btn-lg px-5" style={{ borderRadius: '50px' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default About;
