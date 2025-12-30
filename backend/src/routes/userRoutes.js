const express = require('express');
const { getAllUsers, activateUser, deactivateUser, updateProfile, changePassword } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/activate', protect, adminOnly, activateUser);
router.put('/:id/deactivate', protect, adminOnly, deactivateUser);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;