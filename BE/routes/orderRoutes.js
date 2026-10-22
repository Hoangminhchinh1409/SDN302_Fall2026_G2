const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, staff } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, staff, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, staff, updateOrderStatus);

module.exports = router;
