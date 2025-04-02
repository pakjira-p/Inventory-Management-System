const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ ใช้ Middleware Authentication
const router = express.Router();

// GET all users
router.get('/', authMiddleware, async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// GET user by ID
router.get('/:id', authMiddleware, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// UPDATE user
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, email, password } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'User updated', user: updatedUser });
});

// DELETE user
router.delete('/:id', authMiddleware, async (req, res) => {
    // await User.findByIdAndDelete(req.params.id);
    // res.json({ message: 'User deleted' });
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully', category: deletedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting User' });
    }
});

module.exports = router;