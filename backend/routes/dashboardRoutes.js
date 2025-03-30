const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Dashboard route for each user type
router.get('/employee-dashboard', authMiddleware, (req, res) => {
  if (req.user.userType !== 'employee') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: 'Welcome to Employee Dashboard' });
});

router.get('/supplier-dashboard', authMiddleware, (req, res) => {
  if (req.user.userType !== 'supplier') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: 'Welcome to Supplier Dashboard' });
});

router.get('/driver-dashboard', authMiddleware, (req, res) => {
  if (req.user.userType !== 'driver') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: 'Welcome to Driver Dashboard' });
});

router.get('/broker-dashboard', authMiddleware, (req, res) => {
  if (req.user.userType !== 'broker') {
    return res.status(403).json({ message: 'Access denied' });
  }
  res.json({ message: 'Welcome to Broker Dashboard' });
});

module.exports = router;