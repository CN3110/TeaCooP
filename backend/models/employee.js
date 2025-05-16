const db = require('../config/database');
const bcrypt = require('bcrypt');

// Generate a new unique employeeId
const generateEmployeeId = async () => {
  const query = `
    SELECT MAX(CAST(SUBSTRING(employeeId, 2) AS UNSIGNED)) AS lastId 
    FROM employee
  `;
  const [results] = await db.query(query);
  const lastId = results[0].lastId || 100;
  return `E${lastId + 1}`;
};

// Hash a password/passcode
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Create a new employee
const createEmployee = async ({ employeeId, employeeName, employeeContact_no, employeeEmail, status, notes, passcode }) => {
  // If we're storing plaintext passcodes (for email delivery)
  // We'll hash them before storing in the database
  const hashedPasscode = await hashPassword(passcode);
  
  const query = `
    INSERT INTO employee
    (employeeId, employeeName, employeeContact_no, employeeEmail, status, notes, passcode)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await db.query(query, [employeeId, employeeName, employeeContact_no, employeeEmail, status, notes, hashedPasscode]);
};

// Get all employees
const getAllEmployees = async () => {
  const [employees] = await db.query("SELECT * FROM employee");
  return employees;
};

// Get employee by id
const getEmployeeById = async (employeeId) => {
  const [employeeRows] = await db.query(
    "SELECT * FROM employee WHERE employeeId = ?",
    [employeeId]
  );

  if (employeeRows.length === 0) return null;

  return employeeRows[0];
};

// Update employee by id
const updateEmployee = async ({ employeeId, employeeName, employeeContact_no, employeeEmail, status, notes }) => {
  const query = `
    UPDATE employee 
    SET employeeName = ?, employeeContact_no = ?, employeeEmail = ?, status = ?, notes = ? 
    WHERE employeeId = ?
  `;
  await db.query(query, [employeeName, employeeContact_no, employeeEmail, status, notes, employeeId]);
};

//profile update for employee
const updateEmployeeProfile = async (employeeId, { employeeName, employeeContact_no, employeeEmail }) => {
    const query = `
        UPDATE employee
        SET employeeName = ?, employeeContact_no = ?, employeeEmail = ?
        WHERE employeeId = ?
    `;
    await db.query(query, [employeeName, employeeContact_no, employeeEmail, employeeId]);
};


// Update employee password directly
const updatePassword = async (employeeId, newPassword) => {
  const hashedPassword = await hashPassword(newPassword);
  
  const query = `
    UPDATE employee 
    SET passcode = ? 
    WHERE employeeId = ?
  `;
  await db.query(query, [hashedPassword, employeeId]);
};

// Verify employee credentials
const verifyEmployeeCredentials = async (employeeId, passcode) => {
  const [employees] = await db.query(
    "SELECT * FROM employee WHERE employeeId = ? AND status = 'active'", 
    [employeeId]
  );
  
  if (employees.length === 0) return null;
  
  const employee = employees[0];
  const isPasswordValid = await bcrypt.compare(passcode, employee.passcode);
  
  if (!isPasswordValid) return null;
  
  return employee;
};



module.exports = {
  generateEmployeeId,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeProfile,
  updatePassword,
  verifyEmployeeCredentials,
  hashPassword
};