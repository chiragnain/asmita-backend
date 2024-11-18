// user schema

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   role: { type: String, enum: ['student', 'organizer', 'coach', 'admin'], required: true },
   full_name: { type: String, required: true },
   created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
