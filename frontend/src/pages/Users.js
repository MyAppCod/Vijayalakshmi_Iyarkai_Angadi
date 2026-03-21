import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';
import Toast from '../components/Toast';
import { AuthContext } from '../context/AuthContext';

const ROLES = ['customer', 'staff', 'manager', 'admin'];

const ROLE_STYLES = {
  admin:    { bg: '#fce4ec', color: '#b71c1c', border: '#ef9a9a' },
  manager:  { bg: '#e8eaf6', color: '#1a237e', border: '#9fa8da' },
  staff:    { bg: '#e3f2fd', color: '#0d47a1', border: '#90caf9' },
  customer: { bg: '#f1f8e9', color: '#1b5e20', border: '#a5d6a7' }
};

const Users = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [changingId, setChangingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // user to delete

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = () => {
    API.get('/users')
      .then(res => setUsers(res.data))
      .catch(() => showToast('Failed to load users', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const changeRole = async (userId, newRole) => {
    setChangingId(userId);
    try {
      const res = await API.put(`/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? res.data : u));
      showToast(`Role updated to "${newRole}"`);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to update role', 'danger');
    } finally {
      setChangingId(null);
    }
  };

  const deleteUser = async () => {
    if (!confirmDelete) return;
    try {
      await API.delete(`/users/${confirmDelete._id}`);
      setUsers(prev => prev.filter(u => u._id !== confirmDelete._id));
      showToast(`${confirmDelete.name} removed`);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to delete user', 'danger');
    } finally {
      setConfirmDelete(null);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const roleCounts = ROLES.reduce((acc, r) => {
    acc[r] = users.filter(u => u.role === r).length;
    return acc;
  }, {});

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card border-0 shadow-lg p-4" style={{ borderRadius: '16px', maxWidth: '380px', width: '90%' }}>
            <div className="text-center mb-3">
              <div style={{ fontSize: '3rem' }}>⚠️</div>
              <h5 className="fw-bold mt-2">Remove User?</h5>
              <p className="text-muted small mb-0">
                This will permanently remove <strong>{confirmDelete.name}</strong> ({confirmDelete.email}) from the system.
              </p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary flex-fill" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger flex-fill" onClick={deleteUser}>Yes, Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h4 className="fw-bold mb-0">Access Control</h4>
          <p className="text-muted small mb-0">Manage user roles and permissions</p>
        </div>
        <span className="badge bg-success px-3 py-2" style={{ borderRadius: '20px', fontSize: '13px' }}>
          {users.length} Total Users
        </span>
      </div>

      {/* Role Summary Cards */}
      <div className="row g-3 mb-4">
        {ROLES.map(r => {
          const s = ROLE_STYLES[r];
          return (
            <div key={r} className="col-6 col-xl-3">
              <div
                className="card border-0 p-3 text-center"
                style={{ borderRadius: '14px', background: s.bg, border: `1.5px solid ${s.border}`, cursor: 'pointer', transition: 'transform 0.15s', outline: filterRole === r ? `2px solid ${s.color}` : 'none' }}
                onClick={() => setFilterRole(filterRole === r ? 'all' : r)}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h4 className="fw-bold mb-0" style={{ color: s.color }}>{roleCounts[r]}</h4>
                <p className="mb-0 small fw-medium" style={{ color: s.color, textTransform: 'capitalize' }}>{r}s</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ boxShadow: 'none' }}
          />
        </div>
        <select
          className="form-select"
          style={{ maxWidth: '150px', borderRadius: '8px' }}
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
        {(search || filterRole !== 'all') && (
          <button className="btn btn-outline-secondary btn-sm" onClick={() => { setSearch(''); setFilterRole('all'); }}>
            Clear
          </button>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>👥</div>
          <p className="text-muted mt-3">No users found</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <table className="table table-hover mb-0">
            <thead style={{ background: '#f1f8e9' }}>
              <tr>
                <th className="py-3 ps-4 border-0" style={{ color: '#1b5e20', fontWeight: 600 }}>User</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20', fontWeight: 600 }}>Joined</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20', fontWeight: 600 }}>Role</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20', fontWeight: 600 }}>Change Role</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const isSelf = u._id === currentUser?.id;
                const s = ROLE_STYLES[u.role] || ROLE_STYLES.customer;
                return (
                  <tr key={u._id} style={{ opacity: isSelf ? 0.85 : 1 }}>
                    {/* User info */}
                    <td className="ps-4 py-3 align-middle">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: s.bg, border: `2px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: s.color, fontSize: '15px', flexShrink: 0 }}>
                          {u.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="mb-0 fw-medium" style={{ fontSize: '14px' }}>
                            {u.name}
                            {isSelf && <span className="badge ms-2" style={{ background: '#e8f5e9', color: '#1b5e20', fontSize: '10px' }}>You</span>}
                          </p>
                          <p className="mb-0 text-muted" style={{ fontSize: '12px' }}>{u.email}</p>
                          {u.phone && <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>📱 {u.phone}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Joined date */}
                    <td className="py-3 align-middle text-muted" style={{ fontSize: '13px' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>

                    {/* Current role badge */}
                    <td className="py-3 align-middle">
                      <span className="badge px-3 py-1" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: '20px', fontSize: '12px', textTransform: 'capitalize' }}>
                        {u.role}
                      </span>
                    </td>

                    {/* Role selector */}
                    <td className="py-3 align-middle">
                      {isSelf ? (
                        <span className="text-muted small">—</span>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm"
                            value={u.role}
                            onChange={e => changeRole(u._id, e.target.value)}
                            disabled={changingId === u._id}
                            style={{ maxWidth: '130px', borderRadius: '8px', fontSize: '13px' }}
                          >
                            {ROLES.map(r => (
                              <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                            ))}
                          </select>
                          {changingId === u._id && (
                            <span className="spinner-border spinner-border-sm text-success" style={{ width: '14px', height: '14px' }}></span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Delete */}
                    <td className="py-3 align-middle">
                      {isSelf ? (
                        <span className="text-muted small">—</span>
                      ) : (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          style={{ borderRadius: '8px', fontSize: '12px' }}
                          onClick={() => setConfirmDelete(u)}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;
