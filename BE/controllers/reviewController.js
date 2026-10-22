const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }

  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    product: productId
  });

  if (alreadyReviewed) {
    res.status(400).json({ message: 'Product already reviewed' });
    return;
  }

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating: Number(rating),
    comment
  });

  res.status(201).json(review);
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
};

module.exports = {
  createReview,
  getProductReviews
};
