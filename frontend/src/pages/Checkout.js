import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { user } = useContext(AuthContext);

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  setAddress(user?.address || '');
  setLoading(false);
}, [user]);

// ✅ Place order
  const placeOrder = async () => {
    if (!address || !address.trim()) {
      setError('⚠️ Please add your shipping address in profile before placing order');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await API.post('/orders', {
        shippingAddress: address,
        paymentMethod
      });

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

  // ✅ ORDER SUCCESS UI
  if (order) {
    return (
      <div className="container py-5" style={{ maxWidth: '560px' }}>
        <div className="card border-0 shadow text-center p-5" style={{ borderRadius: '20px' }}>

          <div style={{ fontSize: '4rem' }}>🎉</div>
          <h3 className="fw-bold text-success mt-2">Order Placed!</h3>
          <p className="text-muted">Your order has been successfully placed.</p>

          <code className="d-block mb-4">
            Order ID: {order.orderId || order._id}
          </code>

          {/* PAYMENT SECTION */}
          <div className="card bg-light border-0 p-3 mb-4">
            <h6 className="fw-semibold mb-2">💳 Complete Payment</h6>

            <p className="small mb-1">
              UPI ID: <strong>{order.upiId || 'vigneshvickysvva@oksbi'}</strong>
            </p>

            <button
              className="btn btn-sm btn-outline-secondary mb-2"
              onClick={() => {
                navigator.clipboard.writeText(order.upiId || 'vigneshvickysvva@oksbi');
                alert("UPI ID copied!");
              }}
            >
              📋 Copy
            </button>

            <p className="small text-muted">Scan to Pay</p>

            <img
              src={order.qrCode || "/phonepe-qr.jpeg"}
              alt="QR Code"
              style={{
                width: '180px',
                height: '180px',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />

            <a
              href={`upi://pay?pa=${order.upiId}&pn=Store&am=${order.totalAmount}&cu=INR`}
              className="btn btn-success mt-3"
            >
              Pay Now
            </a>

            <p className="text-warning small mt-2">
              After payment, share screenshot to confirm order.
            </p>
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <Link to="/orders" className="btn btn-success">
              View My Orders
            </Link>
            <Link to="/products" className="btn btn-outline-success">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-success"></div>
        <p className="mt-3">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>

      <h4 className="fw-bold mb-4">💳 Checkout</h4>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          ⚠️ {error}
        </div>
      )}

      {/* ADDRESS */}
      <div className="card p-4 mb-3">
        <h6 className="mb-3">📍 Shipping Address</h6>

        {address ? (
          <>
            <p>📍 {address}</p>
            <Link to="/profile" className="btn btn-sm btn-outline-secondary">
              Edit Address
            </Link>
          </>
        ) : (
          <>
            <p className="text-danger">
              ⚠️ No address found. Please update your profile.
            </p>
            <Link to="/profile" className="btn btn-sm btn-outline-danger">
              Add Address
            </Link>
          </>
        )}
      </div>

      {/* PAYMENT METHOD */}
      <div className="card p-4 mb-4">
        <h6 className="mb-3">💳 Payment Method</h6>

        {['UPI', 'Cash on Delivery'].map(method => (
          <div key={method} className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              value={method}
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
            />
            <label className="form-check-label">
              {method === 'UPI'
                ? '📱 UPI (GPay / PhonePe / Paytm)'
                : '💵 Cash on Delivery'}
            </label>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="card p-4 mb-4 bg-light">
        <h6>
          Order for: <span className="text-success">{user?.name || user?.email}</span>
        </h6>
      </div>

      {/* BUTTON */}
      <button
        className="btn btn-success w-100 py-3"
        onClick={placeOrder}
        disabled={loading || !address}
      >
        {loading ? 'Placing Order...' : 'Place Order →'}
      </button>

    </div>
  );
};

export default Checkout;