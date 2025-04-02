// routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ ใช้ Middleware Authentication

const router = express.Router();

// Get all products
router.get('/', authMiddleware, async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

// Get product by ID
router.get('/:id', authMiddleware, async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    res.json(product);
});

// Create Product
router.post('/', authMiddleware, async (req, res) => {
    const { name, description, price, stock, categoryId } = req.body;
    
    // เช็คว่า categoryId ที่ส่งมามีอยู่ในฐานข้อมูลหรือไม่
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(400).json({ error: 'Category not found' });
    }

    const newProduct = new Product({
        name,
        description,
        price,
        stock,
        category: categoryId // เชื่อมโยงกับ category
    });

    await newProduct.save();
    res.json({ message: 'Product added successfully', product: newProduct });
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
    // await Product.findByIdAndDelete(req.params.id);
    // res.json({ message: 'Product deleted successfully' });
    try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            
            res.json({ message: 'Product deleted successfully', category: deletedProduct });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error deleting Product' });
        }
});

module.exports = router;