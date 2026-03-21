import { useEffect, useState } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const COLORS = ['#2e7d32','#e53935','#1565c0','#e65100','#6a1b9a','#00838f','#558b2f','#ad1457'];

const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0]; };
const today      = () => new Date().toISOString().split('T')[0];

const Reports = () => {
  const [summary, setSummary]     = useState(null);
  const [topProducts, setTop]     = useState([]);
  const [expensePie, setExpPie]   = useState([]);
  const [trend, setTrend]         = useState([]);
  const [from, setFrom]           = useState(monthStart());
  const [to, setTo]               = useState(today());
  const [loading, setLoading]     = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = `from=${from}&to=${to}`;
      const [s, tp, ep, tr] = await Promise.all([
        API.get(`/reports/summary?${params}`),
        API.get(`/reports/top-products?${params}`),
        API.get(`/reports/expenses-by-category?${params}`),
        API.get('/reports/monthly-trend')
      ]);
      setSummary(s.data);
      setTop(tp.data);
      setExpPie(ep.data.map(e => ({ name: e._id, value: e.total })));
      setTrend(tr.data);
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [from, to]);

  const PRESET = [
    { label: 'Today',       from: today(),      to: today() },
    { label: 'This Month',  from: monthStart(), to: today() },
    { label: 'This Year',   from: `${new Date().getFullYear()}-01-01`, to: today() }
  ];

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Reports</h4>
          <p className="text-muted small mb-0">Business performance overview</p>
        </div>
      </div>

      {/* Date Range */}
      <div className="d-flex flex-wrap gap-2 align-items-center mb-4">
        {PRESET.map(p => (
          <button key={p.label} className="btn btn-sm btn-outline-success" style={{ borderRadius:'20px' }}
            onClick={() => { setFrom(p.from); setTo(p.to); }}>{p.label}</button>
        ))}
        <input type="date" className="form-control form-control-sm" style={{ maxWidth:'150px' }} value={from} onChange={e => setFrom(e.target.value)} />
        <span className="text-muted small">to</span>
        <input type="date" className="form-control form-control-sm" style={{ maxWidth:'150px' }} value={to} onChange={e => setTo(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="row g-3 mb-4">
            {[
              { label:'Total Income',    value:`₹${summary?.income?.toLocaleString('en-IN')||0}`,   icon:'💰', color:'#1b5e20', bg:'#e8f5e9', border:'#a5d6a7' },
              { label:'Total Expenses',  value:`₹${summary?.expense?.toLocaleString('en-IN')||0}`,  icon:'💸', color:'#b71c1c', bg:'#fce4ec', border:'#ef9a9a' },
              { label:'Net Profit',      value:`₹${summary?.profit?.toLocaleString('en-IN')||0}`,   icon: summary?.profit >= 0 ? '📈':'📉', color: summary?.profit >= 0 ? '#1b5e20':'#b71c1c', bg: summary?.profit >= 0 ? '#e8f5e9':'#fce4ec', border: summary?.profit >= 0 ? '#a5d6a7':'#ef9a9a' },
              { label:'Online Revenue',  value:`₹${summary?.onlineRevenue?.toLocaleString('en-IN')||0}`, icon:'🌐', color:'#0d47a1', bg:'#e3f2fd', border:'#90caf9' },
              { label:'POS Revenue',     value:`₹${summary?.posRevenue?.toLocaleString('en-IN')||0}`,    icon:'🏪', color:'#e65100', bg:'#fff3e0', border:'#ffcc80' },
              { label:'Online Orders',   value:summary?.orderCount||0, icon:'📦', color:'#1b5e20', bg:'#f1f8e9', border:'#c8e6c9' },
              { label:'POS Bills',       value:summary?.billCount||0,  icon:'🧾', color:'#4a148c', bg:'#f3e5f5', border:'#ce93d8' }
            ].map(c => (
              <div key={c.label} className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius:'14px', background:c.bg, borderLeft:`4px solid ${c.border}` }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1" style={{ fontSize:'12px' }}>{c.label}</p>
                      <h5 className="fw-bold mb-0" style={{ color:c.color }}>{c.value}</h5>
                    </div>
                    <span style={{ fontSize:'1.6rem' }}>{c.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            {/* Monthly Trend */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius:'16px' }}>
                <h6 className="fw-bold mb-3">📈 Monthly Trend (Last 12 Months)</h6>
                {trend.length === 0 ? (
                  <p className="text-muted text-center py-4">No data</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={trend} margin={{ top:5, right:20, left:0, bottom:5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize:11 }} />
                      <YAxis tick={{ fontSize:11 }} />
                      <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
                      <Legend />
                      <Line type="monotone" dataKey="income"  stroke="#2e7d32" strokeWidth={2} dot={false} name="Income" />
                      <Line type="monotone" dataKey="expense" stroke="#e53935" strokeWidth={2} dot={false} name="Expense" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Expense Pie */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius:'16px' }}>
                <h6 className="fw-bold mb-3">🥧 Expenses by Category</h6>
                {expensePie.length === 0 ? (
                  <p className="text-muted text-center py-4">No expenses</p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={expensePie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                          {expensePie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-2">
                      {expensePie.map((e, i) => (
                        <div key={e.name} className="d-flex justify-content-between small mb-1">
                          <span><span style={{ display:'inline-block', width:'10px', height:'10px', borderRadius:'2px', background:COLORS[i%COLORS.length], marginRight:'6px' }}></span>{e.name}</span>
                          <span className="fw-medium">₹{e.value.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Online vs POS */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius:'16px' }}>
                <h6 className="fw-bold mb-3">🌐 Online vs 🏪 POS Revenue</h6>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={[{ name:'Revenue', Online: summary?.onlineRevenue||0, POS: summary?.posRevenue||0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" hide />
                    <YAxis tick={{ fontSize:11 }} />
                    <Tooltip formatter={v => `₹${v.toLocaleString('en-IN')}`} />
                    <Legend />
                    <Bar dataKey="Online" fill="#2e7d32" radius={[6,6,0,0]} />
                    <Bar dataKey="POS"    fill="#e65100" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4" style={{ borderRadius:'16px' }}>
                <h6 className="fw-bold mb-3">🏆 Top Selling Products (POS)</h6>
                {topProducts.length === 0 ? (
                  <p className="text-muted text-center py-4">No POS sales yet</p>
                ) : (
                  <div>
                    {topProducts.slice(0,8).map((p, i) => (
                      <div key={p._id} className="d-flex align-items-center gap-2 mb-2">
                        <span style={{ width:'22px', height:'22px', borderRadius:'50%', background: i<3 ? '#2e7d32':'#e8f5e9', color: i<3 ? '#fff':'#1b5e20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:700, flexShrink:0 }}>{i+1}</span>
                        <span className="flex-grow-1 small fw-medium">{p._id}</span>
                        <span className="text-muted small">{p.qty} sold</span>
                        <span className="fw-semibold small" style={{ color:'#2e7d32' }}>₹{p.revenue?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Reports;
