const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  saveUserAddress,
  deleteUserAddress,
  getUsers,
  deleteUser,
  updateUserRole,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses').get(protect, getUserAddresses).post(protect, saveUserAddress);
router.route('/addresses/:addressId').put(protect, saveUserAddress).delete(protect, deleteUserAddress);

router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/role').put(protect, admin, updateUserRole);

router.route('/wishlist')
  .post(protect, addToWishlist)
  .get(protect, getWishlist);
router.route('/wishlist/:productId').delete(protect, removeFromWishlist);

module.exports = router;
