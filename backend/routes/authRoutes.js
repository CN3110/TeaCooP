const express = require('express');
const router = express.Router();
const { 
  login, 
  verifyToken, 
  resetPassword, 
  forgotPassword 
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Protected routes (authentication required)
router.get('/verify', authenticate, verifyToken);
router.post('/reset-password', authenticate, resetPassword);

module.exports = router;