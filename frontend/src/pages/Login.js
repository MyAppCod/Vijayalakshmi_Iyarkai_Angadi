import { useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data);
      navigate(res.data.user?.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)' }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 16px' }}>
        <div className="card border-0 shadow" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          {/* Card Header */}
          <div style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', padding: '32px 32px 24px', textAlign: 'center', color: '#fff' }}>
            <img src="/VIA LOGO WITH NAME.png" alt="VIA" style={{ height: '52px', objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: '12px' }} />
            <h4 className="fw-bold mb-1">Welcome Back</h4>
            <p style={{ color: '#c8e6c9', fontSize: '14px', margin: 0 }}>Sign in to your account</p>
          </div>

          {/* Card Body */}
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger d-flex align-items-center py-2 mb-3" style={{ borderRadius: '10px', fontSize: '14px' }}>
                <span className="me-2">⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-medium text-muted small">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">📧</span>
                  <input
                    type="email"
                    required
                    className="form-control border-start-0 bg-light"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    style={{ boxShadow: 'none' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-muted small">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    className="form-control border-start-0 border-end-0 bg-light"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ boxShadow: 'none' }}
                  />
                  <button type="button" className="input-group-text bg-light border-start-0" style={{ cursor: 'pointer' }}
                    onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-success w-100 py-2 fw-semibold"
                disabled={loading}
                style={{ borderRadius: '10px', fontSize: '15px' }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                Don't have an account?{' '}
                <Link to="/register" className="text-success fw-semibold text-decoration-none">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
