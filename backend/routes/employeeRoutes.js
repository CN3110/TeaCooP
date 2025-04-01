const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Public routes (no authentication required)
router.post('/', employeeController.createEmployee);

// Admin-only routes
router.get('/', 
  authenticate, 
  authorize('admin'), 
  employeeController.getAllEmployees
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  employeeController.deleteEmployee
);

// Authenticated employee routes (any authenticated user)
router.get('/:id', 
  authenticate, 
  employeeController.getEmployeeById
);

router.put('/:id', 
  authenticate, 
  employeeController.updateEmployee
);

router.put('/:id/password', 
  authenticate, 
  employeeController.updateEmployeePassword
);

module.exports = router;