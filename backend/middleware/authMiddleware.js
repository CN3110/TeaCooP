const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).send({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await pool.query(
            'SELECT * FROM user_auth WHERE userId = ?', 
            [decoded.userId]
        );

        if (!users.length) {
            return res.status(401).send({ error: 'User not found' });
        }

        const user = users[0];
        req.user = {
            userId: user.userId,
            userType: user.userType,
            email: user.email
        };

        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userType)) {
            return res.status(403).send({ error: 'Access forbidden' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };