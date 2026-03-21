const Product = require('../models/Product');

// ➕ Add Product (Admin / Manager)
exports.createProduct = async (req, res) => {
  try {
    if (req.file) {
      // Cloudinary → req.file.path is a full https:// URL
      // Local disk  → req.file.path is uploads/filename, use filename instead
      req.body.image = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);
    const savedProduct = await product.save();

        res.json(savedProduct);
  } catch (err) {
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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);
  } catch (err) {
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