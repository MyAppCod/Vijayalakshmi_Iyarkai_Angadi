import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);
  const placeOrder = async () => {
    if (!address.trim()) {
      setError('Please enter a shipping address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/orders', { shippingAddress: address, paymentMethod });
      setOrder({
        ...res.data.order,
        upiId: res.data.upiId
      });
    } catch (err) {
      setError(err.response?.data?.msg || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <div className="container py-5" style={{ maxWidth: '560px' }}>
        <div className="card border-0 shadow text-center p-5" style={{ borderRadius: '20px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
          <h3 className="fw-bold text-success mb-2">Order Placed!</h3>
          <p className="text-muted mb-1">Your order has been successfully placed.</p>
          <code className="text-dark d-block mb-4" style={{ fontSize: '13px' }}>Order ID: {order.orderId || order._id}</code>

          <div className="card bg-light border-0 p-3 mb-4" style={{ borderRadius: '12px' }}>
            <h6 className="fw-semibold mb-2">💳 Complete Payment</h6>
            <p className="mb-1 text-muted small">UPI ID: <strong className="text-dark">{order.upiId || 'vigneshvickysvva@oksbi'}</strong></p>
            <button onClick={() => {
              navigator.clipboard.writeText(order.upiId);
              alert("Copied!");
            }}>
              Copy
            </button>
            <p className="text-muted small mb-2">Scan the QR code to pay</p>
            <div style={{ width: '180px', height: '180px', margin: '0 auto' }}>
              <img
                src={order.qrCode || "../../public/phonepe-qr.jpeg"}
                alt="UPI QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
              />
            </div>
            <p className="text-warning small mt-2 mb-0">After payment, share screenshot to confirm order.</p>
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <Link to="/orders" className="btn btn-success px-4" style={{ borderRadius: '20px' }}>View My Orders</Link>
            <Link to="/products" className="btn btn-outline-success px-4" style={{ borderRadius: '20px' }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <h4 className="fw-bold mb-4" style={{ color: '#1b5e20' }}>💳 Checkout</h4>

      {error && (
        <div className="alert alert-danger d-flex align-items-center py-2 mb-3" style={{ borderRadius: '10px', fontSize: '14px' }}>
          <span className="me-2">⚠️</span> {error}
        </div>
      )}

      {/* Shipping Address */}
      <div className="card border-0 shadow-sm p-4 mb-3" style={{ borderRadius: '16px' }}>
        <h6 className="fw-semibold mb-3">📍 Shipping Address</h6>
        <textarea
          className="form-control bg-light"
          rows="3"
          placeholder="Enter your full delivery address (house no., street, city, pincode)..."
          value={address}
          onChange={e => setAddress(e.target.value)}
          style={{ borderRadius: '10px', boxShadow: 'none' }}
        />
      </div>

      {/* Payment Method */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
        <h6 className="fw-semibold mb-3">💳 Payment Method</h6>
        {['UPI', 'Cash on Delivery'].map(method => (
          <div key={method} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              id={method}
              name="payment"
              value={method}
              checked={paymentMethod === method}
              onChange={e => setPaymentMethod(e.target.value)}
            />
            <label className="form-check-label" htmlFor={method}>
              {method === 'UPI' ? '📱 UPI (GPay / PhonePe / Paytm)' : '💵 Cash on Delivery'}
            </label>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px', background: '#f9fbe7' }}>
        <h6 className="fw-semibold mb-2">Order for: <span className="text-success">{user?.name || user?.email}</span></h6>
        <p className="text-muted small mb-0">Items will be confirmed after payment verification.</p>
      </div>

      <button
        className="btn btn-success w-100 py-3 fw-semibold"
        onClick={placeOrder}
        disabled={loading}
        style={{ borderRadius: '12px', fontSize: '16px' }}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Placing Order...</>
        ) : 'Place Order →'}
      </button>
    </div>
  );
};

export default Checkout;
