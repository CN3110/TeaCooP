const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { 
  getEmployeeById, 
  getSupplierById, 
  getDriverById, 
  getBrokerById,
  updateUserPassword,
  getUserByCredentials
} = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Enhanced login controller
const login = async (req, res) => {
  const { userId, passcode } = req.body;
  
  try {
    // Determine user type based on ID prefix
    const userType = getUserType(userId);
    
    // Get user from appropriate table
    let user = await getUserByCredentials(userType, userId);
    
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
        { 
          userId: user[`${userType}Id`], 
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
    
    // Regular login with password or passcode
    const isPasscodeMatch = passcode === user.passcode;
    const isPasswordMatch = user.password && await bcrypt.compare(passcode, user.password);
    
    if (!isPasscodeMatch && !isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token for regular login
    const token = jwt.sign(
      { 
        userId: user[`${userType}Id`], 
        userType 
      },
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

// Enhanced set password controller
const setPassword = async (req, res) => {
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
    
    // Update password in database
    await updateUserPassword(userType, userId, hashedPassword);
    
    // Generate new token without needsPassword flag
    const token = jwt.sign(
      { userId, userType },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({ 
      token,
      message: 'Password set successfully. Please login with your new password.',
      redirectTo: `/${userType}-dashboard`
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile controller
const getProfile = async (req, res) => {
  const { userId, userType } = req.user;
  
  try {
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
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove sensitive data before sending
    const { password, passcode, ...profileData } = user;
    
    res.json(profileData);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to determine user type
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

module.exports = {
  login,
  setPassword,
  getProfile
};