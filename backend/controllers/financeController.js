const Finance = require('../models/Finance');

// ➕ Create entry (income or expense)
exports.createEntry = async (req, res) => {
  try {
    const entry = new Finance({ ...req.body, recordedBy: req.user.id });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📥 Get entries with optional filters
exports.getEntries = async (req, res) => {
  try {
    const { type, category, source, from, to } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (source) filter.source = source;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to)   filter.date.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
    }
    const entries = await Finance.find(filter)
      .populate('recordedBy', 'name')
      .sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ❌ Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    await Finance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📊 Summary — totals + monthly breakdown
exports.getSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to)   dateFilter.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));

    const matchStage = Object.keys(dateFilter).length ? { date: dateFilter } : {};

    const totals = await Finance.aggregate([
      { $match: matchStage },
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);

    const income  = totals.find(t => t._id === 'income')?.total  || 0;
    const expense = totals.find(t => t._id === 'expense')?.total || 0;

    // Monthly breakdown (last 12 months)
    const monthly = await Finance.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year:  { $year: '$date' },
            month: { $month: '$date' },
            type:  '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Reshape into chart-friendly format
    const monthMap = {};
    monthly.forEach(m => {
      const key = `${m._id.year}-${String(m._id.month).padStart(2, '0')}`;
      if (!monthMap[key]) monthMap[key] = { month: key, income: 0, expense: 0 };
      monthMap[key][m._id.type] = m.total;
    });
    const chartData = Object.values(monthMap).slice(-12);

    // Expense by category
    const expenseByCategory = await Finance.aggregate([
      { $match: { ...matchStage, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    // Income by source
    const incomeBySource = await Finance.aggregate([
      { $match: { ...matchStage, type: 'income' } },
      { $group: { _id: '$source', total: { $sum: '$amount' } } }
    ]);

    res.json({ income, expense, profit: income - expense, chartData, expenseByCategory, incomeBySource });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
