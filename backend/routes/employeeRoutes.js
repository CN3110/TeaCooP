const express = require('express');
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeProfile,
  disableEmployee,
  resetEmployeePassword,
  updatePassword, 
} = require('../controllers/employeeController');

router.get('/', getAllEmployees);
router.post('/add', addEmployee);
router.get('/:employeeId', getEmployeeById);
router.put('/:employeeId', updateEmployee);
router.put('/profile/:employeeId', updateEmployeeProfile);
router.put('/:employeeId/disable', disableEmployee);
router.post('/:employeeId/reset-password', resetEmployeePassword);
router.put('/:employeeId/password', updatePassword); 

module.exports = router;
