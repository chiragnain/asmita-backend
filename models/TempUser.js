// models/TempUser.js
const mongoose = require('mongoose');

const tempUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    role: { type: String, required: true },
    verificationToken: { type: String, required: true },
    tokenExpiry: { type: Date, required: true },
});

module.exports = mongoose.model('TempUser', tempUserSchema);
