const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  reorderOrder,
  getSepayInfo,
  sepayWebhook,
} = require('../controllers/orderController');
const { protect, staff } = require('../middleware/authMiddleware');

router.post('/sepay-webhook', sepayWebhook);
router.route('/').post(protect, addOrderItems).get(protect, staff, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.post('/:id/reorder', protect, reorderOrder);
router.get('/:id/sepay-info', protect, getSepayInfo);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, staff, updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;
