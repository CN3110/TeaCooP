const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.post('/', employeeController.createEmployee);

// Admin-only routes
router.get('/', authMiddleware, roleMiddleware('admin'), employeeController.getAllEmployees);

router.delete('/:id', 
  authMiddleware, roleMiddleware('admin'), employeeController.deleteEmployee);

// Authenticated employee routes
router.get('/:id', authMiddleware, employeeController.getEmployeeById);

router.put('/:id', authMiddleware, employeeController.updateEmployee);

router.put('/:id/password', authMiddleware, employeeController.updateEmployeePassword);

module.exports = router;