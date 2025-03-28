const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { 
  getEmployeeById, 
  getSupplierById, 
  getDriverById, 
  getBrokerById,
  updateUserPassword
} = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to determine user type based on ID prefix
function getUserType(userId) {
  const prefix = userId.charAt(0).toUpperCase();
  switch(prefix) {
    case 'E': return 'employee';
    case 'S': return 'supplier';
    case 'D': return 'driver';
    case 'B': return 'broker';
    default: throw new Error('Invalid user ID format');
  }
}

// Login controller
const login = async (req, res) => {
  const { userId, passcode } = req.body;
  
  try {
    // Determine user type based on ID prefix
    const userType = getUserType(userId);
    
    // Get user from appropriate table
    let user;
    switch(userType) {
      case 'employee':
        user = await getEmployeeById(userId);
        break;
      case 'supplier':
        user = await getSupplierById(userId);
        break;
      case 'driver':
        user = await getDriverById(userId);
        break;
      case 'broker':
        user = await getBrokerById(userId);
        break;
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if this is first login (using passcode)
    if (!user.password) {
      if (user.passcode !== passcode) {
        return res.status(401).json({ message: 'Invalid passcode' });
      }
      
      // Generate token for first login (redirect to profile page to set password)
      const token = jwt.sign(
        { userId: user[`${userType}Id`], userType, needsPassword: true },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      return res.json({ 
        token,
        userType,
        needsPassword: true,
        message: 'Please set your password'
      });
    }
    
    // Regular login with password
    const isMatch = await bcrypt.compare(passcode, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token for regular login
    const token = jwt.sign(
      { userId: user[`${userType}Id`], userType },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({ 
      token,
      userType,
      needsPassword: false,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Set password controller (after first login)
const setPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  const userType = req.user.userType; // From JWT
  
  try {
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password in appropriate table
    await updateUserPassword(userType, userId, hashedPassword);
    
    // Generate new token without needsPassword flag
    const token = jwt.sign(
      { userId, userType },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({ 
      token,
      message: 'Password set successfully'
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  setPassword
};