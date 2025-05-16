const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticate } = require('../middleware/authMiddleware');

// Get user profile based on type
router.get('/profile', authenticate, async (req, res) => {
    try {
        let profile;
        const { userId, userType } = req.user;

        switch (userType) {
            case 'supplier':
                [profile] = await pool.query(
                    'SELECT * FROM supplier WHERE supplierId = ?', 
                    [userId]
                );
                break;
            case 'driver':
                [profile] = await pool.query(
                    'SELECT * FROM driver WHERE driverId = ?', 
                    [userId]
                );
                break;
            case 'broker':
                [profile] = await pool.query(
                    'SELECT * FROM broker WHERE brokerId = ?', 
                    [userId]
                );
                break;
            case 'employee':
                [profile] = await pool.query(
                    'SELECT * FROM employee WHERE employeeId = ?', 
                    [userId]
                );
                break;
            default:
                return res.status(400).send({ error: 'Invalid user type' });
        }

        if (!profile || !profile.length) {
            return res.status(404).send({ error: 'Profile not found' });
        }

        res.send(profile[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch profile' });
    }
});

module.exports = router;