const Product = require('../models/Product');

// ➕ Add Product (Admin / Manager)
exports.createProduct = async (req, res) => {
  try {
    // ✅ Handle image
    if (req.file) {
      req.body.image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    // ✅ FIX: Convert types properly (VERY IMPORTANT)
    const productData = {
      name: req.body.name,
      category: req.body.category,
      price: Number(req.body.price),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,
      stock: Number(req.body.stock),
      unit: req.body.unit || 'count',
      message: req.body.message || '',
      description: req.body.description || '',
      image: req.body.image
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    res.json(savedProduct);

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err); // ✅ Debug log
    res.status(500).json({ msg: err.message });
  }
};

// 📥 Get All Products (Public)
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📄 Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch {
    res.status(404).json({ msg: 'Product not found' });
  }
};

// ✏️ Update Product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      price: Number(req.body.price),
      oldPrice: req.body.oldPrice ? Number(req.body.oldPrice) : undefined,
      stock: Number(req.body.stock)
    };

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ msg: err.message });
  }
};

// ❌ Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};