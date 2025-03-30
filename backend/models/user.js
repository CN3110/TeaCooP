const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Generic function to get user by credentials
const getUserByCredentials = async (userType, userId) => {
  let tableName, idField;
  
  switch(userType) {
    case 'employee':
      tableName = 'employee';
      idField = 'employeeId';
      break;
    case 'supplier':
      tableName = 'supplier';
      idField = 'supplierId';
      break;
    case 'driver':
      tableName = 'driver';
      idField = 'driverId';
      break;
    case 'broker':
      tableName = 'broker';
      idField = 'brokerId';
      break;
    default:
      throw new Error('Invalid user type');
  }
  
  const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE ${idField} = ?`, [userId]);
  return rows[0];
};

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
  let tableName, idField;
  
  switch(userType) {
    case 'employee':
      tableName = 'employee';
      idField = 'employeeId';
      break;
    case 'supplier':
      tableName = 'supplier';
      idField = 'supplierId';
      break;
    case 'driver':
      tableName = 'driver';
      idField = 'driverId';
      break;
    case 'broker':
      tableName = 'broker';
      idField = 'brokerId';
      break;
    default:
      throw new Error('Invalid user type');
  }
  
  await pool.query(
    `UPDATE ${tableName} SET password = ? WHERE ${idField} = ?`, 
    [hashedPassword, userId]
  );
};

module.exports = {
  getEmployeeById,
  getSupplierById,
  getDriverById,
  getBrokerById,
  updateUserPassword,
  getUserByCredentials
};