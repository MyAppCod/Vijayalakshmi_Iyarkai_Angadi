// controllers/productController.js
const Product = require('../models/Product');

// Create a product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, stock, unit, category, message, description } = req.body;

    // Handle Cloudinary image
    const image = req.file ? req.file.path : '';

    const product = new Product({
      name,
      price,
      oldPrice: oldPrice || 0,
      stock: stock || 0,
      unit: unit || 'count',
      category,
      message,
      description,
      image
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ msg: 'Server error creating product' });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ msg: 'Server error fetching products' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Get product by ID error:', err);
    res.status(500).json({ msg: 'Server error fetching product' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, oldPrice, stock, unit, category, message, description } = req.body;

    // Only update image if new file uploaded
    const updateData = {
      name,
      price,
      oldPrice: oldPrice || 0,
      stock: stock || 0,
      unit: unit || 'count',
      category,
      message,
      description
    };
    if (req.file) updateData.image = req.file.path;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ msg: 'Server error updating product' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json({ msg: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ msg: 'Server error deleting product' });
  }
};