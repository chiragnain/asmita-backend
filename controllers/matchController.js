const Match = require('../models/Match');

// Controller to schedule a new match
exports.scheduleMatch = async (req, res) => {
  const { event, date, time,duration, venue, team1, team2, player1, player2 } = req.body;

  try {
    const newMatch = new Match({
      event,
      date,
      time,
      venue,
      duration,
      team1: team1 || null,
      team2: team2 || null,
      player1: player1 || null,
      player2: player2 || null,
    });

    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({ message: 'Error scheduling match', error });
  }
};

// Controller to fetch matches for an event
exports.getMatchesForEvent = async (req, res) => {
  try {
    const matches = await Match.find({ event: req.params.eventId });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches', error });
  }
};

// Get all matches
exports.getAllMatches = async (req, res) => {
    try {
      const matches = await Match.find().populate('event', 'name eventType');
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve matches' });
    }
  };

// Get live matches
exports.getLiveMatches = async (req, res) => {
    try {
      const matches = await Match.find();
      const currentTime = new Date();
  
      const liveMatches = matches.filter(match => {
        const matchStart = new Date(`${match.date}T${match.time}`);
        const matchEnd = new Date(matchStart.getTime() + match.duration * 60000); // Add duration to start time
        return currentTime >= matchStart && currentTime <= matchEnd;
      });
  
      res.json(liveMatches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve live matches' });
    }
  };

// Get upcoming matches (within the next 2 hours)
exports.getUpcomingMatches = async (req, res) => {
    try {
      const matches = await Match.find();
      const currentTime = new Date();
      const twoHoursLater = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000); // Current time + 2 hours
  
      const upcomingMatches = matches.filter(match => {
        const matchStart = new Date(`${match.date}T${match.time}`);
        return matchStart > currentTime && matchStart <= twoHoursLater;
      });
  
      res.json(upcomingMatches);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve upcoming matches' });
    }
  };