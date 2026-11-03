const Coupon = require('../models/Coupon');

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    console.error('getCoupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get available coupons for customers to use
// @route   GET /api/coupons/available
// @access  Public / Private
const getAvailableCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: new Date() },
    })
      .select('code discountPercentage minOrderValue maxDiscountAmount description expiryDate')
      .sort({ discountPercentage: -1 });

    res.json(coupons);
  } catch (error) {
    console.error('getAvailableCoupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check a coupon code (as in API spec: GET /api/coupons/:code)
// @route   GET /api/coupons/:code
// @access  Private
const checkCoupon = async (req, res) => {
  try {
    const { code } = req.params;
    const cleanCode = code.trim().toUpperCase();

    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Mã giảm giá không tồn tại hoặc đã bị khóa' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Mã giảm giá này đã hết hạn sử dụng' });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }

    if (req.user && coupon.usedBy && coupon.usedBy.some((u) => u.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Bạn đã từng sử dụng mã giảm giá này rồi' });
    }

    res.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      minOrderValue: coupon.minOrderValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      description: coupon.description,
      expiryDate: coupon.expiryDate,
    });
  } catch (error) {
    console.error('checkCoupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Apply coupon and calculate exact discount
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = async (req, res) => {
  try {
    const { code, orderTotal = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Vui lòng cung cấp mã giảm giá' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({ message: 'Mã giảm giá không tồn tại hoặc đã hết hiệu lực' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Mã giảm giá này đã hết hạn sử dụng' });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }

    if (req.user && coupon.usedBy && coupon.usedBy.some((u) => u.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'Bạn đã sử dụng mã giảm giá này trước đó' });
    }

    const numericTotal = Number(orderTotal) || 0;
    if (coupon.minOrderValue > 0 && numericTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Đơn hàng tối thiểu phải từ $${coupon.minOrderValue} để áp dụng mã giảm giá này (Hiện tại: $${numericTotal.toFixed(2)})`,
      });
    }

    // Calculate discount amount
    let discount = (numericTotal * coupon.discountPercentage) / 100;
    if (coupon.maxDiscountAmount > 0 && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }

    discount = Math.round(discount * 100) / 100;
    const finalTotal = Math.max(0, Math.round((numericTotal - discount) * 100) / 100);

    res.json({
      valid: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      discountAmount: discount,
      finalTotal,
      message: `Áp dụng thành công mã giảm ${coupon.discountPercentage}% (-$${discount.toFixed(2)})`,
    });
  } catch (error) {
    console.error('applyCoupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      expiryDate,
      minOrderValue,
      maxDiscountAmount,
      description,
      usageLimit,
    } = req.body;

    const cleanCode = code ? code.trim().toUpperCase() : '';
    const exists = await Coupon.findOne({ code: cleanCode });
    if (exists) {
      return res.status(400).json({ message: 'Mã giảm giá này đã tồn tại' });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      discountPercentage,
      expiryDate,
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 0,
      description: description || '',
      usageLimit: usageLimit ? Number(usageLimit) : null,
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error('createCoupon error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: 'Coupon deleted successfully' });
    } else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    console.error('deleteCoupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCoupons,
  getAvailableCoupons,
  checkCoupon,
  applyCoupon,
  createCoupon,
  deleteCoupon,
};
