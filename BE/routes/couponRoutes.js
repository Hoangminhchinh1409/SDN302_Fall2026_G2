const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getAvailableCoupons,
  checkCoupon,
  applyCoupon,
  createCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.get('/available', getAvailableCoupons);
router.post('/apply', protect, applyCoupon);

router
  .route('/:code')
  .get(protect, checkCoupon);

router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
