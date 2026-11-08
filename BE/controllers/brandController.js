const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBrand = async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Brand name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a brand (Admin)
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    }

    const allowedFields = ['name', 'description'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        brand[field] = req.body[field];
      }
    });

    await brand.save();
    res.json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Brand name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a brand (Admin)
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
    }

    await brand.deleteOne();
    res.json({ message: 'Đã xóa thương hiệu' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
