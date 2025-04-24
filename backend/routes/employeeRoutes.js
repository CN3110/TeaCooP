const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  disableEmployee,
  resetEmployeePassword
} = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// All employee routes should be protected
router.use(authenticate);

// Routes accessible only to admin
router.get('/', authorize('admin'), getAllEmployees);
router.post('/', authorize('admin'), addEmployee);
router.get('/:employeeId', authorize('admin'), getEmployeeById);
router.put('/:employeeId', authorize('admin'), updateEmployee);
router.put('/:employeeId/disable', authorize('admin'), disableEmployee);
router.post('/:employeeId/reset-password', authorize('admin'), resetEmployeePassword);

module.exports = router;