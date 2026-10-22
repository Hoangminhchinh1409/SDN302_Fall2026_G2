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

module.exports = { getMyAppointments, createAppointment };
