import { useEffect, useState } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';
import Toast from '../components/Toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend
} from 'recharts';

const INCOME_CATS  = ['sales', 'pos_sales', 'bulk_order', 'other'];
const EXPENSE_CATS = ['supplier', 'packaging', 'rent', 'salary', 'marketing', 'utilities', 'transport', 'maintenance', 'other'];

const today = () => new Date().toISOString().split('T')[0];
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]; };

const emptyForm = { type: 'expense', category: '', amount: '', description: '', date: today() };

const Finance = () => {
  const [entries, setEntries]   = useState([]);
  const [summary, setSummary]   = useState({ income: 0, expense: 0, profit: 0, chartData: [] });
  const [form, setForm]         = useState(emptyForm);
  const [filters, setFilters]   = useState({ type: '', category: '', from: monthStart(), to: today() });
  const [toast, setToast]       = useState(null);
  const [saving, setSaving]     = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading]   = useState(true);

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type)     params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.from)     params.append('from', filters.from);
      if (filters.to)       params.append('to', filters.to);

      const [entriesRes, summaryRes] = await Promise.all([
        API.get(`/finance?${params}`),
        API.get(`/finance/summary?from=${filters.from}&to=${filters.to}`)
      ]);
      setEntries(entriesRes.data);
      setSummary(summaryRes.data);
    } catch { showToast('Failed to load data', 'danger'); }
    finally  { setLoading(false); }
  };

  useEffect(() => { load(); }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/finance', form);
      showToast('Entry added');
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch { showToast('Failed to add entry', 'danger'); }
    finally  { setSaving(false); }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm('Delete this entry?')) return;
    try {
      await API.delete(`/finance/${id}`);
      showToast('Entry deleted');
      load();
    } catch { showToast('Failed to delete', 'danger'); }
  };

  const exportCSV = () => {
    const rows = [['Date','Type','Category','Source','Amount','Description']];
    entries.forEach(e => rows.push([
      new Date(e.date).toLocaleDateString('en-IN'),
      e.type, e.category, e.source, e.amount, e.description || ''
    ]));
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href = url;
    a.download = `finance_${filters.from}_${filters.to}.csv`; a.click();
  };

  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Finance</h4>
          <p className="text-muted small mb-0">Income &amp; Expense tracker</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success btn-sm px-3" onClick={exportCSV} style={{ borderRadius: '8px' }}>⬇ CSV</button>
          <button className="btn btn-success px-3" onClick={() => setShowForm(!showForm)} style={{ borderRadius: '8px' }}>
            {showForm ? '✕ Cancel' : '+ Add Entry'}
          </button>
        </div>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px', borderLeft: '4px solid #2e7d32' }}>
          <h6 className="fw-semibold mb-3">New Entry</h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-2">
                <label className="form-label small text-muted">Type *</label>
                <select required className="form-select" value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value, category: '' })}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">Category *</label>
                <select required className="form-select" value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select</option>
                  {cats.map(c => <option key={c} value={c}>{c.replace('_',' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label small text-muted">Amount (₹) *</label>
                <input required type="number" min="0" className="form-control" placeholder="0"
                  value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div className="col-md-2">
                <label className="form-label small text-muted">Date *</label>
                <input required type="date" className="form-control" value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label small text-muted">Description</label>
                <input className="form-control" placeholder="Optional note"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>
            <div className="mt-3">
              <button type="submit" className="btn btn-success px-4" disabled={saving} style={{ borderRadius: '8px' }}>
                {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Add Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Income',   value: summary.income,  color: '#1b5e20', bg: '#e8f5e9', border: '#a5d6a7', icon: '💰' },
          { label: 'Total Expenses', value: summary.expense, color: '#b71c1c', bg: '#fce4ec', border: '#ef9a9a', icon: '💸' },
          { label: 'Net Profit',     value: summary.profit,  color: summary.profit >= 0 ? '#1b5e20' : '#b71c1c', bg: summary.profit >= 0 ? '#e8f5e9' : '#fce4ec', border: summary.profit >= 0 ? '#a5d6a7' : '#ef9a9a', icon: summary.profit >= 0 ? '📈' : '📉' }
        ].map(c => (
          <div key={c.label} className="col-md-4">
            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px', background: c.bg, borderLeft: `4px solid ${c.border}` }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">{c.label}</p>
                  <h3 className="fw-bold mb-0" style={{ color: c.color }}>₹{c.value.toLocaleString('en-IN')}</h3>
                </div>
                <span style={{ fontSize: '2rem' }}>{c.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {summary.chartData?.length > 0 && (
        <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '16px' }}>
          <h6 className="fw-bold mb-3">Monthly Income vs Expense</h6>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={summary.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
              <Legend />
              <Bar dataKey="income"  fill="#2e7d32" radius={[4,4,0,0]} name="Income" />
              <Bar dataKey="expense" fill="#e53935" radius={[4,4,0,0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select form-select-sm" style={{ maxWidth: '130px' }}
          value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="date" className="form-control form-control-sm" style={{ maxWidth: '150px' }}
          value={filters.from} onChange={e => setFilters({ ...filters, from: e.target.value })} />
        <input type="date" className="form-control form-control-sm" style={{ maxWidth: '150px' }}
          value={filters.to} onChange={e => setFilters({ ...filters, to: e.target.value })} />
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setFilters({ type:'', category:'', from: monthStart(), to: today() })}>Reset</button>
      </div>

      {/* Entries Table */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
      ) : entries.length === 0 ? (
        <div className="text-center py-5"><div style={{ fontSize:'3rem' }}>📒</div><p className="text-muted mt-3">No entries found</p></div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <table className="table table-hover mb-0">
            <thead style={{ background: '#f1f8e9' }}>
              <tr>
                <th className="py-3 ps-4 border-0" style={{ color: '#1b5e20' }}>Date</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Type</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Category</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Source</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Description</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}>Amount</th>
                <th className="py-3 border-0" style={{ color: '#1b5e20' }}></th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e._id}>
                  <td className="ps-4 py-3 align-middle text-muted small">{new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                  <td className="py-3 align-middle">
                    <span className={`badge px-2 ${e.type==='income' ? 'bg-success' : 'bg-danger'}`}>{e.type}</span>
                  </td>
                  <td className="py-3 align-middle small">{e.category.replace('_',' ')}</td>
                  <td className="py-3 align-middle small text-muted">{e.source}</td>
                  <td className="py-3 align-middle small text-muted" style={{ maxWidth:'200px', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis' }}>{e.description}</td>
                  <td className="py-3 align-middle fw-bold" style={{ color: e.type==='income' ? '#2e7d32' : '#c62828' }}>
                    {e.type==='income' ? '+' : '-'}₹{e.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 align-middle">
                    {e.source === 'manual' && (
                      <button className="btn btn-outline-danger btn-sm" style={{ borderRadius:'6px' }} onClick={() => deleteEntry(e._id)}>✕</button>
                    )}
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

export default Finance;
