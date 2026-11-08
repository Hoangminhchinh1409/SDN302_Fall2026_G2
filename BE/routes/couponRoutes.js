const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getAvailableCoupons,
  checkCoupon,
  applyCoupon,
  createCoupon,
  updateCoupon,
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

router
  .route('/:id')
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

module.exports = router;
