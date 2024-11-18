// Event routes
// routes/eventRoutes.js
const express = require('express');
const { createEvent,getAllEvents,registerIndividual,registerTeam,getParticipantsByEvent} = require('../controllers/eventController');
const { authenticate_Admin_Organizer, authenticate_student } = require('../middlewares/authMiddleware');


const router = express.Router();

router.post('/', authenticate_Admin_Organizer, createEvent); // Create a new event , add a middleware- authenticate
router.get('/', getAllEvents); // Get all events
router.post('/:eventId/register/individual',authenticate_student ,registerIndividual); // Route to register an individual for an event
router.post('/:eventId/register/team', registerTeam); // Route to register a team for an event
router.get('/:eventId/participants',authenticate_Admin_Organizer, getParticipantsByEvent); // get partcipants for an event



module.exports = router;
