const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authenticate } = require('../middleware/authMiddleware');

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { userId, password } = req.body;
        const normalizedUserId = userId.toUpperCase();
        
        const [users] = await pool.query(
            'SELECT * FROM user_auth WHERE userId = ?', 
            [normalizedUserId]
        );

        if (!users.length) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const user = users[0];
        
        // For first login, use passcode as password
        const isPasswordValid = user.isFirstLogin 
            ? password === user.passcode
            : await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        // Update last login and first login status if needed
        if (user.isFirstLogin) {
            await pool.query(
                'UPDATE user_auth SET lastLogin = CURRENT_TIMESTAMP WHERE userId = ?',
                [user.userId]
            );
        } else {
            await pool.query(
                'UPDATE user_auth SET lastLogin = CURRENT_TIMESTAMP, isFirstLogin = FALSE WHERE userId = ?',
                [user.userId]
            );
        }

        const token = jwt.sign(
            { userId: user.userId, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.send({ 
            token,
            userType: user.userType,
            isFirstLogin: user.isFirstLogin
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Login failed' });
    }
});

// Set password endpoint (for first login)
router.post('/set-password', authenticate, async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        
        if (newPassword !== confirmPassword) {
            return res.status(400).send({ error: 'Passwords do not match' });
        }

        const [users] = await pool.query(
            'SELECT * FROM user_auth WHERE userId = ? AND isFirstLogin = TRUE',
            [req.user.userId]
        );

        if (!users.length) {
            return res.status(403).send({ error: 'Password already set' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await pool.query(
            'UPDATE user_auth SET password = ?, isFirstLogin = FALSE WHERE userId = ?',
            [hashedPassword, req.user.userId]
        );

        res.send({ message: 'Password set successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to set password' });
    }
});

module.exports = router;