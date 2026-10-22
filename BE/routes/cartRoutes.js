const express = require('express');
const router = express.Router();
const { getMyCart, addToCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyCart).post(protect, addToCart).delete(protect, clearCart);

module.exports = router;
