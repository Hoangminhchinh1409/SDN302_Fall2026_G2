const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getStats);

module.exports = router;
