import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// roles: which roles can see this link
const NAV_ITEMS = [
  { path: '/admin',          label: 'Dashboard',     icon: '📊', roles: ['admin', 'manager'] },
  { path: '/admin/products', label: 'Products',      icon: '📦', roles: ['admin', 'manager'] },
  { path: '/admin/orders',   label: 'Orders',        icon: '🛒', roles: ['admin', 'manager'] },
  { path: '/admin/pos',      label: 'POS',           icon: '🏪', roles: ['admin', 'manager', 'staff'] },
  { path: '/admin/finance',  label: 'Finance',       icon: '💰', roles: ['admin', 'manager'] },
  { path: '/admin/reports',  label: 'Reports',       icon: '📈', roles: ['admin', 'manager'] },
  { path: '/admin/users',    label: 'Access Control',icon: '🔐', roles: ['admin'] },
  { path: '/admin/content',  label: 'Content',       icon: '📝', roles: ['admin'] }
];

const AdminLayout = ({ children }) => {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));
  const currentPage  = NAV_ITEMS.find(n => n.path === location.pathname);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <div style={{ width: '220px', minHeight: '100vh', background: '#1b5e20', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <nav style={{ padding: '12px', flex: 1, paddingTop: '16px' }}>
          {visibleItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className="d-flex align-items-center text-decoration-none mb-1"
                style={{ padding: '10px 14px', borderRadius: '10px', color: active ? '#1b5e20' : '#c8e6c9', background: active ? '#fff' : 'transparent', fontWeight: active ? 600 : 400, fontSize: '14px', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="me-2">{item.icon}</span>{item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link to="/" className="d-flex align-items-center text-decoration-none mb-1"
            style={{ color: '#a5d6a7', fontSize: '14px', padding: '8px 14px' }}>
            🌿 View Shop
          </Link>
          <button className="btn w-100 text-start" onClick={handleLogout}
            style={{ color: '#ef9a9a', fontSize: '14px', background: 'transparent', border: 'none', padding: '8px 14px' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-grow-1 d-flex flex-column" style={{ background: '#f8f9fa', minWidth: 0 }}>
        <div className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom">
          <h6 className="fw-bold mb-0">{currentPage?.icon} {currentPage?.label || 'Admin'}</h6>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small">{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</span>
            <span className="badge" style={{ background:'#e8f5e9', color:'#1b5e20', textTransform:'capitalize' }}>{user?.role}</span>
          </div>
        </div>
        <div className="flex-grow-1 p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
