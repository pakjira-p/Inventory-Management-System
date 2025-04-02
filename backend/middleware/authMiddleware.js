// ตรวจสอบว่า Request มี JWT Token หรือไม่
// ถ้าถูกต้อง ให้ req.user มีค่าเป็น User ID
// ใช้ next() เพื่อให้ Request ดำเนินต่อไป

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Get user from token
        if (!req.user) return res.status(401).json({ error: 'User not found' });
        next(); // User is authenticated, proceed to the next middleware
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;



