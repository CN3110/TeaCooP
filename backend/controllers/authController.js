const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Validate critical environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('Missing JWT_SECRET environment variable');
}

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const JWT_FIRST_LOGIN_EXPIRES_IN = process.env.JWT_FIRST_LOGIN_EXPIRES_IN || '1h';

// Helper function to determine user type (consistent table names)
function getUserType(userId) {
  const prefix = userId.charAt(0).toUpperCase();
  switch(prefix) {
    case 'E': return { userType: 'employee', tableName: 'employee', idField: 'employeeId' };
    case 'S': return { userType: 'supplier', tableName: 'supplier', idField: 'supplierId' };
    case 'D': return { userType: 'driver', tableName: 'driver', idField: 'driverId' };
    case 'B': return { userType: 'broker', tableName: 'broker', idField: 'brokerId' };
    default: throw new Error('Invalid user ID format');
  }
}

// Enhanced password validation
function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  // Add more rules as needed
  return { valid: true };
}

exports.login = async (req, res) => {
  const { userId, passcode } = req.body;

  try {
    const { userType, tableName, idField } = getUserType(userId);
    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} WHERE ${idField} = ?`, 
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // First login flow
    if (!user.password) {
      if (user.passcode !== passcode) {
        return res.status(401).json({ message: 'Invalid passcode' });
      }

      const token = jwt.sign(
        { userId: user[idField], userType, needsPassword: true },
        JWT_SECRET,
        { expiresIn: JWT_FIRST_LOGIN_EXPIRES_IN }
      );

      return res.json({ 
        token,
        userType,
        needsPassword: true,
        message: 'Please set your password'
      });
    }

    // Regular login
    const isMatch = await bcrypt.compare(passcode, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user[idField], userType },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token, userType, message: 'Login successful' });
    
  } catch (error) {
    console.error('Login error:', error);
    if (error.message === 'Invalid user ID format') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ 
      message: 'Authentication failed',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

exports.setPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { userId, userType } = req.user;
  
  try {
    // Validate passwords
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    const { valid, message } = validatePassword(newPassword);
    if (!valid) {
      return res.status(400).json({ message });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    const { tableName, idField } = getUserType(userId);
    
    // Update database
    await pool.query(
      `UPDATE ${tableName} SET password = ? WHERE ${idField} = ?`,
      [hashedPassword, userId]
    );
    
    // Generate new token without needsPassword flag
    const token = jwt.sign(
      { userId, userType },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    res.json({ 
      token,
      userType,
      message: 'Password set successfully'
    });
    
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ 
      message: 'Password update failed',
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
};

exports.getProfile = async (req, res) => {
  const { userId, userType } = req.user;
  
  try {
    const { tableName, idField } = getUserType(userId);
    
    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} WHERE ${idField} = ?`,
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = rows[0];
    const { password, passcode, ...profileData } = user;
    
    res.json(profileData);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};