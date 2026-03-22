// controllers/productsController.js
const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      oldPrice = 0,
      stock = 0,
      unit = 'count',
      category,
      description = '',
      message = ''
    } = req.body;

    const image = req.file ? req.file.filename : '';

    const product = await Product.create({
      name,
      price,
      oldPrice,
      stock,
      unit,
      category,
      description,
      message,
      image
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    const {
      name,
      price,
      oldPrice = 0,
      stock = 0,
      unit = 'count',
      category,
      description = '',
      message = ''
    } = req.body;

    if (req.file) product.image = req.file.filename;
    product.name = name;
    product.price = price;
    product.oldPrice = oldPrice;
    product.stock = stock;
    product.unit = unit;
    product.category = category;
    product.description = description;
    product.message = message;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.status(200).json({ msg: 'Product deleted' });
  } catch (err) {
    console.error('Delete Product Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    console.error('Get Products Error:', err);
    res.status(500).json({ msg: 'Internal server error' });
  }
};