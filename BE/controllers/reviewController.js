const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Helper to recalculate and persist average rating & count on Product model
const updateProductRatingStats = async (productId) => {
  const allReviews = await Review.find({ product: productId });
  const numReviews = allReviews.length;
  const rating =
    numReviews > 0
      ? Number((allReviews.reduce((sum, item) => sum + item.rating, 0) / numReviews).toFixed(1))
      : 0;

  await Product.findByIdAndUpdate(productId, {
    rating,
    numReviews,
  });

  return { rating, numReviews };
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Thiếu mã sản phẩm (productId)' });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: 'Vui lòng đánh giá số sao từ 1 đến 5' });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Vui lòng nhập nội dung đánh giá' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        message: 'Bạn đã đánh giá sản phẩm này rồi. Bạn có thể chỉnh sửa đánh giá hiện tại của mình.',
      });
    }

    // Check verified purchase (user placed an order with this product that is not cancelled)
    const verifiedOrder = await Order.findOne({
      user: req.user._id,
      status: { $in: ['Chờ xác nhận', 'Đang đóng gói', 'Đang giao', 'Hoàn thành'] },
      'orderItems.product': productId,
    });

    const isVerifiedPurchase = Boolean(verifiedOrder);

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment: comment.trim(),
      isVerifiedPurchase,
    });

    // Recalculate product rating
    await updateProductRatingStats(productId);

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name email avatar'
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('createReview error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('getProductReviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Đánh giá không tồn tại' });
    }

    // Check authorization: must be review author
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Bạn không có quyền chỉnh sửa đánh giá này' });
    }

    if (rating) {
      review.rating = Number(rating);
    }
    if (comment) {
      review.comment = comment.trim();
    }

    const updated = await review.save();

    // Recalculate product rating
    await updateProductRatingStats(review.product);

    const populated = await Review.findById(updated._id).populate(
      'user',
      'name email avatar'
    );

    res.json(populated);
  } catch (error) {
    console.error('updateReview error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Đánh giá không tồn tại' });
    }

    // Check authorization: review author or admin/staff
    const isOwner = review.user.toString() === req.user._id.toString();
    const isStaffOrAdmin = req.user.role === 'admin' || req.user.role === 'staff';

    if (!isOwner && !isStaffOrAdmin) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa đánh giá này' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product rating
    await updateProductRatingStats(productId);

    res.json({ message: 'Đã xóa đánh giá thành công' });
  } catch (error) {
    console.error('deleteReview error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Check eligibility to review a product
// @route   GET /api/reviews/check-eligibility/:productId
// @access  Private
const checkReviewEligibility = async (req, res) => {
  try {
    const { productId } = req.params;

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    }).populate('user', 'name avatar');

    const verifiedOrder = await Order.findOne({
      user: req.user._id,
      status: { $in: ['Chờ xác nhận', 'Đang đóng gói', 'Đang giao', 'Hoàn thành'] },
      'orderItems.product': productId,
    });

    res.json({
      hasReviewed: Boolean(existingReview),
      isVerifiedPurchase: Boolean(verifiedOrder),
      myReview: existingReview,
    });
  } catch (error) {
    console.error('checkReviewEligibility error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  checkReviewEligibility,
};
