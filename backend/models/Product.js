// กำหนด Schema ของ Product มี name, description, price, stock
// ใช้ { timestamps: true } เพื่อบันทึกวันที่สร้างและอัปเดตสินค้า

const mongoose = require('mongoose');

// Define Product Schema
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true // เพิ่มการกำหนดให้ category ต้องมีการเชื่อมโยง
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
