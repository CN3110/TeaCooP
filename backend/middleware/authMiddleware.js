const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

// Middleware to authenticate users based on JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).send({ error: 'Authentication required' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For admin users
    if (decoded.role === 'admin' && decoded.userId === process.env.ADMIN_USERNAME) {
      req.user = {
        userId: decoded.userId,
        userType: 'admin'
      };
      return next();
    }
    
    // For employee users
    if (decoded.role === 'employee') {
      const [employees] = await db.query(
        'SELECT * FROM employee WHERE employeeId = ? AND status = "active"', 
        [decoded.userId]
      );

      if (!employees.length) {
        return res.status(401).send({ error: 'Employee not found or inactive' });
      }

      const employee = employees[0];
      req.user = {
        userId: employee.employeeId,
        userType: 'employee',
        email: employee.employeeEmail,
        name: employee.employeeName
      };
      return next();
    }

    // If we get here, the token is valid but the user type is not recognized
    return res.status(401).send({ error: 'Invalid user type' });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Middleware to authorize based on role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      return res.status(403).send({ error: 'Access forbidden' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };