const pool = require('../config/database');

// Employee
const getEmployeeById = async (employeeId) => {
  const [rows] = await pool.query('SELECT * FROM employee WHERE employeeId = ?', [employeeId]);
  return rows[0];
};

// Supplier
const getSupplierById = async (supplierId) => {
  const [rows] = await pool.query('SELECT * FROM supplier WHERE supplierId = ?', [supplierId]);
  return rows[0];
};

// Driver
const getDriverById = async (driverId) => {
  const [rows] = await pool.query('SELECT * FROM driver WHERE driverId = ?', [driverId]);
  return rows[0];
};

// Broker
const getBrokerById = async (brokerId) => {
  const [rows] = await pool.query('SELECT * FROM broker WHERE brokerId = ?', [brokerId]);
  return rows[0];
};

// Update password in appropriate table
const updateUserPassword = async (userType, userId, hashedPassword) => {
  let query;
  switch(userType) {
    case 'employee':
      query = 'UPDATE employee SET password = ? WHERE employeeId = ?';
      break;
    case 'supplier':
      query = 'UPDATE supplier SET password = ? WHERE supplierId = ?';
      break;
    case 'driver':
      query = 'UPDATE driver SET password = ? WHERE driverId = ?';
      break;
    case 'broker':
      query = 'UPDATE broker SET password = ? WHERE brokerId = ?';
      break;
    default:
      throw new Error('Invalid user type');
  }
  
  await pool.query(query, [hashedPassword, userId]);
};

module.exports = {
  getEmployeeById,
  getSupplierById,
  getDriverById,
  getBrokerById,
  updateUserPassword
};