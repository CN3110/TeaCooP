const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Dashboard route for each user type
router.get('/employee-dashboard', authenticate, authorize('employee'), (req, res) => {
  res.json({ message: 'Welcome to Employee Dashboard' });
});

router.get('/supplier-dashboard', authenticate, authorize('supplier'), (req, res) => {
  res.json({ message: 'Welcome to Supplier Dashboard' });
});

router.get('/driver-dashboard', authenticate, authorize('driver'), (req, res) => {
  res.json({ message: 'Welcome to Driver Dashboard' });
});

router.get('/broker-dashboard', authenticate, authorize('broker'), (req, res) => {
  res.json({ message: 'Welcome to Broker Dashboard' });
});

module.exports = router;