const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const employee = require('../models/employee');
const supplier = require('../models/supplier');
const driver = require('../models/driver');
const broker = require('../models/broker');
const db = require('../config/database');
require('dotenv').config();

// JWT generation
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '8h' });
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit numeric passcode
const generatePasscode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Login handler
exports.login = async (req, res) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password are required' });
  }

  try {
    // Admin login
    if (userId === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken(userId, 'admin');
      return res.status(200).json({
        role: 'admin',
        token,
        userId,
        message: 'Admin login successful',
      });
    }

    // Employee login
    if (userId.startsWith('E')) {
      const data = await employee.verifyEmployeeCredentials(userId, password);
      if (!data || data.status !== 'active') {
        return res.status(401).json({ error: 'Invalid credentials or inactive account' });
      }
      const token = generateToken(data.employeeId, 'employee');
      return res.status(200).json({
        role: 'employee',
        token,
        userId: data.employeeId,
        name: data.employeeName,
        email: data.employeeEmail,
        message: 'Login successful',
      });
    }

    // Supplier login
    if (userId.startsWith('S')) {
      const data = await supplier.verifySupplierCredentials(userId, password);
      if (!data || data.status !== 'active') {
        return res.status(401).json({ error: 'Invalid credentials or inactive account' });
      }
      const token = generateToken(data.supplierId, 'supplier');
      return res.status(200).json({
        role: 'supplier',
        token,
        userId: data.supplierId,
        name: data.supplierName,
        email: data.supplierEmail,
        message: 'Login successful',
      });
    }

    // Driver login
    if (userId.startsWith('D')) {
      const data = await driver.verifyDriverCredentials(userId, password);
      if (!data || data.status !== 'active') {
        return res.status(401).json({ error: 'Invalid credentials or inactive account' });
      }
      const token = generateToken(data.driverId, 'driver');
      return res.status(200).json({
        role: 'driver',
        token,
        userId: data.driverId,
        name: data.driverName,
        email: data.driverEmail,
        message: 'Login successful',
      });
    }

    // Broker login
    if (userId.startsWith('B')) {
      const data = await broker.verifyBrokerCredentials(userId, password);
      if (!data || data.status !== 'active') {
        return res.status(401).json({ error: 'Invalid credentials or inactive account' });
      }
      const token = generateToken(data.brokerId, 'broker');
      return res.status(200).json({
        role: 'broker',
        token,
        userId: data.brokerId,
        name: data.brokerName,
        email: data.brokerEmail,
        message: 'Login successful',
      });
    }

    // Unrecognized user ID format
    return res.status(400).json({ error: 'Invalid user ID format' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
};

// Token verification
exports.verifyToken = (req, res) => {
  res.status(200).json({
    authenticated: true,
    user: {
      userId: req.user.userId,
      userType: req.user.role,
      name: req.user.name || null,
      email: req.user.email || null,
    },
  });
};

// Password reset (employee who knows current password)
exports.resetPassword = async (req, res) => {
  const { employeeId, oldPassword, newPassword } = req.body;

  if (!employeeId || !oldPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const data = await employee.verifyEmployeeCredentials(employeeId, oldPassword);
    if (!data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await employee.updateEmployeePassword(employeeId, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};

// Forgot password handler
exports.forgotPassword = async (req, res) => {
  const { employeeEmail } = req.body;

  if (!employeeEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM employee WHERE employeeEmail = ? AND status = "active"',
      [employeeEmail]
    );

    if (rows.length === 0) {
      return res.status(200).json({ message: 'If your email is registered, you will receive a reset link' });
    }

    const employeeData = rows[0];
    const newPasscode = generatePasscode();

    await employee.updateEmployeePassword(employeeData.employeeId, newPasscode);

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

// In authController.js
exports.logout = async (req, res) => {
  try {
    // Clear JWT cookie (if using cookies)
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
