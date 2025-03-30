const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'df9258e5d63a3390807b01376451a14aab0998c663b19c827e1f18b1a48765871b9224025559289302afdd3727c271eae9d2dc5cfd672cc049b1c1dc9dcade85';

// Helper function to determine user type
function getUserType(userId) {
  const prefix = userId.charAt(0).toUpperCase();
  switch(prefix) {
    case 'E': return { userType: 'employee', tableName: 'employees', idField: 'employeeId' };
    case 'S': return { userType: 'supplier', tableName: 'suppliers', idField: 'supplierId' };
    case 'D': return { userType: 'driver', tableName: 'drivers', idField: 'driverId' };
    case 'B': return { userType: 'broker', tableName: 'brokers', idField: 'brokerId' };
    default: throw new Error('Invalid user ID format');
  }
}

exports.login = async (req, res) => {
  const { userId, passcode } = req.body;

  try {
    // Get user type and table info
    const { userType, tableName, idField } = getUserType(userId);

    // Get user from database
    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} WHERE ${idField} = ?`, 
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // First login flow (no password set)
    if (!user.password) {
      if (user.passcode !== passcode) {
        return res.status(401).json({ message: 'Invalid passcode' });
      }

      const token = jwt.sign(
        { 
          userId: user[idField], 
          userType, 
          needsPassword: true,
          firstLogin: true 
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({ 
        token,
        userType,
        needsPassword: true,
        firstLogin: true,
        message: 'Please set your password'
      });
    }

    // Regular login flow
    const isMatch = await bcrypt.compare(passcode, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        userId: user[idField], 
        userType 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
      token,
      userType,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error(error);
    if (error.message === 'Invalid user ID format') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { userId, userType } = req.user;
  
  try {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Get table info
    const { tableName, idField } = getUserType(userId);
    
    // Update password in database
    await pool.query(
      `UPDATE ${tableName} SET password = ? WHERE ${idField} = ?`,
      [hashedPassword, userId]
    );
    
    // Generate new token
    const token = jwt.sign(
      { userId, userType },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({ 
      token,
      message: 'Password set successfully',
      redirectTo: `/${userType}-dashboard`
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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