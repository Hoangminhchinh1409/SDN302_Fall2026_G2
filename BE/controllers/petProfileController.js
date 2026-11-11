const PetProfile = require('../models/PetProfile');

// @desc    Get user's pet profiles
// @route   GET /api/pets
// @access  Private
const getMyPets = async (req, res) => {
  const pets = await PetProfile.find({ user: req.user._id });
  res.json(pets);
};

// @desc    Create a pet profile
// @route   POST /api/pets
// @access  Private
const createPetProfile = async (req, res) => {
  const { name, type, breed, age, weight, notes } = req.body;

  const pet = await PetProfile.create({
    user: req.user._id,
    name,
    type,
    breed,
    age,
    weight,
    notes
  });

  res.status(201).json(pet);
};

// @desc    Update a pet profile
// @route   PUT /api/pets/:id
// @access  Private
const updatePetProfile = async (req, res) => {
  const pet = await PetProfile.findById(req.params.id);

  if (pet) {
    if (pet.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    pet.name = req.body.name || pet.name;
    pet.type = req.body.type || pet.type;
    pet.breed = req.body.breed || pet.breed;
    pet.age = req.body.age || pet.age;
    pet.weight = req.body.weight || pet.weight;
    pet.notes = req.body.notes || pet.notes;

    const updatedPet = await pet.save();
    res.json(updatedPet);
  } else {
    res.status(404).json({ message: 'Pet not found' });
  }
};

// @desc    Delete a pet profile
// @route   DELETE /api/pets/:id
// @access  Private
const deletePetProfile = async (req, res) => {
  const pet = await PetProfile.findById(req.params.id);

  if (pet) {
    if (pet.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    await PetProfile.deleteOne({ _id: pet._id });
    res.json({ message: 'Pet removed' });
  } else {
    res.status(404).json({ message: 'Pet not found' });
  }
};

// @desc    Add vaccination record
// @route   POST /api/pets/:id/vaccinations
// @access  Private
const addVaccination = async (req, res) => {
  try {
    const { vaccineName, injectedDate, nextDueDate, notes } = req.body;
    if (!vaccineName || !vaccineName.trim()) {
      return res.status(400).json({ message: 'Tên vắc xin không được để trống' });
    }

    const pet = await PetProfile.findOne({ _id: req.params.id, user: req.user._id });
    if (!pet) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ thú cưng' });
    }

    pet.vaccinations.push({
      vaccineName: vaccineName.trim(),
      injectedDate: injectedDate ? new Date(injectedDate) : new Date(),
      nextDueDate: nextDueDate ? new Date(nextDueDate) : undefined,
      notes: notes || ''
    });

    await pet.save();
    res.status(201).json(pet);
  } catch (error) {
    console.error('addVaccination error:', error);
    res.status(500).json({ message: error.message || 'Lỗi thêm lịch tiêm' });
  }
};

// @desc    Delete vaccination record
// @route   DELETE /api/pets/:id/vaccinations/:vacId
// @access  Private
const deleteVaccination = async (req, res) => {
  try {
    const pet = await PetProfile.findOne({ _id: req.params.id, user: req.user._id });
    if (!pet) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ thú cưng' });
    }

    pet.vaccinations = pet.vaccinations.filter((v) => v._id.toString() !== req.params.vacId);
    await pet.save();
    res.json(pet);
  } catch (error) {
    console.error('deleteVaccination error:', error);
    res.status(500).json({ message: error.message || 'Lỗi xóa lịch tiêm' });
  }
};

module.exports = {
  getMyPets,
  createPetProfile,
  updatePetProfile,
  deletePetProfile,
  addVaccination,
  deleteVaccination
};
