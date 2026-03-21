import { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import AdminLayout from '../layouts/AdminLayout';
import Toast from '../components/Toast';

const POS = () => {
  const [products, setProducts]       = useState([]);
  const [search, setSearch]           = useState('');
  const [activeCategory, setCategory] = useState('All');
  const [billItems, setBillItems]     = useState([]);
  const [discount, setDiscount]       = useState(0);
  const [paymentMethod, setPayment]   = useState('cash');
  const [customerName, setCustName]   = useState('');
  const [customerPhone, setCustPhone] = useState('');
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState(null);
  const [lastBill, setLastBill]       = useState(null);
  const printRef                      = useRef();

  const showToast = (msg, type='success') => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    API.get('/products').then(res => setProducts(res.data)).catch(() => showToast('Failed to load products','danger'));
  }, []);

  const CATEGORIES = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === 'All' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const addToBill = (product) => {
    if (product.stock === 0) { showToast(`${product.name} is out of stock`, 'warning'); return; }
    setBillItems(prev => {
      const existing = prev.find(i => i.productId === product._id);
      if (existing) {
        if (existing.quantity >= product.stock) { showToast('Not enough stock', 'warning'); return prev; }
        return prev.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, quantity: 1, stock: product.stock }];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) { setBillItems(prev => prev.filter(i => i.productId !== productId)); return; }
    setBillItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  };

  const totalAmount   = billItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const payableAmount = Math.max(0, totalAmount - Number(discount));

  const chargeBill = async () => {
    if (billItems.length === 0) { showToast('Add at least one item', 'warning'); return; }
    setSaving(true);
    try {
      const res = await API.post('/bills', {
        items: billItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
        discount: Number(discount), paymentMethod, customerName, customerPhone
      });
      setLastBill({ ...res.data, items: billItems, totalAmount, discount: Number(discount), payableAmount });
      showToast(`Bill ${res.data.billNumber} created!`);
      // Reset
      setBillItems([]); setDiscount(0); setCustName(''); setCustPhone(''); setPayment('cash');
      // Refresh product stock
      const updated = await API.get('/products');
      setProducts(updated.data);
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to create bill', 'danger');
    } finally { setSaving(false); }
  };

  const printBill = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Bill</title>
      <style>
        body { font-family: monospace; font-size: 13px; width: 300px; margin: 0 auto; padding: 16px; }
        h2 { text-align: center; font-size: 15px; margin-bottom: 4px; }
        p  { text-align: center; margin: 2px 0; font-size: 12px; }
        hr { border: none; border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { padding: 3px 0; }
        .right { text-align: right; }
        .total { font-weight: bold; font-size: 14px; }
        @media print { body { width: 100%; } }
      </style></head><body>
      <h2>VIJAYALAKSHMI IYARKAI ANGADI</h2>
      <p>Organic Products — Farm Fresh</p>
      <hr/>
      <p>Bill No: <b>${lastBill?.billNumber || ''}</b></p>
      <p>Date: ${new Date().toLocaleString('en-IN')}</p>
      ${lastBill?.customerName ? `<p>Customer: ${lastBill.customerName}${lastBill.customerPhone ? ' | ' + lastBill.customerPhone : ''}</p>` : ''}
      <hr/>
      <table>
        <tr><th>Item</th><th>Qty</th><th>Rate</th><th class="right">Amt</th></tr>
        <tr><td colspan="4"><hr/></td></tr>
        ${lastBill?.items?.map(i => `<tr><td>${i.name}</td><td>${i.quantity}</td><td>₹${i.price}</td><td class="right">₹${i.price * i.quantity}</td></tr>`).join('')}
        <tr><td colspan="4"><hr/></td></tr>
        <tr><td colspan="3">Subtotal</td><td class="right">₹${lastBill?.totalAmount}</td></tr>
        ${lastBill?.discount > 0 ? `<tr><td colspan="3">Discount</td><td class="right">-₹${lastBill.discount}</td></tr>` : ''}
        <tr class="total"><td colspan="3">Total</td><td class="right">₹${lastBill?.payableAmount}</td></tr>
        <tr><td colspan="4">Payment: ${lastBill?.paymentMethod?.toUpperCase()}</td></tr>
      </table>
      <hr/>
      <p>Thank you for shopping!</p>
      <p>Visit again 🌿</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const catIcon = c => ({ rice:'🌾', millets:'🌿', dairy:'🥛', others:'🛒' }[c] || '📦');

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="d-flex align-items-center mb-3">
        <h4 className="fw-bold mb-0">🏪 Point of Sale</h4>
      </div>

      <div className="row g-3" style={{ height: 'calc(100vh - 140px)' }}>

        {/* LEFT — Products */}
        <div className="col-lg-7 d-flex flex-column" style={{ overflow: 'hidden' }}>
          {/* Search + Category */}
          <div className="mb-2">
            <input className="form-control mb-2" placeholder="🔍 Search product..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ borderRadius: '10px' }} />
            <div className="d-flex flex-wrap gap-1">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`btn btn-sm rounded-pill px-3 ${activeCategory === c ? 'btn-success' : 'btn-outline-success'}`}>
                  {c === 'All' ? '🏪 All' : `${catIcon(c)} ${c}`}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <div className="row g-2 pt-1">
              {filtered.map(p => (
                <div key={p._id} className="col-6 col-xl-4">
                  <div
                    className="card border-0 shadow-sm p-3 h-100"
                    style={{ borderRadius: '12px', cursor: p.stock > 0 ? 'pointer' : 'default', opacity: p.stock === 0 ? 0.5 : 1, transition: 'transform 0.15s' }}
                    onClick={() => addToBill(p)}
                    onMouseEnter={e => { if (p.stock > 0) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{catIcon(p.category)}</div>
                    <p className="fw-semibold mb-0 small" style={{ color: '#1b5e20', lineHeight: 1.3 }}>{p.name}</p>
                    <p className="fw-bold mb-0" style={{ color: '#2e7d32' }}>₹{p.price}</p>
                    <p className="mb-0" style={{ fontSize: '11px', color: p.stock > 0 ? '#666' : '#c62828' }}>
                      {p.stock > 0 ? `Stock: ${p.stock}` : 'Out of stock'}
                    </p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-12 text-center py-5 text-muted">No products found</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — Bill */}
        <div className="col-lg-5 d-flex flex-column">
          <div className="card border-0 shadow-sm d-flex flex-column" style={{ borderRadius: '16px', flex: 1, overflow: 'hidden' }}>
            {/* Bill Header */}
            <div className="p-3 border-bottom" style={{ background: '#f1f8e9' }}>
              <h6 className="fw-bold mb-0" style={{ color: '#1b5e20' }}>Current Bill</h6>
            </div>

            {/* Bill Items */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
              {billItems.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <div style={{ fontSize: '3rem' }}>🛒</div>
                  <p className="small mt-2">Click products to add</p>
                </div>
              ) : billItems.map(item => (
                <div key={item.productId} className="d-flex align-items-center gap-2 mb-2 p-2 rounded" style={{ background: '#f9fbe7' }}>
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-medium small">{item.name}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>₹{item.price} × {item.quantity}</p>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <button className="btn btn-outline-secondary btn-sm" style={{ width:'26px', height:'26px', padding:0, lineHeight:1, fontSize:'16px' }}
                      onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
                    <span className="fw-semibold" style={{ minWidth:'22px', textAlign:'center', fontSize:'14px' }}>{item.quantity}</span>
                    <button className="btn btn-outline-secondary btn-sm" style={{ width:'26px', height:'26px', padding:0, lineHeight:1, fontSize:'16px' }}
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}>+</button>
                  </div>
                  <span className="fw-bold small" style={{ minWidth:'55px', textAlign:'right', color:'#2e7d32' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Bill Footer */}
            <div className="p-3 border-top">
              {/* Customer */}
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <input className="form-control form-control-sm" placeholder="Customer name" value={customerName} onChange={e => setCustName(e.target.value)} style={{ borderRadius:'8px' }} />
                </div>
                <div className="col-6">
                  <input className="form-control form-control-sm" placeholder="Phone" value={customerPhone} onChange={e => setCustPhone(e.target.value)} style={{ borderRadius:'8px' }} />
                </div>
              </div>

              {/* Discount */}
              <div className="d-flex align-items-center gap-2 mb-2">
                <label className="small text-muted mb-0" style={{ whiteSpace:'nowrap' }}>Discount (₹)</label>
                <input type="number" min="0" max={totalAmount} className="form-control form-control-sm"
                  value={discount} onChange={e => setDiscount(e.target.value)} style={{ borderRadius:'8px' }} />
              </div>

              {/* Payment */}
              <div className="d-flex gap-2 mb-3">
                {['cash','upi','card'].map(m => (
                  <button key={m} onClick={() => setPayment(m)}
                    className={`btn btn-sm flex-fill ${paymentMethod === m ? 'btn-success' : 'btn-outline-secondary'}`}
                    style={{ borderRadius:'8px', fontSize:'12px' }}>
                    {m === 'cash' ? '💵 Cash' : m === 'upi' ? '📱 UPI' : '💳 Card'}
                  </button>
                ))}
              </div>

              {/* Totals */}
              <div className="d-flex justify-content-between small text-muted mb-1">
                <span>Subtotal</span><span>₹{totalAmount}</span>
              </div>
              {Number(discount) > 0 && (
                <div className="d-flex justify-content-between small text-danger mb-1">
                  <span>Discount</span><span>-₹{discount}</span>
                </div>
              )}
              <div className="d-flex justify-content-between fw-bold mb-3" style={{ fontSize:'18px', color:'#1b5e20' }}>
                <span>Total</span><span>₹{payableAmount}</span>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-success flex-fill fw-bold py-2" onClick={chargeBill} disabled={saving || billItems.length === 0} style={{ borderRadius:'10px' }}>
                  {saving ? <span className="spinner-border spinner-border-sm"></span> : '⚡ Charge'}
                </button>
                {lastBill && (
                  <button className="btn btn-outline-success px-3 py-2" onClick={printBill} style={{ borderRadius:'10px' }} title="Print last bill">🖨</button>
                )}
                <button className="btn btn-outline-secondary px-3 py-2" onClick={() => { setBillItems([]); setDiscount(0); }} style={{ borderRadius:'10px' }} title="Clear bill">🗑</button>
              </div>

              {lastBill && (
                <p className="text-success small text-center mt-2 mb-0">✓ Last bill: {lastBill.billNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default POS;
