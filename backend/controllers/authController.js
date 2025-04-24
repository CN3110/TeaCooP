const jwt = require('jsonwebtoken');
const employee = require('../models/employee');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Set up nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate random passcode - 6 digits
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

// Handle login for both admin and employees
exports.login = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password are required' });
  }

  try {
    // Check for admin login
    if (
      userId === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = generateToken(userId, 'admin');
      return res.status(200).json({
        role: 'admin',
        token,
        userId,
        message: 'Admin login successful'
      });
    }

    // Employee login
    const employeeData = await employee.verifyEmployeeCredentials(userId, password);
    
    if (!employeeData) {
      return res.status(401).json({ error: 'Invalid credentials or inactive account' });
    }

    const token = generateToken(employeeData.employeeId, 'employee');

    res.status(200).json({
      role: 'employee',
      token,
      employeeId: employeeData.employeeId,
      employeeName: employeeData.employeeName,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Verify token (for protected routes)
exports.verifyToken = async (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: {
      userId: req.user.userId,
      userType: req.user.userType,
      name: req.user.name || null,
      email: req.user.email || null
    }
  });
};

// Reset password (for employees who know their current password)
exports.resetPassword = async (req, res) => {
  const { employeeId, oldPassword, newPassword } = req.body;

  if (!employeeId || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Verify current credentials
    const employeeData = await employee.verifyEmployeeCredentials(employeeId, oldPassword);

    if (!employeeData) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update password
    await employee.updateEmployeePassword(employeeId, newPassword);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};

// Forgot password functionality
exports.forgotPassword = async (req, res) => {
  const { employeeEmail } = req.body;

  if (!employeeEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if employee exists with this email
    const [employees] = await require('../config/database').query(
      'SELECT * FROM employee WHERE employeeEmail = ? AND status = "active"',
      [employeeEmail]
    );

    if (employees.length === 0) {
      // For security, don't reveal if email exists or not
      return res.status(200).json({ message: 'If your email is registered, you will receive a reset link' });
    }

    const employeeData = employees[0];
    const newPasscode = generatePasscode();

    // Update employee with new passcode
    await employee.updateEmployeePassword(employeeData.employeeId, newPasscode);

    // Send email with new passcode
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employeeEmail,
      subject: 'Morawakkorale Tea CooP - Password Reset',
      text: `Dear ${employeeData.employeeName},

Your password has been reset. Please use the following credentials to log in:
User ID: ${employeeData.employeeId}
New Passcode: ${newPasscode}

After logging in, you can change your password using the change password option.

If you did not request this password reset, please contact us immediately.

Best regards,
Morawakkorale Tea Co-op
041-2271400`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'If your email is registered, you will receive a reset link' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error during password recovery' });
  }
};