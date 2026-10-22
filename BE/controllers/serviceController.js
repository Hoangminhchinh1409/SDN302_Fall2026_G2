const Service = require('../models/Service');

const getServices = async (req, res) => {
  const services = await Service.find({});
  res.json(services);
};

const createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
};

module.exports = { getServices, createService };
