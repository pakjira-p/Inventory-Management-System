const mongoose = require('mongoose');

// Define Category Schema
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;




