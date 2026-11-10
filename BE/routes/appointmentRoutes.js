const express = require('express');
const router = express.Router();
const {
    getMyAppointments,
    createAppointment,
    updateAppointmentStatus,
    cancelMyAppointment
} = require('../controllers/appointmentController');
const { protect, staff } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyAppointments).post(protect, createAppointment);
router.route('/:id/status').put(protect, staff, updateAppointmentStatus);
router.route('/:id/cancel').put(protect, cancelMyAppointment);

module.exports = router;
