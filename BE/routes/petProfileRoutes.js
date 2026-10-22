const express = require('express');
const router = express.Router();
const {
  getMyPets,
  createPetProfile,
  updatePetProfile,
  deletePetProfile
} = require('../controllers/petProfileController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyPets)
  .post(protect, createPetProfile);

router.route('/:id')
  .put(protect, updatePetProfile)
  .delete(protect, deletePetProfile);

module.exports = router;
