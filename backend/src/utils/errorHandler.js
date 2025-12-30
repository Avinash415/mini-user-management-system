const errorResponse = (res, status, message) => {
  res.status(status).json({ success: false, error: message });
};

module.exports = { errorResponse };