// กำหนด Schema ของ User มี username, email, และ password
// { timestamps: true } เพิ่ม createdAt และ updatedAt อัตโนมัติ

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
