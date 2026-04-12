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
  const fetchOrders = () => {
    API.get('/users/my-orders')
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  fetchOrders();

  // 🔁 Auto refresh every 5 seconds
  const interval = setInterval(fetchOrders, 5000);
const getStepIndex = (status) => {
  const steps = ['Placed', 'Shipped', 'Delivered'];
  const currentStep = getStepIndex(order.orderStatus);

  return steps.indexOf(status);
};
  return () => clearInterval(interval);
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
  <div key={order.orderId} className="card border-0 shadow-sm mb-4 p-3" style={{ borderRadius: '16px' }}>
    <div className="row">

      {/* LEFT SIDE */}
      <div className="col-md-7">

        <p className="text-muted small mb-1">Order ID</p>
        <code style={{ fontSize: '13px' }}>{order.orderId}</code>

        <div className="mt-2">
          <span className={`badge bg-${statusColors[order.orderStatus] || 'secondary'} px-3 py-2`}>
            {statusIcons[order.orderStatus]} {order.orderStatus}
          </span>
        </div>

        <p className="text-muted small mt-2 mb-1">
          {new Date(order.createdAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </p>

        <div className="mt-3 mb-3">
  <div className="d-flex justify-content-between align-items-center position-relative">

    {steps.map((step, index) => (
      <div key={step} className="text-center flex-fill position-relative">

        {/* Circle */}
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          margin: '0 auto',
          background:
            index < currentStep ? '#28a745' :
            index === currentStep ? '#0d6efd' :
            '#dee2e6',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px'
        }}>
          {index < currentStep ? '✔' : index + 1}
        </div>

        {/* Label */}
        <p className="small mt-2 mb-0">{step}</p>

        {/* Line */}
        {index !== steps.length - 1 && (
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '50%',
            width: '100%',
            height: '3px',
            background: index < currentStep ? '#28a745' : '#dee2e6',
            zIndex: -1
          }} />
        )}

      </div>
    ))}

  </div>
</div>

        {/* ITEMS */}
        <div className="mt-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center mb-2">
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#f1f8e9'
              }}>
                {item.product?.image ? (
                  <img src={mediaUrl(item.product.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : '🌿'}
              </div>

              <div className="ms-3 flex-grow-1">
                <p className="mb-0 fw-medium">{item.product?.name}</p>
                <small className="text-muted">Qty: {item.quantity}</small>
              </div>

              <span className="fw-semibold">
                ₹{item.product?.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="col-md-5 text-center border-start">

        {order.qrCode && (
          <>
            <p className="small text-muted mb-1">Scan to Pay</p>

            <img
              src={order.qrCode}
              alt="QR"
              style={{ width: '130px', height: '130px' }}
            />

            <p className="small mt-2">
              UPI ID: <strong>{order.upiId}</strong>
            </p>

            <button
              className="btn btn-sm btn-outline-secondary mb-2"
              onClick={() => {
                navigator.clipboard.writeText(order.upiId);
                alert("UPI ID copied!");
              }}
            >
              📋 Copy
            </button>

            <br />

            <a
              href={`upi://pay?pa=${order.upiId}&pn=Store&am=${order.totalAmount}&cu=INR`}
              className="btn btn-success btn-sm mb-2"
            >
              Pay Now
            </a>
          </>
        )}

        {/* PAYMENT STATUS */}
        <div className="mt-2">
          <span className={`badge bg-${statusColors[order.paymentStatus] || 'secondary'} px-3 py-2`}>
            {statusIcons[order.paymentStatus]} {order.paymentStatus}
          </span>
        </div>

        {/* ADDRESS */}
        <p className="text-muted small mt-2 mb-0">
          📍 {order.shippingAddress}
        </p>

        {/* TOTAL */}
        <h5 className="text-success fw-bold mt-2">
          ₹{order.totalAmount}
        </h5>

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
