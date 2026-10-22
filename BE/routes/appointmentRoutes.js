const express = require('express');
const router = express.Router();
const { getMyAppointments, createAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyAppointments).post(protect, createAppointment);

module.exports = router;
