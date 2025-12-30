const Joi = require('joi');

const signupSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(), // Add more strength rules if needed
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Add more schemas for update, etc.

module.exports = { signupSchema, loginSchema };