const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const PetProfile = require('../models/PetProfile');
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
  try {
    const { serviceId, petId, date } = req.body;
    const appointmentDate = new Date(date);

    if (!serviceId || !petId || !date || Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: 'Service, pet, and a valid date are required' });
    }

    if (appointmentDate <= new Date()) {
      return res.status(400).json({ message: 'Appointment date must be in the future' });
    }

    if (!mongoose.isValidObjectId(serviceId) || !mongoose.isValidObjectId(petId)) {
      return res.status(400).json({ message: 'Invalid service or pet ID' });
    }

    const [service, pet] = await Promise.all([
      Service.findById(serviceId),
      PetProfile.findOne({ _id: petId, user: req.user._id })
    ]);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found in your profile' });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service: serviceId,
      pet: petId,
      date: appointmentDate
    });

    await appointment.populate('service pet user');
    return res.status(201).json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid appointment status' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    await appointment.populate('service pet user');
    return res.json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

const cancelMyAppointment = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (!['Pending', 'Confirmed'].includes(appointment.status) || appointment.date <= new Date()) {
      return res.status(400).json({ message: 'This appointment can no longer be cancelled' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();
    await appointment.populate('service pet user');
    return res.json(appointment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getMyAppointments,
  createAppointment,
  updateAppointmentStatus,
  cancelMyAppointment
};
