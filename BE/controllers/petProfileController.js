const PetProfile = require('../models/PetProfile');
const mongoose = require('mongoose');

// @desc    Get one of the user's pet profiles
// @route   GET /api/pets/:id
// @access  Private/Owner
const getPetProfileById = async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    return res.status(400).json({ message: 'Invalid pet ID' });
  }

  try {
    const pet = await PetProfile.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    if (pet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this pet' });
    }
    return res.json(pet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

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

module.exports = {
  getPetProfileById,
  getMyPets,
  createPetProfile,
  updatePetProfile,
  deletePetProfile
};
