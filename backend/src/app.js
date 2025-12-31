const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://mini-user-management-system-amber.vercel.app",
  credentials: true
})); 
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/health", require("./routes/health"));

// Global error handler (optional expansion)
app.use((err, req, res, next) => {
  res.status(500).json({ success: false, error: err.message });
});

module.exports = app;