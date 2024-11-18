const express = require('express');
const router = express.Router();
const {scheduleMatch,getMatchesForEvent,getAllMatches,getLiveMatches,
    getUpcomingMatches,
} = require('../controllers/matchController'); // Adjust the path as necessary
const { authenticate_Admin_Organizer } = require('../middlewares/authMiddleware');

// Schedule a new match
router.post('/schedule',authenticate_Admin_Organizer, scheduleMatch);

// Fetch matches for an event
router.get('/:eventId/matches', getMatchesForEvent);

// Route to get all matches
router.get('/', getAllMatches);

// Route to get live matches
router.get('/live', getLiveMatches);

// Route to get upcoming matches within the next 2 hours
router.get('/upcoming', getUpcomingMatches);

module.exports = router;
