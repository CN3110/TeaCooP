const db = require('../config/database');


//generate a new unique employeeId
const generateEmployeeId = async () => {
  const query = `
    SELECT MAX(CAST(SUBSTRING(employeeId, 2) AS UNSIGNED)) AS lastId 
    FROM employee
  `;
  const [results] = await db.query(query);
  const lastId = results[0].lastId || 100;
  return `E${lastId + 1}`;
};

// Create a new employee
const createEmployee = async ({ employeeId, employeeName, employeeContact_no, employeeEmail, status, notes }) => {
  const query = `
    INSERT INTO employee
    (employeeId, employeeName, employeeContact_no, employeeEmail, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.query(query, [employeeId, employeeName, employeeContact_no, employeeEmail, status, notes]);
};

//get all employees
const getAllEmployees = async () => {
  const [employees] = await db.query("SELECT * FROM employee");
  return employees;
};

//get employee by id
const getEmployeeById = async (employeeId) => {
  const [employeeRows] = await db.query(
    "SELECT * FROM employee WHERE employeeId = ?",
    [employeeId]
  );

  if (employeeRows.length === 0) return null;

  return employeeRows[0];
};

//update employee by id
const updateEmployee = async ({ employeeId, employeeName, employeeContact_no, employeeEmail, status, notes }) => {
  const query = `
    UPDATE employee 
    SET employeeName = ?, employeeContact_no = ?, employeeEmail = ?, status = ?, notes = ? 
    WHERE employeeId = ?
  `;
  await db.query(query, [employeeName, employeeContact_no, employeeEmail, status, notes, employeeId]);
};

module.exports = {
  generateEmployeeId,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
};