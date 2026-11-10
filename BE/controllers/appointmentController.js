const Appointment = require('../models/Appointment');
require('../models/Service');
require('../models/PetProfile');
require('../models/User');

const getMyAppointments = async (req, res) => {
  let filter = { user: req.user._id };
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    filter = {}; // Admin and staff can see all
  }
  const appointments = await Appointment.find(filter).populate('service pet user');
  res.json(appointments);
};

const createAppointment = async (req, res) => {
  const { serviceId, petId, date } = req.body;
  const appointment = await Appointment.create({
    user: req.user._id,
    service: serviceId,
    pet: petId,
    date
  });
  res.status(201).json(appointment);
};

// @desc    Update appointment status (Staff/Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private/Staff
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Trạng thái không hợp lệ. Chỉ chấp nhận: ${allowedStatuses.join(', ')}`
      });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    }

    appointment.status = status;
    await appointment.save();
    await appointment.populate('service pet user');

    res.json(appointment);
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete appointment (Admin only)
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    }

    await appointment.deleteOne();
    res.json({ message: 'Đã xóa lịch hẹn' });
  } catch (error) {
    console.error('deleteAppointment error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getMyAppointments, createAppointment, updateAppointmentStatus, deleteAppointment };
