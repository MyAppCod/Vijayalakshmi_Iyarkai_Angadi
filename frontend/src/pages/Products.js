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

  // ✅ NEW STATE FOR READ MORE
  const [expandedId, setExpandedId] = useState(null);

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
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
        await API.put(`/products/${editId}`, payload);
        showToast('Product updated successfully');
      } else {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('price', Number(form.price));
        fd.append('stock', Number(form.stock));
        fd.append('category', form.category);
        fd.append('description', form.description);
        if (imageFile) fd.append('image', imageFile);

        await API.post('/products', fd);
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
    setForm({
      name: p.name,
      price: p.price,
      category: p.category,
      stock: p.stock,
      description: p.description || ''
    });
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
    } catch {
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

      {/* FORM */}
      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px', borderLeft: '4px solid #2e7d32' }}>
          <h6 className="fw-semibold mb-3">{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input required className="form-control" placeholder="Product Name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>

              <div className="col-md-3">
                <input required type="number" className="form-control" placeholder="Price"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })} />
              </div>

              <div className="col-md-3">
                <input required type="number" className="form-control" placeholder="Stock"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>

              <div className="col-md-4">
                <select className="form-select"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="col-md-5">
                <input className="form-control" placeholder="Description"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              {!editId && (
                <div className="col-md-3">
                  <input type="file" className="form-control"
                    onChange={e => setImageFile(e.target.files[0])} />
                </div>
              )}
            </div>

            <button className="btn btn-success mt-3">
              {editId ? 'Update' : 'Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* TABLE */}
      <table className="table">
        <tbody>
          {filtered.map(p => (
            <tr key={p._id}>
              <td>
                <div className="d-flex gap-3">
                  {p.image && <img src={mediaUrl(p.image)} width="40" />}

                  <div>
                    <b>{p.name}</b>

                    {/* ✅ READ MORE FEATURE */}
                    {p.description && (
                      <div style={{ maxWidth: '180px' }}>
                        <p
                          className="text-muted small mb-0"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: expandedId === p._id ? 'unset' : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {p.description}
                        </p>

                        {p.description.length > 40 && (
                          <span
                            style={{
                              color: '#2e7d32',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                            onClick={() =>
                              setExpandedId(expandedId === p._id ? null : p._id)
                            }
                          >
                            {expandedId === p._id ? 'Show less' : 'Read more'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>

              <td>
                <button onClick={() => editProduct(p)}>Edit</button>
                <button onClick={() => deleteProduct(p._id, p.name)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminProducts;