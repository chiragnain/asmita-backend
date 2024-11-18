// routes/announcements.js
const express = require('express');
const router = express.Router();
const { createAnnouncement, deleteAnnouncement, getAnnouncements } = require('../controllers/announcementController');
const { authenticate_Admin_Organizer } = require('../middlewares/authMiddleware'); // Optional: Middleware to authenticate organizer

// Get all announcements
router.get('/', getAnnouncements);

// Create an announcement (only for organizers)
router.post('/', authenticate_Admin_Organizer, createAnnouncement);

// Delete an announcement (only for organizers)
router.delete('/:id', authenticate_Admin_Organizer, deleteAnnouncement);

module.exports = router;
