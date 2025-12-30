const User = require('../models/User');
const { errorResponse } = require('../utils/errorHandler');
const Joi = require('joi');

// Schema for updates
const updateSchema = Joi.object({
  fullName: Joi.string().min(3),
  email: Joi.string().email(),
});

const passwordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

// Get All Users (Admin, with pagination)
const getAllUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; // As per requirements
  try {
    const users = await User.find({})
      .select('-password')
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await User.countDocuments();
    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

// Activate/Deactivate User (Admin)
const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    user.status = 'active';
    await user.save();
    res.json({ success: true, message: 'User activated' });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    user.status = 'inactive';
    await user.save();
    res.json({ success: true, message: 'User deactivated' });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

// Update Profile (User)
const updateProfile = async (req, res) => {
  const { error } = updateSchema.validate(req.body);
  if (error) return errorResponse(res, 400, error.details[0].message);

  try {
    const user = await User.findById(req.user._id);
    if (req.body.fullName) user.fullName = req.body.fullName;
    if (req.body.email) {
      if (await User.findOne({ email: req.body.email, _id: { $ne: user._id } })) {
        return errorResponse(res, 400, 'Email already in use');
      }
      user.email = req.body.email;
    }
    user.updatedAt = Date.now();
    await user.save();
    res.json({ success: true, user: { fullName: user.fullName, email: user.email } });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

// Change Password (User)
const changePassword = async (req, res) => {
  const { error } = passwordSchema.validate(req.body);
  if (error) return errorResponse(res, 400, error.details[0].message);

  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(req.body.oldPassword))) {
      return errorResponse(res, 401, 'Invalid old password');
    }
    user.password = req.body.newPassword;
    user.updatedAt = Date.now();
    await user.save();
    res.json({ success: true, message: 'Password changed' });
  } catch (err) {
    errorResponse(res, 500, err.message);
  }
};

module.exports = { getAllUsers, activateUser, deactivateUser, updateProfile, changePassword };