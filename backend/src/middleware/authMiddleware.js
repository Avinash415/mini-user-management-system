const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/errorHandler');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return errorResponse(res, 401, 'Not authorized, no token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return errorResponse(res, 401, 'User not found');
    next();
  } catch (err) {
    errorResponse(res, 401, 'Not authorized, token failed');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    errorResponse(res, 403, 'Not authorized as admin');
  }
};

module.exports = { protect, adminOnly };