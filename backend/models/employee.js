const pool = require('../config/database');

const Employee = {
  // Get all employees
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM employee');
    return rows;
  },

  // Get employee by ID
  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM employee WHERE employeeId = ?', [id]);
    return rows[0];
  },

  // Create new employee (updated to include passcode)
  create: async (employeeData) => {
    const { employeeId, employeeName, employeeContact_no, employeeEmail, passcode } = employeeData;
    const [result] = await pool.query(
      'INSERT INTO employee (employeeId, employeeName, employeeContact_no, employeeEmail, passcode) VALUES (?, ?, ?, ?, ?)',
      [employeeId, employeeName, employeeContact_no, employeeEmail, passcode]
    );
    return { id: result.insertId, ...employeeData };
  },

  // Update employee
  update: async (id, employeeData) => {
    const { employeeName, employeeContact_no, employeeEmail } = employeeData;
    const [result] = await pool.query(
      'UPDATE employee SET employeeName = ?, employeeContact_no = ?, employeeEmail = ? WHERE employeeId = ?',
      [employeeName, employeeContact_no, employeeEmail, id]
    );
    return result.affectedRows > 0 ? { employeeId: id, ...employeeData } : null;
  },

  // Delete employee
  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM employee WHERE employeeId = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Employee;