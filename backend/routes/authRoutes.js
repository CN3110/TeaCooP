// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/set-password', authMiddleware, authController.setPassword);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;