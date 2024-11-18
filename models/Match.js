const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Or use Date for a full timestamp
  duration: { type: Number, required: true },
  venue: { type: String, required: true },
  team1: { type: String, required: true }, // Can be team name or ID
  team2: { type: String, required: true }, // Can be team name or ID
  player1: { type: String }, // Use if it's an individual event
  player2: { type: String }, // Use if it's an individual event
}, { timestamps: true });

const Match = mongoose.model('Match', MatchSchema);
module.exports = Match;
