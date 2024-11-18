// event logic
// controllers/eventController.js
const Event = require('../models/Event');
const User = require('../models/User');

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { name, organizer, description, date, location, sportType, maxParticipants, eventType, teamSize } = req.body;

    // Validate eventType and teamSize for team events
    if (eventType === 'team' && (!teamSize || teamSize < 1)) {
      return res.status(400).json({ message: 'Team events require a valid team size.' });
    }

    // Create the new event
    const newEvent = new Event({
      name,organizer,description,date,location,sportType,maxParticipants,eventType,
      teamSize: eventType === 'team' ? teamSize : undefined, // only set if it's a team event
    });
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'full_name email');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register an individual for an event
exports.registerIndividual = async (req, res) => {
  const { eventId } = req.params;
  const userEmail = req.user.email; // Assuming req.user is set by your authentication middleware
  try {
      const event = await Event.findById(eventId);
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      // Check if the user is already registered for this event
      const alreadyRegistered = event.registrations.individuals.some(registration => registration.email === userEmail);
      if (alreadyRegistered) {
          return res.status(400).json({ message: 'You are already registered for this event' });
      }

      // Check if max participants reached
      if (event.registrations.individuals.length >= event.maxParticipants) {
          return res.status(400).json({ message: 'Max participants reached' });
      }

      // Add individual to the registrations using the email
      event.registrations.individuals.push({ email: userEmail });
      await event.save();

      res.status(201).json({ message: 'Registration successful', event });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


// Register a team for an event
exports.registerTeam = async (req, res) => {
  const { eventId } = req.params;
  const { teamName, members } = req.body;
  console.log(req.body);

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the max number of teams would be exceeded
    if (event.registrations.teams.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Max number of teams reached for this event' });
    }

    // Check if the team name is already taken
    const isTeamNameTaken = event.registrations.teams.some(team => team.teamName === teamName);
    if (isTeamNameTaken) {
      return res.status(400).json({ message: `The team name "${teamName}" is already taken. Please choose a different name.` });
    }

    // Verify each email in 'members' exists in the database and is not an organizer or admin and are registered
    const invalidMembers = [];
    const verifiedMembers = [];
    const unregisteredMembers=[];

    for (const email of members) {
      const user = await User.findOne({ email });
      
      if (!user) {
        unregisteredMembers.push(email); // User does not exist in the database
      } else if (user.role === 'organizer' || user.role === 'admin') {
        invalidMembers.push(email); // User has a restricted role
      } else {
        verifiedMembers.push(email); // Valid member
      }
    }

    // if any unregistered members were found, return an error
    if (unregisteredMembers.length > 0) {
      return res.status(400).json({
        message: `The following members are unregistered: ${unregisteredMembers.join(', ')}`,
      });
    }

    // If any invalid members were found, return an error
    if (invalidMembers.length > 0) {
      return res.status(400).json({
        message: `The following members have restricted roles: ${invalidMembers.join(', ')}`,
      });
    }

    // Check if any of the verified emails are already registered in a team for this event
    const existingTeamEmails = event.registrations.teams.flatMap(team => team.members.map(member => member.email));
    const duplicateEmails = verifiedMembers.filter(email => existingTeamEmails.includes(email));
    
    if (duplicateEmails.length > 0) {
      return res.status(400).json({
        message: `These users are already registered in a team for this event: ${duplicateEmails.join(', ')}`
      });
    }

    // Add the team to the event's registrations with verified members
    event.registrations.teams.push({
      teamName,
      members: verifiedMembers.map(email => ({ email }))  // Store members as emails
    });
    await event.save();

    res.status(201).json({ message: 'Team registration successful', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// get participants team/individual for a particular event
exports.getParticipantsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Find the event and populate the organizer's details if needed
    const event = await Event.findById(eventId).populate('organizer', 'full_name email');

    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check event type and return participants accordingly
    if (event.eventType === 'individual') {
      return res.json({
        eventName: event.name,
        participants: event.registrations.individuals.map((p) => ({
          email: p.email,
        })),
      });
    } else if (event.eventType === 'team') {
      return res.json({
        eventName: event.name,
        teams: event.registrations.teams.map((team) => ({
          teamName: team.teamName,
          members: team.members.map((member) => ({
            email: member.email,
          })),
        })),
      });
    } else {
      return res.status(400).json({ message: 'Invalid event type' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
