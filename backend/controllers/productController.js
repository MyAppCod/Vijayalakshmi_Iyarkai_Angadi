// controllers/productController.js
const Product = require('../models/Product');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, stock, unit, category, description, message } = req.body;
    const product = new Product({
      name,
      price,
      oldPrice: oldPrice || 0,
      stock: stock || 0,
      unit: unit || 'count',
      category,
      description,
      message,
      image: req.file ? req.file.path : ''
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ msg: 'Failed to create product' });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ msg: 'Failed to fetch products' });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Get product by ID error:', err);
    res.status(500).json({ msg: 'Failed to fetch product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, stock, unit, category, description, message, removeImage } = req.body;

    const updateData = {
      name,
      price,
      oldPrice: oldPrice || 0,
      stock: stock || 0,
      unit: unit || 'count',
      category,
      description,
      message
    };

    // Handle image
    if (removeImage === 'true') {
      updateData.image = '';
    } else if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Product not found' });

    res.json(updated);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ msg: 'Failed to update product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ msg: 'Failed to delete product' });
  }
};