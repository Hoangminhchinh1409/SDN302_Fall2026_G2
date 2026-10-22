const express = require('express');
const router = express.Router();
const { getBrands, createBrand } = require('../controllers/brandController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getBrands).post(protect, admin, createBrand);

module.exports = router;
