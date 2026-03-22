// File: src/pages/product.js
import { useEffect, useState } from 'react';
import API from '../services/api';
import { mediaUrl } from '../services/media';
import AdminLayout from '../layouts/AdminLayout';
import Toast from '../components/Toast';

const CATEGORIES = ['rice', 'millets', 'dairy', 'others'];

const emptyForm = {
  name: '',
  price: '',
  oldPrice: '',
  category: '',
  stock: '',
  unit: '',
  message: '',
  description: '',
  image: ''
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = () => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => showToast('Failed to load products', 'danger'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Create FormData for both add & edit
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('price', form.price.toString());
    fd.append('oldPrice', (form.oldPrice || 0).toString());
    fd.append('stock', form.stock.toString());
    fd.append('unit', form.unit);
    fd.append('category', form.category);
    fd.append('description', form.description);
    fd.append('message', form.message);
    if (imageFile) fd.append('image', imageFile);

    if (editId) {
      await API.put(`/products/${editId}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Product updated successfully');
    } else {
      await API.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('Product added successfully');
    }

    resetForm();
    fetchProducts();
  } catch (err) {
    console.error('Product submit error:', err);
    showToast(err.response?.data?.msg || 'Operation failed', 'danger');
  } finally {
    setSaving(false);
  }
};

  const editProduct = (p) => {
    setForm({ 
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice || '',
      category: p.category,
      stock: p.stock,
      unit: p.unit || 'count',
      message: p.message || '',
      description: p.description || '',
      image: p.image || ''
    });
    setEditId(p._id);
    setImageFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/products/${id}`);
      showToast(`${name} deleted`);
      fetchProducts();
    } catch (err) {
      console.error('Delete product error:', err);
      showToast('Failed to delete product', 'danger');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Products</h4>
          <p className="text-muted small mb-0">{products.length} total products</p>
        </div>
        <button
          className="btn btn-success px-3"
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          style={{ borderRadius: '10px' }}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px', borderLeft: '4px solid #2e7d32' }}>
          <h6 className="fw-semibold mb-3">{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Name */}
              <div className="col-md-6">
                <label className="form-label">Product Name</label>
                <input required className="form-control"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Price & Old Price */}
              <div className="col-md-3">
                <label className="form-label">Price</label>
                <input type="number" required className="form-control"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Old Price</label>
                <input type="number" className="form-control"
                  value={form.oldPrice}
                  onChange={e => setForm({ ...form, oldPrice: e.target.value })}
                />
              </div>

              {/* Category, Stock, Unit */}
              <div className="col-md-4">
                <label className="form-label">Category</label>
                <select className="form-select"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Stock</label>
                <input type="number" className="form-control"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Unit</label>
                <select className="form-select"
                  value={form.unit}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                >
                  <option value="kg">Kg</option>
                  <option value="liter">Liter</option>
                  <option value="count">Count</option>
                </select>
              </div>

              {/* Message & Description */}
              <div className="col-md-6">
                <label className="form-label">Message (optional)</label>
                <input className="form-control"
                  placeholder="e.g. Fresh stock, Limited offer"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Description</label>
                <input className="form-control"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Image */}
              <div className="col-md-6">
                <label className="form-label">Product Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                {imageFile && <p className="small mt-1">{imageFile.name}</p>}
                {!imageFile && editId && form.image && (
                  <div className="mt-2">
                    <img src={mediaUrl(form.image)} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-3 d-flex gap-2">
              <button type="submit" className="btn btn-success px-4" disabled={saving} style={{ borderRadius: '8px' }}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : (editId ? 'Update Product' : 'Add Product')}
              </button>
              <button type="button" className="btn btn-outline-secondary px-4" onClick={resetForm} style={{ borderRadius: '8px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="mb-3">
        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input type="text" className="form-control border-start-0" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} style={{ boxShadow: 'none' }} />
        </div>
      </div>

      {/* Product Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem' }}>📦</div>
          <p className="text-muted mt-3">{search ? 'No products match your search' : 'No products yet. Add your first product!'}</p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <table className="table table-hover mb-0">
            <thead style={{ background: '#f1f8e9' }}>
              <tr>
                <th className="py-3 ps-4 border-0" style={{ color: '#1b5e20' }}>Name</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Category</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Price</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Stock</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p._id}>
                  <td className="ps-4 py-3 align-middle">
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f1f8e9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                        {p.image
                          ? <img src={mediaUrl(p.image)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '1.2rem' }}>{p.category === 'rice' ? '🌾' : p.category === 'millets' ? '🌿' : p.category === 'dairy' ? '🥛' : '🛒'}</span>
                        }
                      </div>
                      <div>
                        <span className="fw-medium">{p.name}</span>
                        {p.description && <p className="text-muted small mb-0" style={{ maxWidth: '180px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 align-middle">
                    <span className="badge rounded-pill px-3" style={{ background: '#e8f5e9', color: '#2e7d32' }}>{p.category}</span>
                  </td>
                  <td className="py-3 align-middle fw-semibold" style={{ color: '#2e7d32' }}>₹{p.price}</td>
                  <td className="py-3 align-middle">
                    <span className={`badge ${p.stock > 10 ? 'bg-success' : p.stock > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                      {p.message || `${p.stock} ${p.unit}${p.stock > 1 ? 's' : ''}`}
                    </span>
                  </td>
                  <td className="py-3 align-middle">
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => editProduct(p)} style={{ borderRadius: '6px' }}>Edit</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => deleteProduct(p._id, p.name)} style={{ borderRadius: '6px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;