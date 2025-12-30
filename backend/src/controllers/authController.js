// controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { errorResponse } = require('../utils/errorHandler');
const { signupSchema, loginSchema } = require('../utils/validators');

// Signup
const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return errorResponse(res, 400, 'User already exists');

    const user = await User.create({ fullName, email, password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, email, role: user.role }
    });
  } catch (err) {
    console.error('Signup error:', err); // ← add this for debugging
    return errorResponse(res, 500, err.message || 'Server error during signup');
  }
};

// Login
const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return errorResponse(res, 400, error.details[0].message);

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: { id: user._id, email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 500, err.message || 'Server error during login');
  }
};

// Get Current User
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// Logout (client-side mainly)
const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = { signup, login, getMe, logout };