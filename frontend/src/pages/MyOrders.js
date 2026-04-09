import { useEffect, useState } from 'react';
import API from '../services/api';
import { mediaUrl } from '../services/media';
import { Link } from 'react-router-dom';

const statusColors = {
  Placed: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Pending: 'secondary',
  Paid: 'primary'
};

const statusIcons = {
  Placed: '📋',
  Shipped: '🚚',
  Delivered: '✅',
  Pending: '⏳',
  Paid: '💳'
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/my-orders')
      .then(res => setOrders(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-success" role="status"></div>
      <p className="mt-3 text-muted">Loading your orders...</p>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0">📦 My Orders</h2>
        <span className="badge bg-success ms-2">{orders.length}</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>📭</div>
          <h5 className="mt-3">No orders yet</h5>
          <p className="text-muted">Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-success">
            Shop Now
          </Link>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.orderId} className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                {/* Order Header */}
                <div className="d-flex flex-wrap justify-content-between align-items-start mb-3">
                  <div>
                    <p className="text-muted small mb-1">Order ID</p>
                    <code className="text-dark" style={{ fontSize: '13px' }}>{order.orderId}</code>
                  </div>
                  <div className="text-end">
                    <span className={`badge bg-${statusColors[order.orderStatus] || 'secondary'} px-3 py-2`}>
                      {statusIcons[order.orderStatus]} {order.orderStatus}
                    </span>
                    <p className="text-muted small mt-1 mb-0">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                {order.qrCode && (
                  <div className="mt-3 text-center">
                    <p className="small text-muted mb-1">Scan to Pay</p>
                    <img
                      src={order.qrCode}
                      alt="QR Code"
                      style={{ width: '120px', height: '120px' }}
                    />

                    {/* ✅ ADD THIS */}
                    <p className="small mt-2">
                      UPI ID: <strong>{order.upiId}</strong>
                    </p>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(order.upiId);
                        alert("Copied!");
                      }}
                    >
                      📋 Copy
                    </button>
                    <a
                      href={`upi://pay?pa=${order.upiId}&pn=Store&am=${order.totalAmount}&cu=INR`}
                      className="btn btn-success mt-2"
                    >
                      Pay Now
                    </a>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center py-2 border-bottom">
                      <div style={{ width: '48px', height: '48px', background: '#f1f8e9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                        {item.product?.image
                          ? <img src={mediaUrl(item.product.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                          : '🌿'}
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <p className="mb-0 fw-medium">{item.product?.name || 'Product'}</p>
                        <p className="mb-0 text-muted small">Qty: {item.quantity}</p>
                      </div>
                      <span className="fw-semibold">₹{item.product?.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div>
                    <p className="text-muted small mb-1">Payment: <span className={`text-${statusColors[order.paymentStatus] || 'secondary'}`}>{order.paymentStatus}</span></p>
                    <p className="text-muted small mb-0">Ship to: {order.shippingAddress}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-muted small mb-0">Total Amount</p>
                    <h5 className="text-success fw-bold mb-0">₹{order.totalAmount}</h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
