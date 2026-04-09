import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';


const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);


  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  useEffect(() => {
    API.get('/auth/me')
      .then(res => setForm({ name: res.data.name || '', phone: res.data.phone || '', address: res.data.address || '' }))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const update = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/users/profile', form); // ✅ get response

      // ✅ ADD THESE 2 LINES HERE
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);

      showToast('Profile updated successfully!');
    } catch (err) {
      showToast('Failed to update profile', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-success" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="text-center mb-4">
        <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 12px', color: '#fff' }}>
          {form.name ? form.name[0].toUpperCase() : '👤'}
        </div>
        <h4 className="fw-bold mb-0" style={{ color: '#1b5e20' }}>My Profile</h4>
        <p className="text-muted small">{user?.email}</p>
      </div>

      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
        <form onSubmit={update}>
          <div className="mb-3">
            <label className="form-label fw-medium small text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">👤</span>
              <input
                className="form-control border-start-0 bg-light"
                placeholder="Your full name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ boxShadow: 'none' }}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">📧</span>
              <input
                className="form-control border-start-0 bg-light"
                value={user?.email || ''}
                disabled
                style={{ boxShadow: 'none' }}
              />
            </div>
            <div className="form-text">Email cannot be changed</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium small text-muted">Phone Number</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">📱</span>
              <input
                type="tel"
                className="form-control border-start-0 bg-light"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                style={{ boxShadow: 'none' }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium small text-muted">Delivery Address</label>
            <textarea
              className="form-control bg-light"
              placeholder="Your default delivery address"
              rows="3"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              style={{ boxShadow: 'none' }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-semibold"
            disabled={saving}
            style={{ borderRadius: '10px' }}
          >
            {saving ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving...</>
            ) : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
