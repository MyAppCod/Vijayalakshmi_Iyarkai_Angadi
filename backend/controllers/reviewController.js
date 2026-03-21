const Review = require('../models/Review');

// ➕ Add Review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = new Review({
      user: req.user.id,
      product: productId,
      rating,
      comment
    });

    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📥 Get Reviews by Product
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name');

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};