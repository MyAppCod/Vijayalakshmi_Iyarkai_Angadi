import { useEffect, useState } from 'react';
import API from '../services/api';
import { mediaUrl } from '../services/media';
import { useNavigate, Link } from 'react-router-dom';
import Toast from '../components/Toast';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadCart = () => {
    API.get('/cart')
      .then(res => setCart(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCart(); }, []);

  const updateQty = async (productId, quantity) => {
    setUpdatingId(productId);
    try {
      await API.put('/cart', { productId, quantity });
      loadCart();
    } catch (err) {
      showToast('Failed to update quantity', 'danger');
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId, name) => {
    try {
      await API.delete(`/cart/${productId}`);
      showToast(`${name} removed from cart`, 'info');
      loadCart();
    } catch (err) {
      showToast('Failed to remove item', 'danger');
    }
  };

  const total = cart?.items?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const itemCount = cart?.items?.length || 0;

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-success" role="status"></div>
      <p className="mt-3 text-muted">Loading cart...</p>
    </div>
  );

  return (
    <div className="container py-4">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0">🛒 Your Cart</h2>
        {itemCount > 0 && <span className="badge bg-success ms-2">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>}
      </div>

      {!cart || cart.items?.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>🛒</div>
          <h5 className="mt-3">Your cart is empty</h5>
          <p className="text-muted">Add some organic goodness to get started</p>
          <Link to="/products" className="btn btn-success px-4" style={{ borderRadius: '20px' }}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items */}
          <div className="col-lg-8">
            {cart.items.map(item => (
              <div key={item._id} className="card border-0 shadow-sm mb-3 p-3" style={{ borderRadius: '12px' }}>
                <div className="d-flex align-items-center gap-3">
                  {/* Product image/icon */}
                  <div style={{ width: '64px', height: '64px', background: '#f1f8e9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0, overflow: 'hidden' }}>
                    {item.product?.image ? (
                      <img src={mediaUrl(item.product.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      item.product?.category === 'rice' ? '🌾' : item.product?.category === 'millets' ? '🌿' : item.product?.category === 'dairy' ? '🥛' : '🛒'
                    )}
                  </div>

                  {/* Product info */}
                  <div className="flex-grow-1">
                    <h6 className="mb-1 fw-semibold" style={{ color: '#1b5e20' }}>{item.product.name}</h6>
                    <p className="mb-0 text-muted small">{item.product.category}</p>
                    <p className="mb-0 fw-bold" style={{ color: '#2e7d32' }}>₹{item.product.price} each</p>
                  </div>

                  {/* Qty controls */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      style={{ width: '30px', height: '30px', padding: 0, lineHeight: 1 }}
                      onClick={() => updateQty(item.product._id, item.quantity - 1)}
                      disabled={updatingId === item.product._id || item.quantity <= 1}
                    >−</button>
                    <span className="fw-semibold" style={{ minWidth: '24px', textAlign: 'center' }}>
                      {updatingId === item.product._id ? (
                        <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }}></span>
                      ) : item.quantity}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      style={{ width: '30px', height: '30px', padding: 0, lineHeight: 1 }}
                      onClick={() => updateQty(item.product._id, item.quantity + 1)}
                      disabled={updatingId === item.product._id}
                    >+</button>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="text-end" style={{ minWidth: '90px' }}>
                    <p className="fw-bold mb-1">₹{item.product.price * item.quantity}</p>
                    <button
                      className="btn btn-link text-danger p-0 small text-decoration-none"
                      onClick={() => removeItem(item.product._id, item.product.name)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: '16px', top: '80px' }}>
              <h5 className="fw-bold mb-3">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal ({itemCount} items)</span>
                <span>₹{total}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-5" style={{ color: '#2e7d32' }}>₹{total}</span>
              </div>
              <button
                className="btn btn-success w-100 py-2 fw-semibold"
                style={{ borderRadius: '10px' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>
              <Link to="/products" className="btn btn-outline-secondary w-100 mt-2 py-2" style={{ borderRadius: '10px' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
