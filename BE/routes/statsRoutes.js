const express = require('express');
const router = express.Router();
const { getStats, getStaffStats } = require('../controllers/statsController');
const { protect, admin, staff } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getStats);
router.route('/staff').get(protect, staff, getStaffStats);

module.exports = router;
