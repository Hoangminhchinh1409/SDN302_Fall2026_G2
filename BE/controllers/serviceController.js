const Service = require('../models/Service');

const getServices = async (req, res) => {
  const services = await Service.find({ isDeleted: { $ne: true } });
  res.json(services);
};

const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    console.error('createService error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Update a service (Admin)
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }

    const allowedFields = ['name', 'description', 'price', 'durationMinutes'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    await service.save();
    res.json(service);
  } catch (error) {
    console.error('updateService error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// @desc    Delete a service (Admin)
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }

    service.isDeleted = true;
    await service.save();
    res.json({ message: 'Đã xóa dịch vụ' });
  } catch (error) {
    console.error('deleteService error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = { getServices, createService, updateService, deleteService };
