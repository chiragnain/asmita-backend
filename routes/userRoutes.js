// routes/userRoutes.js

const express = require('express');
const { getAllUsers,updateUserRole,deleteUser,getOrganizers } = require('../controllers/userController');
const { authenticate_Admin_Organizer } = require('../middlewares/authMiddleware'); // Only accessible to authenticated users

const router = express.Router();

router.get('/', authenticate_Admin_Organizer,getAllUsers); // Get all users , add authentication later
router.patch('/update-role', authenticate_Admin_Organizer,updateUserRole); // Route to update user role
router.delete('/:userId',authenticate_Admin_Organizer, deleteUser); // Route to delete a user
router.get('/organizers',authenticate_Admin_Organizer ,getOrganizers);

module.exports = router;
