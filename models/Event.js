//Event.js
const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const TeamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  members: [TeamMemberSchema],
});

// event schema
const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  sportType: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  eventType: { type: String, enum: ['individual', 'team'], required: true },
  teamSize: {type: Number},
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrations: {
    individuals: [{ email: { type: String, required: true } }],
    teams: [TeamSchema],
},
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);
module.exports = Event;
