import { useEffect, useState } from 'react';
import API from '../services/api';
import { mediaUrl } from '../services/media';
import AdminLayout from '../layouts/AdminLayout';
import Toast from '../components/Toast';

const CATEGORIES = ['rice', 'millets', 'dairy', 'others'];

const emptyForm = { name: '', price: '', category: '', stock: '', description: '' };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        // PUT — no multer on this route, send JSON
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
        await API.put(`/products/${editId}`, payload);
        showToast('Product updated successfully');
      } else {
        // POST — multer expects multipart/form-data
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('price', Number(form.price));
        fd.append('stock', Number(form.stock));
        fd.append('category', form.category);
        fd.append('description', form.description);
        if (imageFile) fd.append('image', imageFile);
        await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        showToast('Product added successfully');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.msg || 'Operation failed', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditId(null);
    setShowForm(false);
  };

  const editProduct = (p) => {
    setForm({ name: p.name, price: p.price, category: p.category, stock: p.stock, description: p.description || '' });
    setEditId(p._id);
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
      showToast('Failed to delete product', 'danger');
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} />}

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
              <div className="col-md-6">
                <label className="form-label small text-muted">Product Name *</label>
                <input required name="name" className="form-control" placeholder="e.g. Organic Basmati Rice" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">Price (₹) *</label>
                <input required type="number" min="0" name="price" className="form-control" placeholder="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">Stock *</label>
                <input required type="number" min="0" name="stock" className="form-control" placeholder="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="col-md-4">
                <label className="form-label small text-muted">Category *</label>
                <select required name="category" className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="col-md-5">
                <label className="form-label small text-muted">Description</label>
                <input name="description" className="form-control" placeholder="Brief product description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              {!editId && (
                <div className="col-md-3">
                  <label className="form-label small text-muted">Product Image <span className="text-muted">(optional)</span></label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={e => setImageFile(e.target.files[0] || null)}
                  />
                  {imageFile && <p className="text-muted small mt-1 mb-0">✓ {imageFile.name}</p>}
                </div>
              )}
            </div>
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

      {/* Table */}
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
                      {p.stock} units
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
