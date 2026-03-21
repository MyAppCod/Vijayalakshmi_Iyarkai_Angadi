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

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async (product) => {
    if (!user) {
      showToast('Please login to add items to cart', 'warning');
      return;
    }
    try {
      await API.post('/cart', { productId: product._id, quantity: 1 });
      showToast(`${product.name} added to cart!`);
    } catch (err) {
      showToast('Failed to add to cart', 'danger');
    }
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryLabel = (cat) => {
    const map = { rice: '🌾 Rice', millets: '🌿 Millets', dairy: '🥛 Dairy', others: '🛒 Others', All: '🏪 All' };
    return map[cat] || cat;
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Page Header */}
      <div className="py-4 mb-4" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)' }}>
        <div className="container text-white text-center">
          <h2 className="fw-bold mb-1">Our Products</h2>
          <p className="mb-0 opacity-75">Fresh from farm to your table</p>
        </div>
      </div>

      <div className="container pb-5">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="input-group" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <span className="input-group-text bg-white border-end-0">🔍</span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ boxShadow: 'none' }}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill px-3 ${activeCategory === cat ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-muted small mb-3">
            Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
          </p>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="row">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="placeholder-glow">
                    <div className="placeholder" style={{ height: '180px', width: '100%', borderRadius: '8px 8px 0 0' }}></div>
                  </div>
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <span className="placeholder col-8 mb-2 d-block"></span>
                      <span className="placeholder col-4 mb-3 d-block"></span>
                      <span className="placeholder col-12 btn"></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <h5 className="mt-3 text-muted">No products found</h5>
            <p className="text-muted">Try a different search or category</p>
            <button className="btn btn-outline-success" onClick={() => { setSearch(''); setActiveCategory('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="row">
            {filtered.map(product => (
              <div key={product._id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                <div className="card h-100 border-0 shadow-sm product-card" style={{ transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
                >
                  {/* Product Image */}
                  <div style={{ height: '180px', overflow: 'hidden', borderRadius: '8px 8px 0 0', background: '#f1f8e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.image ? (
                      <img
                        src={mediaUrl(product.image)}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <div style={{ display: product.image ? 'none' : 'flex', fontSize: '3rem', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      {product.category === 'rice' ? '🌾' : product.category === 'millets' ? '🌿' : product.category === 'dairy' ? '🥛' : '🛒'}
                    </div>
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    {/* Category badge */}
                    <span className="badge rounded-pill mb-2" style={{ background: '#e8f5e9', color: '#2e7d32', width: 'fit-content', fontSize: '11px' }}>
                      {product.category}
                    </span>

                    <h6 className="card-title fw-semibold mb-1" style={{ color: '#1b5e20' }}>{product.name}</h6>

                    {product.description && (
                      <p className="text-muted small mb-2" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {product.description}
                      </p>
                    )}

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold fs-5" style={{ color: '#2e7d32' }}>₹{product.price}</span>
                        <span className={`small ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                          {product.stock > 0 ? `✓ In stock (${product.stock})` : '✗ Out of stock'}
                        </span>
                      </div>

                      <button
                        className="btn btn-success w-100 btn-sm py-2"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
                      </button>
                    </div>
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
