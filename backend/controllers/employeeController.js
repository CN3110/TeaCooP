const employee = require('../models/employee');
const nodemailer = require('nodemailer');
require('dotenv').config();

// nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate random passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.addEmployee = async (req, res) => {
  const {
    employeeName,
    employeeContact_no,
    employeeEmail,
    status = 'pending',
    notes = null,
  } = req.body;

  if (!employeeName || !employeeContact_no || !employeeEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const employeeId = await employee.generateEmployeeId();
    const passcode = generatePasscode();

    await employee.createEmployee({
      employeeId,
      employeeName,
      employeeContact_no,
      employeeEmail,
      status,
      notes,
      passcode,
    });

    if (status === 'active') {
      // Send email with credentials
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employeeEmail,
        subject: 'Morawakkorale Tea CooP - Your Login Credentials',
        text: `Dear ${employeeName},

Your login credentials for the system are as follows:
User ID: ${employeeId}
Passcode: ${passcode}

Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
      };

      await transporter.sendMail(mailOptions);
    } 
    res.status(201).json({ message: 'Employee added successfully!' });
  } catch (error) {
    console.error('Error adding Employee:', error);
    res.status(500).json({ error: 'Failed to add Employee' });
  }
};

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await employee.getAllEmployees();
    // Don't send the hashed passcode to client
    const sanitizedEmployees = employees.map(emp => {
      const { passcode, ...rest } = emp;
      return rest;
    });
    res.status(200).json(sanitizedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

// Get employee by id
exports.getEmployeeById = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employeeData = await employee.getEmployeeById(employeeId);
    if (!employeeData) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    // Don't send the hashed passcode to client
    const { passcode, ...sanitizedEmployee } = employeeData;
    res.status(200).json(sanitizedEmployee); 
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

// Update employee by id
exports.updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { employeeName, employeeContact_no, employeeEmail, status, notes } = req.body;

  if (!employeeName || !employeeContact_no || !employeeEmail) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const validStatuses = ['active', 'inactive', 'pending'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const existing = await employee.getEmployeeById(employeeId);
    if (!existing) {
      return res.status(404).json({ error: 'Employee not found' });
    } 
    await employee.updateEmployee({
      employeeId,
      employeeName,
      employeeContact_no,
      employeeEmail,
      status,
      notes,
    });
    res.status(200).json({
      message: `Employee ${
        status === 'disabled' ? 'disabled' : 'updated'
      } successfully`,
      status,
    });
  } catch (error) {
    console.error('Error updating Employee:', error);
    res.status(500).json({ error: error.message || 'Failed to update Employee' });
  }
};
    
exports.disableEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employeeData = await employee.getEmployeeById(employeeId);
    if (!employeeData) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update employee status to disabled
    await employee.updateEmployee({
      employeeId,
      employeeName: employeeData.employeeName,
      employeeContact_no: employeeData.employeeContact_no,
      employeeEmail: employeeData.employeeEmail,
      status: 'disabled',
      notes: employeeData.notes
    });

    res.status(200).json({ message: 'Employee disabled successfully' });
  } catch (error) {
    console.error('Error disabling employee', error);
    res.status(500).json({ error: 'Failed to disable employee' });
  }
};

// Reset employee password (admin only)
exports.resetEmployeePassword = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employeeData = await employee.getEmployeeById(employeeId);
    if (!employeeData) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Generate new passcode
    const newPasscode = generatePasscode();
    await employee.updateEmployeePassword(employeeId, newPasscode);

    // Send email with new credentials
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employeeData.employeeEmail,
      subject: 'Morawakkorale Tea CooP - Password Reset by Admin',
      text: `Dear ${employeeData.employeeName},

Your password has been reset by an administrator. Your new login credentials are:
User ID: ${employeeId}
New Passcode: ${newPasscode}

Please use this passcode for your next login. After logging in, you can change your password.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Employee password reset successfully' });
  } catch (error) {
    console.error('Error resetting employee password', error);
    res.status(500).json({ error: 'Failed to reset employee password' });
  }
};  