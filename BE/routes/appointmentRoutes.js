const express = require('express');
const router = express.Router();
const {
  getMyAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment
} = require('../controllers/appointmentController');
const { protect, staff, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getMyAppointments).post(protect, createAppointment);
router.route('/:id/status').put(protect, staff, updateAppointmentStatus);
router.route('/:id').delete(protect, admin, deleteAppointment);

module.exports = router;
