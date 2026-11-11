const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
require('../models/Service');
require('../models/PetProfile');
require('../models/User');

const notifyUser = async (notification) => {
  try {
    await Notification.create(notification);
  } catch (error) {
    console.error('Notification error:', error);
  }
};

const getMyAppointments = async (req, res) => {
  let filter = { user: req.user._id, isDeleted: { $ne: true } };
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    filter = { isDeleted: { $ne: true } }; // Admin and staff can see all active
  }
  const appointments = await Appointment.find(filter)
    .populate('service pet user')
    .sort({ date: -1 });
  res.json(appointments);
};

const createAppointment = async (req, res) => {
  try {
    const { serviceId, petId, date } = req.body;

    if (!serviceId || !petId || !date) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin dịch vụ, thú cưng và ngày giờ.' });
    }

    const apptDate = new Date(date);
    if (isNaN(apptDate.getTime()) || apptDate <= new Date()) {
      return res.status(400).json({ message: 'Thời gian hẹn phải ở tương lai.' });
    }

    // Check conflict: Same pet cannot have another active appointment within +- 45 minutes
    const windowStart = new Date(apptDate.getTime() - 45 * 60 * 1000);
    const windowEnd = new Date(apptDate.getTime() + 45 * 60 * 1000);

    const existingPetAppt = await Appointment.findOne({
      pet: petId,
      status: { $in: ['Pending', 'Confirmed'] },
      date: { $gte: windowStart, $lte: windowEnd }
    });

    if (existingPetAppt) {
      return res.status(400).json({ message: 'Thú cưng này đã có lịch hẹn trong khung giờ gần kề (khoảng 45 phút).' });
    }

    // Check store capacity limit: max 3 concurrent appointments in the same slot window
    const concurrentBookings = await Appointment.countDocuments({
      status: { $in: ['Pending', 'Confirmed'] },
      date: { $gte: windowStart, $lte: windowEnd }
    });

    if (concurrentBookings >= 3) {
      return res.status(400).json({ message: 'Khung giờ này đã kín lịch (tối đa 3 khách/ca). Vui lòng chọn giờ khác.' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service: serviceId,
      pet: petId,
      date: apptDate
    });

    await appointment.populate('service pet user');

    await notifyUser({
      user: req.user._id,
      appointment: appointment._id,
      title: 'Đặt lịch hẹn thành công',
      message: `Lịch hẹn cho "${appointment.pet?.name || 'thú cưng'}" vào ngày ${apptDate.toLocaleString('vi-VN')} đã được tiếp nhận.`
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.error('createAppointment error:', error);
    res.status(500).json({ message: error.message || 'Lỗi tạo lịch hẹn' });
  }
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

    const previousStatus = appointment.status;
    const APPOINTMENT_TRANSITIONS = {
      Pending: ['Confirmed', 'Cancelled'],
      Confirmed: ['Completed', 'Cancelled'],
      Completed: [],
      Cancelled: []
    };

    if (previousStatus !== status) {
      const validNext = APPOINTMENT_TRANSITIONS[previousStatus] || [];
      if (!validNext.includes(status)) {
        return res.status(400).json({
          message: `Không thể chuyển lịch hẹn từ trạng thái "${previousStatus}" sang "${status}".`
        });
      }
    }

    appointment.status = status;
    await appointment.save();
    await appointment.populate('service pet user');

    const statusMessages = {
      Confirmed: `Lịch hẹn vào ngày ${new Date(appointment.date).toLocaleString('vi-VN')} đã được nhân viên xác nhận.`,
      Completed: `Dịch vụ "${appointment.service?.name || ''}" cho thú cưng đã hoàn thành. Cảm ơn bạn!`,
      Cancelled: `Lịch hẹn vào ngày ${new Date(appointment.date).toLocaleString('vi-VN')} đã bị hủy.`
    };

    if (statusMessages[status]) {
      await notifyUser({
        user: appointment.user?._id || appointment.user,
        appointment: appointment._id,
        title: `Lịch hẹn ${status === 'Confirmed' ? 'đã xác nhận' : status === 'Completed' ? 'đã hoàn thành' : 'đã bị hủy'}`,
        message: statusMessages[status]
      });
    }

    res.json(appointment);
  } catch (error) {
    console.error('updateAppointmentStatus error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Cancel appointment by customer
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
    }

    if (appointment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền hủy lịch hẹn này' });
    }

    if (appointment.status !== 'Pending' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Chỉ có thể hủy các lịch hẹn đang chờ xác nhận (Pending)' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();
    await appointment.populate('service pet user');

    res.json({ message: 'Đã hủy lịch hẹn thành công', appointment });
  } catch (error) {
    console.error('cancelAppointment error:', error);
    res.status(500).json({ message: error.message || 'Lỗi khi hủy lịch hẹn' });
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

    appointment.isDeleted = true;
    await appointment.save();
    res.json({ message: 'Đã xóa lịch hẹn' });
  } catch (error) {
    console.error('deleteAppointment error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  getMyAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelAppointment,
  deleteAppointment
};
