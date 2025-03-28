const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Login route
router.post('/login', authController.login);

// Set password route (protected)
router.post('/set-password', authMiddleware, authController.setPassword);

module.exports = router;