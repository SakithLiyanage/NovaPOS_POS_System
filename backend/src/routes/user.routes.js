const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
} = require('../controllers/user.controller');
const { auth, requireRole } = require('../middleware/auth');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

router.use(auth);

// Profile routes (accessible by all authenticated users)
router.put('/profile', async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

router.put('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

// Admin routes
router.use(requireRole('OWNER'));

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/:id/reset-password', resetPassword);

module.exports = router;
