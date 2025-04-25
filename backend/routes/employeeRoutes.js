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


// Routes accessible only to admin
router.get('/', getAllEmployees);
router.post('/add', addEmployee);
router.get('/:employeeId', getEmployeeById);
router.put('/:employeeId', updateEmployee);
router.put('/:employeeId/disable', disableEmployee);
router.post('/:employeeId/reset-password', resetEmployeePassword);

module.exports = router;