const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  disableEmployee,
  resetEmployeePassword,
  updatePassword
} = require('../controllers/employeeController');


// All employee routes should be protected


// Routes accessible only to admin
router.get('/', getAllEmployees);
router.post('/add', addEmployee);
router.get('/:employeeId', getEmployeeById);
router.put('/:employeeId', updateEmployee);
router.put('/:employeeId/disable', disableEmployee);
router.post('/:employeeId/reset-password', resetEmployeePassword);
router.put('/:employeeId/password', updatePassword);

module.exports = router;