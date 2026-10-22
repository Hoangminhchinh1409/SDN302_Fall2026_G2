const express = require('express');
const router = express.Router();
const { getCoupons, checkCoupon, createCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getCoupons).post(protect, admin, createCoupon);
router.route('/:code').get(checkCoupon);

module.exports = router;
