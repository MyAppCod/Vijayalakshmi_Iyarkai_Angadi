const Bill    = require('../models/Bill');
const Product = require('../models/Product');
const Finance = require('../models/Finance');

// Auto-generate bill number VIA-0001
const generateBillNumber = async () => {
  const last = await Bill.findOne().sort({ createdAt: -1 }).select('billNumber');
  if (!last?.billNumber) return 'VIA-0001';
  const num = parseInt(last.billNumber.replace('VIA-', ''), 10) + 1;
  return `VIA-${String(num).padStart(4, '0')}`;
};

// ➕ Create Bill
exports.createBill = async (req, res) => {
  try {
    const { items, discount = 0, paymentMethod, customerName, customerPhone } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ msg: 'Bill must have at least one item' });

    let totalAmount = 0;
    const billItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ msg: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity)
        return res.status(400).json({ msg: `Insufficient stock for ${product.name}` });

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      billItems.push({ product: product._id, name: product.name, quantity: item.quantity, unitPrice: product.price, subtotal });

      // Deduct stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    const payableAmount = totalAmount - discount;
    const billNumber    = await generateBillNumber();

    const bill = new Bill({
      billNumber, items: billItems, totalAmount, discount,
      payableAmount, paymentMethod, customerName, customerPhone,
      servedBy: req.user.id
    });
    await bill.save();

    // Auto-log income in Finance
    await Finance.create({
      type: 'income', category: 'pos_sales', amount: payableAmount,
      description: `POS Bill ${billNumber}${customerName ? ' — ' + customerName : ''}`,
      source: 'pos', referenceId: billNumber, recordedBy: req.user.id
    });

    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📥 Get all bills
exports.getBills = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to)   filter.createdAt.$lte = new Date(new Date(to).setHours(23, 59, 59, 999));
    }
    const bills = await Bill.find(filter)
      .populate('servedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📄 Get single bill (for print)
exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate('servedBy', 'name');
    if (!bill) return res.status(404).json({ msg: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
