// models/Announcement.js
const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Adjust according to your user model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
