// controllers/userController.js

const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "full_name email role _id"); // Retrieve specific fields
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch all users with the role of "organizer"
exports.getOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({ role: 'organizer' }).select('_id full_name'); // Only select the fields needed
    res.status(200).json(organizers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    await User.findByIdAndUpdate(userId, { role: newRole });
    res.status(200).json({ message: `User role updated to ${newRole}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
