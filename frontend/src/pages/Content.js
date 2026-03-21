import { useState } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';

const AdminContent = () => {

    const [form, setForm] = useState({
        page: 'home',
        sections: []
    });
    const [logo, setLogo] = useState(null);
    
    const addSection = () => {
        setForm({
            ...form,
            sections: [...form.sections, { title: '', description: '' }]
        });
    };

    const handleChange = (index, field, value) => {
        const updated = [...form.sections];
        updated[index][field] = value;

        setForm({ ...form, sections: updated });
    };

     const saveContent = async () => {

    const data = new FormData();

    data.append('page', form.page);
    data.append('sections', JSON.stringify(form.sections));

    if (logo) data.append('logo', logo);

    await API.post('/content', data);

    alert('Saved');
  };


    return (
        <AdminLayout>
            <h2>📝 Edit Content</h2>
            <input
                type="file"
                className="form-control mb-3"
                onChange={(e) => setLogo(e.target.files[0])}
            />
            <button className="btn btn-success mb-2" onClick={addSection}>
                Add Section
            </button>

            {form.sections.map((sec, i) => (
                <div key={i} className="mb-3">
                    <input
                        className="form-control mb-1"
                        placeholder="Title"
                        onChange={(e) => handleChange(i, 'title', e.target.value)}
                    />
                    <textarea
                        className="form-control"
                        placeholder="Description"
                        onChange={(e) => handleChange(i, 'description', e.target.value)}
                    />
                </div>
            ))}

            <button className="btn btn-primary" onClick={saveContent}>
                Save
            </button>

        </AdminLayout>
    );
};

export default AdminContent;