const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  disableEmployee,
 } = require('../controllers/employeeController');


// CRUD
router.get('/', getAllEmployees); // Get all employees
router.post('/add', addEmployee); // Add new employee
router.get('/:employeeId', getEmployeeById); // Get employee by ID
router.put('/:employeeId', updateEmployee); // Update employee by ID
router.put('/:employeeId/disable', disableEmployee); // Disable employee

module.exports = router;