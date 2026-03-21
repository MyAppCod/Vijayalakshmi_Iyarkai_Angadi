const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/auth');
const role     = require('../middleware/role');
const Finance  = require('../models/Finance');
const Bill     = require('../models/Bill');
const Order    = require('../models/Order');
const Product  = require('../models/Product');

// 📊 Full report summary
router.get('/summary', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to)   dateFilter.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
    const match = Object.keys(dateFilter).length ? { date: dateFilter } : {};

    const totals = await Finance.aggregate([
      { $match: match },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    const income  = totals.find(t => t._id === 'income')?.total  || 0;
    const expense = totals.find(t => t._id === 'expense')?.total || 0;

    const onlineTotal = await Finance.aggregate([
      { $match: { ...match, source: 'online' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const posTotal = await Finance.aggregate([
      { $match: { ...match, source: 'pos' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const orderCount = await Order.countDocuments(
      Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
    );
    const billCount = await Bill.countDocuments(
      Object.keys(dateFilter).length ? { createdAt: dateFilter } : {}
    );

    res.json({
      income, expense, profit: income - expense,
      onlineRevenue: onlineTotal[0]?.total || 0,
      posRevenue:    posTotal[0]?.total    || 0,
      orderCount, billCount
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🏆 Top selling products (across orders + bills)
router.get('/top-products', auth, role('admin', 'manager'), async (req, res) => {
  try {
    // From POS bills
    const posTop = await Bill.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.name', qty: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
      { $sort: { qty: -1 } }, { $limit: 10 }
    ]);
    res.json(posTop);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 🥧 Expense by category
router.get('/expenses-by-category', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = { type: 'expense' };
    if (from || to) {
      match.date = {};
      if (from) match.date.$gte = new Date(from);
      if (to)   match.date.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
    }
    const data = await Finance.aggregate([
      { $match: match },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// 📈 Monthly trend (last 12 months)
router.get('/monthly-trend', auth, role('admin', 'manager'), async (req, res) => {
  try {
    const monthly = await Finance.aggregate([
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const map = {};
    monthly.forEach(m => {
      const key = `${m._id.year}-${String(m._id.month).padStart(2,'0')}`;
      if (!map[key]) map[key] = { name: `${monthNames[m._id.month - 1]} ${m._id.year}`, income: 0, expense: 0 };
      map[key][m._id.type] = m.total;
    });
    res.json(Object.values(map).slice(-12));
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
