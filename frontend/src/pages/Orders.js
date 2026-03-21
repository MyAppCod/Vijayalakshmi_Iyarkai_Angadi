import { useEffect, useState } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';
import Toast from '../components/Toast';

const STATUS_OPTIONS = ['Placed', 'Shipped', 'Delivered'];
const PAYMENT_OPTIONS = ['Pending', 'Paid'];

const statusColors = { Placed: 'warning', Shipped: 'info', Delivered: 'success' };
const paymentColors = { Pending: 'secondary', Paid: 'success' };

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadOrders = () => {
    API.get('/orders')
      .then(res => setOrders(res.data))
      .catch(() => showToast('Failed to load orders', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      showToast('Order status updated');
      loadOrders();
    } catch (err) {
      showToast('Failed to update status', 'danger');
    }
  };

  const filtered = orders.filter(o =>
    o._id.includes(search) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Orders</h4>
          <p className="text-muted small mb-0">{orders.length} total orders</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input type="text" className="form-control border-start-0" placeholder="Search by ID or customer..." value={search} onChange={e => setSearch(e.target.value)} style={{ boxShadow: 'none' }} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>📭</div>
          <p className="text-muted mt-3">{search ? 'No orders match your search' : 'No orders yet'}</p>
        </div>
      ) : (
        <div>
          {filtered.map(order => (
            <div key={order._id} className="card border-0 shadow-sm mb-3 p-4" style={{ borderRadius: '16px' }}>
              <div className="row align-items-center">
                <div className="col-md-5">
                  <p className="text-muted small mb-1">Order ID</p>
                  <code style={{ fontSize: '12px' }}>{order._id}</code>
                  <div className="mt-2">
                    <p className="mb-0 small"><strong>Customer:</strong> {order.user?.name || order.user?.email || 'N/A'}</p>
                    <p className="mb-0 small text-muted">{order.user?.email}</p>
                    <p className="mb-0 small text-muted">📍 {order.shippingAddress}</p>
                    <p className="mb-0 small text-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="col-md-3 mt-3 mt-md-0">
                  <p className="text-muted small mb-1">Amount</p>
                  <h5 className="fw-bold text-success mb-2">₹{order.totalAmount}</h5>
                  <span className={`badge bg-${paymentColors[order.paymentStatus] || 'secondary'}`}>
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="col-md-4 mt-3 mt-md-0">
                  <div className="mb-2">
                    <label className="form-label small text-muted mb-1">Order Status</label>
                    <select
                      className="form-select form-select-sm"
                      value={order.orderStatus}
                      onChange={e => updateStatus(order._id, e.target.value)}
                      style={{ borderRadius: '8px' }}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <span className={`badge bg-${statusColors[order.orderStatus] || 'secondary'} px-3`}>
                    Current: {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Items preview */}
              {order.items?.length > 0 && (
                <div className="mt-3 pt-3 border-top">
                  <p className="text-muted small mb-2">Items ({order.items.length})</p>
                  <div className="d-flex flex-wrap gap-2">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="badge bg-light text-dark border px-2 py-1" style={{ borderRadius: '8px', fontSize: '12px' }}>
                        {item.product?.name || 'Product'} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
