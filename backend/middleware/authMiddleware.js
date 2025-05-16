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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Admin
    if (decoded.role === 'admin' && decoded.userId === process.env.ADMIN_USERNAME) {
      req.user = {
        userId: decoded.userId,
        userType: 'admin'
      };
      return next();
    }

    // Employee
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

    // Supplier
    if (decoded.role === 'supplier') {
      const [suppliers] = await db.query(
        'SELECT * FROM supplier WHERE supplierId = ? AND status = "active"',
        [decoded.userId]
      );

      if (!suppliers.length) {
        return res.status(401).send({ error: 'Supplier not found or inactive' });
      }

      const supplier = suppliers[0];
      req.user = {
        userId: supplier.supplierId,
        userType: 'supplier',
        email: supplier.supplierEmail,
        name: supplier.supplierName
      };
      return next();
    }

    // Driver
    if (decoded.role === 'driver') {
      const [drivers] = await db.query(
        'SELECT * FROM driver WHERE driverId = ? AND status = "active"',
        [decoded.userId]
      );

      if (!drivers.length) {
        return res.status(401).send({ error: 'Driver not found or inactive' });
      }

      const driver = drivers[0];
      req.user = {
        userId: driver.driverId,
        userType: 'driver',
        email: driver.driverEmail,
        name: driver.driverName
      };
      return next();
    }

    // Broker
    if (decoded.role === 'broker') {
      const [brokers] = await db.query(
        'SELECT * FROM broker WHERE brokerId = ? AND status = "active"',
        [decoded.userId]
      );

      if (!brokers.length) {
        return res.status(401).send({ error: 'Broker not found or inactive' });
      }

      const broker = brokers[0];
      req.user = {
        userId: broker.brokerId,
        userType: 'broker',
        email: broker.brokerEmail,
        name: broker.brokerName
      };
      return next();
    }

    // Unrecognized role
    return res.status(401).send({ error: 'Invalid user type' });

  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).send({ error: 'Please authenticate' });
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.userType)) {
      return res.status(403).send({ error: 'Access forbidden' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
