const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  updateProductStock,
} = require('../controllers/productController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/stock').patch(protect, staff, updateProductStock);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
