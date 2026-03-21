import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { mediaUrl } from '../services/media';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [logo, setLogo] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    API.get('/content/home').then(res => {
      if (res.data?.logo) setLogo(mediaUrl(res.data.logo));
    }).catch(() => {});
  }, []);

  // Sync cart count from backend when logged in, else localStorage
  useEffect(() => {
    if (user) {
      API.get('/cart').then(res => {
        setCartCount(res.data?.items?.length || 0);
      }).catch(() => setCartCount(0));
    } else {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartCount(cart.length);
    }
  }, [location, user]);

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top" style={{ background: 'linear-gradient(90deg, #a9caab, #5a9d5d, #248429, #1b5e20)' }}>
      <div className="container">
        {/* BRAND */}
        <div className="d-flex align-items-center">
          {isAuthPage && (
            <Link to="/" className="text-white me-3 d-flex align-items-center text-decoration-none">
              <span style={{ fontSize: '1.3rem' }}>←</span>
              <span className="ms-1 d-none d-sm-inline small">Back</span>
            </Link>
          )}
          <Link to="/" className="navbar-brand d-flex align-items-center py-1">
            <img
              src={logo || '/VIA LOGO WITH NAME.png'}
              alt="Vijayalakshmi Iyarkai Angadi"
              height="50"
              style={{ objectFit: 'contain' }}
            />
          </Link>
        </div>

        {!isAuthPage && (
          <>
            <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse justify-content-end" id="nav">
              <ul className="navbar-nav align-items-center gap-1">
                <li className="nav-item">
                  <Link className={isActive('/')} to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive('/products')} to="/products">Products</Link>
                </li>
                <li className="nav-item">
                  <Link className={isActive('/about')} to="/about">About</Link>
                </li>

                {/* My Orders - visible when logged in */}
                {user && (
                  <li className="nav-item">
                    <Link className={isActive('/orders')} to="/orders">📦 My Orders</Link>
                  </li>
                )}

                {/* Cart */}
                <li className="nav-item">
                  <Link className={isActive('/cart')} to="/cart">
                    🛒
                    {cartCount > 0 && (
                      <span className="badge rounded-pill ms-1" style={{ background: '#ffca28', color: '#1b5e20', fontSize: '11px' }}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>

                {!user ? (
                  <>
                    <li className="nav-item">
                      <Link to="/login" className="btn btn-outline-light btn-sm px-3 ms-1" style={{ borderRadius: '20px' }}>Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/register" className="btn btn-light btn-sm px-3 ms-1" style={{ borderRadius: '20px', color: '#2e7d32', fontWeight: 600 }}>Register</Link>
                    </li>
                  </>
                ) : (
                  <li className="nav-item dropdown">
                    <span className="nav-link dropdown-toggle d-flex align-items-center gap-1" role="button" data-bs-toggle="dropdown" style={{ color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.45)' }}>
                      <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                        {user.name ? user.name[0].toUpperCase() : '👤'}
                      </span>
                      <span className="d-none d-md-inline">{user.name || user.email}</span>
                    </span>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style={{ borderRadius: '12px', minWidth: '180px' }}>
                      <li className="px-3 py-2 border-bottom">
                        <p className="mb-0 small fw-semibold">{user.name || 'User'}</p>
                        <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>{user.email}</p>
                      </li>
                      <li>
                        <Link className="dropdown-item py-2" to="/profile">👤 My Profile</Link>
                      </li>
                      {user.role === 'admin' && (
                        <li>
                          <Link className="dropdown-item py-2" to="/admin">⚙️ Admin Panel</Link>
                        </li>
                      )}
                      <li className="border-top">
                        <button className="dropdown-item py-2 text-danger" onClick={logout}>🚪 Logout</button>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
