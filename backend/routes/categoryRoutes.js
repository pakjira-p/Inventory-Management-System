// routes/categoryRoutes.js
const express = require('express');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ ใช้ Middleware Authentication

const router = express.Router();

// Get all categories
router.get('/', authMiddleware, async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// Get category by ID
router.get('/:id', authMiddleware, async (req, res) => {
    const category = await Category.findById(req.params.id);
    res.json(category);
});

// Create a category
router.post('/', authMiddleware, async (req, res) => {
    const newCategory = new Category(req.body);
    // await newCategory.save();
    // res.json(newCategory);
    await newCategory.save();
    res.json({ message: 'Category added successfully', categories: newCategory });
});

// Update category
router.put('/:id', authMiddleware, async (req, res) => {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCategory);
});

// Delete category by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.json({ message: 'Category deleted successfully', category: deletedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting category' });
    }
})

module.exports = router;