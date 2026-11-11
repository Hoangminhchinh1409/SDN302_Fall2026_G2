const express = require('express');
const router = express.Router();
const {
  getMyPets,
  createPetProfile,
  updatePetProfile,
  deletePetProfile,
  addVaccination,
  deleteVaccination
} = require('../controllers/petProfileController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyPets)
  .post(protect, createPetProfile);

router.route('/:id')
  .put(protect, updatePetProfile)
  .delete(protect, deletePetProfile);

router.route('/:id/vaccinations')
  .post(protect, addVaccination);

router.route('/:id/vaccinations/:vacId')
  .delete(protect, deleteVaccination);

module.exports = router;
