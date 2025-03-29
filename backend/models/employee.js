const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const Employee = {
  // Get all employees (excluding sensitive data)
  getAll: async () => {
    const [rows] = await pool.query(
      'SELECT employeeId, employeeName, employeeContact_no, employeeEmail, created_at FROM employee'
    );
    return rows;
  },

  // Get employee by ID
  getById: async (id) => {
    const [rows] = await pool.query(
      'SELECT employeeId, employeeName, employeeContact_no, employeeEmail, created_at FROM employee WHERE employeeId = ?', 
      [id]
    );
    return rows[0];
  },

  // Get employee with authentication data (for login purposes)
  getAuthData: async (id) => {
    const [rows] = await pool.query(
      'SELECT employeeId, passcode FROM employee WHERE employeeId = ?',
      [id]
    );
    return rows[0];
  },

  // Create new employee
  create: async (employeeData) => {
    const { employeeId, employeeName, employeeContact_no, employeeEmail, passcode } = employeeData;
    
    // Hash the passcode before storing
    const hashedPasscode = await bcrypt.hash(passcode, 10);
    
    const [result] = await pool.query(
      'INSERT INTO employee (employeeId, employeeName, employeeContact_no, employeeEmail, passcode) VALUES (?, ?, ?, ?, ?)',
      [employeeId, employeeName, employeeContact_no, employeeEmail, hashedPasscode]
    );
    
    return { employeeId, employeeName, employeeContact_no, employeeEmail };
  },

  // Update employee basic info
  update: async (id, employeeData) => {
    const { employeeName, employeeContact_no, employeeEmail } = employeeData;
    
    const [result] = await pool.query(
      'UPDATE employee SET employeeName = ?, employeeContact_no = ?, employeeEmail = ? WHERE employeeId = ?',
      [employeeName, employeeContact_no, employeeEmail, id]
    );
    
    return result.affectedRows > 0 ? { employeeId: id, ...employeeData } : null;
  },

  // Update employee password
  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const [result] = await pool.query(
      'UPDATE employee SET passcode = ? WHERE employeeId = ?',
      [hashedPassword, id]
    );
    
    return result.affectedRows > 0;
  },

  // Delete employee
  delete: async (id) => {
    const [result] = await pool.query(
      'DELETE FROM employee WHERE employeeId = ?', 
      [id]
    );
    return result.affectedRows > 0;
  },

  // Verify passcode
  verifyPasscode: async (id, passcode) => {
    const employee = await Employee.getAuthData(id);
    if (!employee) return false;
    
    return await bcrypt.compare(passcode, employee.passcode);
  }
};

module.exports = Employee;