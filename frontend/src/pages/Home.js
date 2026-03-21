import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🌾', title: 'Farm Fresh', desc: 'Sourced directly from certified organic farms' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery within city limits' },
  { icon: '✅', title: 'Quality Assured', desc: '100% natural, no preservatives or additives' },
  { icon: '♻️', title: 'Eco Packaging', desc: 'Sustainable and biodegradable packaging' }
];

const Home = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    API.get('/content/home')
      .then(res => setContent(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ marginTop: '-16px' }}>

      {/* ── HERO SECTION ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)',
        color: '#fff',
        padding: '80px 0 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

        <div className="container text-center position-relative">
          <p className="mb-2" style={{ color: '#a5d6a7', letterSpacing: '2px', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600 }}>
            Welcome to
          </p>
          <div className="mb-3">
            <img src="/VIA LOGO WITH NAME.png" alt="Vijayalakshmi Iyarkai Angadi" style={{ height: '70px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <p className="lead mb-4" style={{ color: '#c8e6c9', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Healthy products from traditional farming — rice, millets, dairy &amp; more
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/products" className="btn btn-light btn-lg px-4 fw-semibold" style={{ color: '#2e7d32', borderRadius: '50px' }}>
              Shop Now →
            </Link>
            <Link to="/about" className="btn btn-outline-light btn-lg px-4" style={{ borderRadius: '50px' }}>
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* ── CATEGORY CARDS ── */}
      <div className="container py-5">
        <h4 className="text-center fw-bold mb-4" style={{ color: '#1b5e20' }}>Shop by Category</h4>
        <div className="row g-3 justify-content-center">
          {[
            { name: 'Rice', icon: '🌾', color: '#fff8e1', border: '#ffe082', path: '/products?cat=rice' },
            { name: 'Millets', icon: '🌿', color: '#e8f5e9', border: '#a5d6a7', path: '/products?cat=millets' },
            { name: 'Dairy', icon: '🥛', color: '#e3f2fd', border: '#90caf9', path: '/products?cat=dairy' },
            { name: 'Others', icon: '🛒', color: '#fce4ec', border: '#f48fb1', path: '/products?cat=others' }
          ].map(cat => (
            <div key={cat.name} className="col-6 col-sm-3">
              <Link to="/products" className="text-decoration-none">
                <div className="card border-0 text-center p-4 h-100" style={{ background: cat.color, border: `2px solid ${cat.border}`, borderRadius: '16px', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{cat.icon}</div>
                  <h6 className="fw-semibold mb-0" style={{ color: '#1b5e20' }}>{cat.name}</h6>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ── DYNAMIC CONTENT SECTIONS ── */}
      {content?.sections?.length > 0 && (
        <div style={{ background: '#f9fbe7' }} className="py-5">
          <div className="container">
            <h4 className="text-center fw-bold mb-4" style={{ color: '#1b5e20' }}>Our Story</h4>
            <div className="row g-4">
              {content.sections.map((sec, index) => (
                <div key={index} className="col-md-6" data-aos="fade-up">
                  <div className="card border-0 shadow-sm h-100 p-4" style={{ borderRadius: '16px' }}>
                    <h5 style={{ color: '#2e7d32' }}>{sec.title}</h5>
                    <p className="text-muted mb-0">{sec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WHY CHOOSE US ── */}
      <div className="container py-5">
        <h4 className="text-center fw-bold mb-4" style={{ color: '#1b5e20' }}>Why Choose Us?</h4>
        <div className="row g-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="col-6 col-md-3">
              <div className="text-center p-3">
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{f.icon}</div>
                <h6 className="fw-semibold" style={{ color: '#1b5e20' }}>{f.title}</h6>
                <p className="text-muted small mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div style={{ background: '#e8f5e9', borderTop: '1px solid #c8e6c9', borderBottom: '1px solid #c8e6c9' }} className="py-5">
        <div className="container text-center">
          <h4 className="fw-bold mb-2" style={{ color: '#1b5e20' }}>Ready to go organic?</h4>
          <p className="text-muted mb-3">Browse our full range of fresh, natural products</p>
          <Link to="/products" className="btn btn-success btn-lg px-5" style={{ borderRadius: '50px' }}>
            View All Products
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Home;
