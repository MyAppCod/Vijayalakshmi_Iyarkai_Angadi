import { useEffect, useState } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';

const STAT_CARDS = [
  { key: 'products', label: 'Products', icon: '📦', color: '#1b5e20', bg: '#e8f5e9', border: '#a5d6a7' },
  { key: 'orders', label: 'Orders', icon: '🛒', color: '#0d47a1', bg: '#e3f2fd', border: '#90caf9' },
  { key: 'users', label: 'Customers', icon: '👥', color: '#6a1b9a', bg: '#f3e5f5', border: '#ce93d8' },
  { key: 'revenue', label: 'Revenue', icon: '💰', color: '#e65100', bg: '#fff3e0', border: '#ffcc80', prefix: '₹' }
];

const Dashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0, chartData: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard')
      .then(res => setStats({
        products: res.data.products || 0,
        orders: res.data.orders || 0,
        users: res.data.users || 0,
        revenue: res.data.revenue || 0,
        chartData: res.data.chartData || []
      }))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="d-flex align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0">Dashboard Overview</h4>
          <p className="text-muted small mb-0">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {loading ? (
        <div className="row g-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="col-sm-6 col-xl-3">
              <div className="card border-0 shadow-sm p-4">
                <div className="placeholder-glow">
                  <span className="placeholder col-6 mb-2 d-block"></span>
                  <span className="placeholder col-4 d-block" style={{ height: '2rem' }}></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {STAT_CARDS.map(card => (
              <div key={card.key} className="col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm h-100 p-3" style={{ borderRadius: '16px', borderLeft: `4px solid ${card.border}`, background: card.bg }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-muted small mb-1 fw-medium">{card.label}</p>
                      <h3 className="fw-bold mb-0" style={{ color: card.color }}>
                        {card.prefix}{card.key === 'revenue' ? stats[card.key].toLocaleString('en-IN') : stats[card.key]}
                      </h3>
                    </div>
                    <div style={{ fontSize: '2rem', opacity: 0.8 }}>{card.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
            <h6 className="fw-bold mb-4">📈 Monthly Revenue</h6>
            {stats.chartData.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '3rem' }}>📊</div>
                <p className="text-muted mt-3">No order data available yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#2e7d32" radius={[6, 6, 0, 0]} name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
