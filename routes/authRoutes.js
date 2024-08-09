// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Apply rate limiting to login and registration routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts from this IP, please try again later.',
});

// Use rate limiter on login route
router.post('/login', authLimiter, loginUser);
router.post('/register', registerUser);

module.exports = router;
