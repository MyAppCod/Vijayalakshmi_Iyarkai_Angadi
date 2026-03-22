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
  description: ''
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
        const payload = {
          ...form,
          price: Number(form.price),
          oldPrice: Number(form.oldPrice),
          stock: Number(form.stock)
        };
        await API.put(`/products/${editId}`, payload);
        showToast('Product updated successfully');
      } else {
        const fd = new FormData();
        fd.append('name', form.name);
        fd.append('price', Number(form.price));
        fd.append('oldPrice', Number(form.oldPrice));
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
      oldPrice: p.oldPrice || '',
      category: p.category,
      stock: p.stock,
      description: p.description || ''
    });
    setEditId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
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
        <h4>Products</h4>
        <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input className="form-control mb-2" placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />

          <input type="number" className="form-control mb-2" placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })} />

          <input type="number" className="form-control mb-2" placeholder="Old Price"
            value={form.oldPrice}
            onChange={e => setForm({ ...form, oldPrice: e.target.value })} />

          <input type="number" className="form-control mb-2" placeholder="Stock"
            value={form.stock}
            onChange={e => setForm({ ...form, stock: e.target.value })} />

          <select className="form-select mb-2"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Select</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <input className="form-control mb-2" placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })} />

          <input type="file" className="form-control mb-2"
            onChange={e => setImageFile(e.target.files[0])} />

          <button className="btn btn-success">
            {editId ? 'Update' : 'Add'}
          </button>
        </form>
      )}

      <table className="table">
        <tbody>
          {filtered.map(p => (
            <tr key={p._id}>
              <td>
                <div className="d-flex gap-3">
                  {p.image && <img src={mediaUrl(p.image)} width="40" />}

                  <div>
                    <b>{p.name}</b>

                    {/* DESCRIPTION */}
                    {p.description && (
                      <div style={{ maxWidth: '200px' }}>
                        <p
                          className="text-muted small mb-0"
                          style={{
                            maxHeight: expandedId === p._id ? '200px' : '20px',
                            overflow: 'hidden',
                            transition: '0.3s'
                          }}
                        >
                          {p.description}
                        </p>

                        {p.description.length > 40 && (
                          <button
                            className="btn btn-link p-0 small"
                            onClick={() =>
                              setExpandedId(expandedId === p._id ? null : p._id)
                            }
                          >
                            {expandedId === p._id ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td>{p.category}</td>

              {/* PRICE UI */}
              <td>
                {p.oldPrice && p.oldPrice > p.price && (
                  <span style={{ textDecoration: 'line-through', color: '#888', marginRight: 6 }}>
                    ₹{p.oldPrice}
                  </span>
                )}
                <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                  ₹{p.price}
                </span>

                {p.oldPrice && p.oldPrice > p.price && (
                  <span style={{ color: 'red', fontSize: 12, marginLeft: 6 }}>
                    {Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}% OFF
                  </span>
                )}
              </td>

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