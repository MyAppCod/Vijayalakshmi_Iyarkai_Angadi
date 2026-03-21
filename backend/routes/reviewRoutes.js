const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const {
  addReview,
  getReviews
} = require('../controllers/reviewController');

// Add review
router.post('/', auth, addReview);

// Get reviews
router.get('/:productId', getReviews);

module.exports = router;