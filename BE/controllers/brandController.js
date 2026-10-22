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

module.exports = { getBrands, createBrand };
