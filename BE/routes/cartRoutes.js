const express = require('express');
const router = express.Router();
const {
  getMyCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  syncCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getMyCart)
  .post(protect, addToCart)
  .delete(protect, clearCart);

router.post('/sync', protect, syncCart);

router
  .route('/items/:productId')
  .put(protect, updateCartItemQuantity)
  .delete(protect, removeCartItem);

// Alias without /items/
router
  .route('/:productId')
  .put(protect, updateCartItemQuantity)
  .delete(protect, removeCartItem);

module.exports = router;
