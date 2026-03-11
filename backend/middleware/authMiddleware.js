const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                return next(new Error('Not authorized, user not found'));
            }
            next();
        } catch (error) {
            console.error('JWT Error:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    console.log('Admin check for user:', req.user?._id, 'Role:', req.user?.role);
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        console.error('Admin authorization failed for user:', req.user?._id);
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };
