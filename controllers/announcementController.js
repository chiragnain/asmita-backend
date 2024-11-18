// controllers/announcementsController.js
const Announcement = require('../models/Announcement'); // Adjust the path as per your structure

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); // Sort announcements by creation date
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error });
  }
};

// Create an announcement
const createAnnouncement = async (req, res) => {
  const { title, content } = req.body;
  const announcement = new Announcement({ title, content, createdBy: req.user.id }); // Assume req.user.id is the ID of the organizer

  try {
    const savedAnnouncement = await announcement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating announcement', error });
  }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error });
  }
};

module.exports = {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
};
