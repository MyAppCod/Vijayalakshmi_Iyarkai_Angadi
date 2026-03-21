import { useState } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';

const AddProduct = () => {

  const [form, setForm] = useState({
    name: '',
    category: 'rice',
    price: '',
    stock: '',
    description: ''
  });

  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    if (image) data.append('image', image);

    await API.post('/products', data);

    alert('Product added');
  };

  return (
    <AdminLayout>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <select className="form-control mb-2"
          onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="rice">Rice</option>
          <option value="millets">Millets</option>
          <option value="dairy">Dairy</option>
          <option value="others">Others</option>
        </select>

        <input className="form-control mb-2" placeholder="Price"
          onChange={e => setForm({ ...form, price: e.target.value })} />

        <input className="form-control mb-2" placeholder="Stock"
          onChange={e => setForm({ ...form, stock: e.target.value })} />

        <textarea className="form-control mb-2" placeholder="Description"
          onChange={e => setForm({ ...form, description: e.target.value })} />

        <input type="file" className="form-control mb-2"
          onChange={e => setImage(e.target.files[0])} />

        <button className="btn btn-success">Save</button>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;