import { useEffect, useState, useContext } from 'react';
import API from '../services/api';
import { mediaUrl } from '../services/media';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';

const CATEGORIES = ['All', 'rice', 'millets', 'dairy', 'others'];

const ShopProducts = () => {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => showToast('Failed to load products', 'danger'))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleReadMore = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const addToCart = async (product) => {
    if (!user) {
      showToast('Please login to add items', 'warning');
      return;
    }
    try {
      await API.post('/cart', { productId: product._id, quantity: 1 });
      showToast(`${product.name} added to cart`);
    } catch {
      showToast('Failed to add', 'danger');
    }
  };

  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      activeCategory === 'All' || p.category === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fbf9' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* HEADER */}
      <div
        className="py-4 mb-4"
        style={{
          background: 'linear-gradient(135deg, #1b5e20, #43a047)'
        }}
      >
        <div className="container text-white text-center">
          <h2 className="fw-bold">🌿 Our Products</h2>
          <p className="opacity-75">Fresh & Natural</p>
        </div>
      </div>

      <div className="container pb-5">

        {/* SEARCH */}
        <div className="mb-4 text-center">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '400px', margin: 'auto', borderRadius: '20px' }}
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="d-flex justify-content-center gap-2 flex-wrap mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill px-3 ${
                activeCategory === cat ? 'btn-success' : 'btn-outline-success'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success"></div>
          </div>
        ) : (
          <div className="row">
            {filtered.map(product => (
              <div key={product._id} className="col-md-3 mb-4">
                <div
                  className="card border-0 shadow-sm h-100"
                  style={{
                    borderRadius: '16px',
                    transition: '0.3s'
                  }}
                >

                  {/* IMAGE */}
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={product.image ? mediaUrl(product.image) : ''}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  <div className="card-body d-flex flex-column">

                    {/* CATEGORY */}
                    <span className="badge bg-light text-success mb-2">
                      {product.category}
                    </span>

                    <h6 className="fw-bold">{product.name}</h6>

                    {/* DESCRIPTION */}
                    {product.description && (
                      <div className="mb-2">
                        <p className="text-muted small mb-1">
                          {expanded[product._id]
                            ? product.description
                            : product.description.slice(0, 60) +
                              (product.description.length > 60 ? '...' : '')}
                        </p>

                        {product.description.length > 60 && (
                          <span
                            style={{
                              color: '#2e7d32',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                            onClick={() => toggleReadMore(product._id)}
                          >
                            {expanded[product._id]
                              ? 'Show less'
                              : 'Read more'}
                          </span>
                        )}
                      </div>
                    )}

                    {/* PRICE */}
                    <div className="mb-2">
                      <span className="fw-bold text-success fs-5">
                        ₹{product.price}
                      </span>

                      {product.oldPrice > 0 && (
                        <span className="ms-2 text-muted text-decoration-line-through">
                          ₹{product.oldPrice}
                        </span>
                      )}
                    </div>

                    {/* MESSAGE */}
                    {product.message && (
                      <span className="badge bg-warning text-dark mb-2">
                        {product.message}
                      </span>
                    )}

                    {/* STOCK */}
                    <span className="small text-success mb-2">
                      {product.stock} {product.unit || 'items'} available
                    </span>

                    {/* BUTTON */}
                    <button
                      className="btn btn-success mt-auto rounded-pill"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0
                        ? 'Out of Stock'
                        : '🛒 Add to Cart'}
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProducts;