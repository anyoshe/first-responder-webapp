// // controllers/incidentController.js
// const Incident = require('../models/Incident');
// const Message = require('../models/Message');
// // const { sendMessageToResponder, sendMessagesToAllResponders } = require('./messageController');


// // Create a new incident
// exports.createIncident = async (req, res) => {
//   try {
//     const { incidentId, location, type, priority, description } = req.body;

//     const newIncident = new Incident({
//       incidentId,
//       location,
//       type,
//       priority,
//       description,
//     });

//     await newIncident.save();
//     res.status(201).json({ message: 'Incident created successfully', incident: newIncident });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create incident', error: error.message });
//   }
// };

// // Get all incidents
// exports.getIncidents = async (req, res) => {
//   try {
//     const { type, priority } = req.query;

//     const filters = {};
//     if (type) filters.type = type;
//     if (priority) filters.priority = priority;

//     const incidents = await Incident.find(filters).sort({ createdAt: -1 });
//     res.status(200).json({ message: 'Incidents fetched successfully', incidents });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch incidents', error: error.message });
//   }
// };

// // Update incident status
// exports.updateIncidentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const updatedIncident = await Incident.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );

//     if (!updatedIncident) {
//       return res.status(404).json({ message: 'Incident not found' });
//     }

//     res.status(200).json({ message: 'Incident status updated', incident: updatedIncident });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to update incident', error: error.message });
//   }
// };



// // Send a message to a single responder
// const sendMessageToResponder = async (responderId, incidentId, location, description, priority) => {
//   try {
//     const newMessage = new Message({
//       responderId,
//       incidentId,
//       location,
//       description,
//       priority,
//     });

//     await newMessage.save();
//     console.log('Message sent successfully');
//   } catch (error) {
//     console.error('Failed to send message:', error);
//     throw new Error('Failed to send message');
//   }
// };

// // Send messages to all responders
// const sendMessagesToAllResponders = async (incident, responders) => {
//   try {
//     for (const responder of responders) {
//       await sendMessageToResponder(responder._id, incident._id, incident.location, incident.description, incident.priority);
//     }
//   } catch (error) {
//     console.error('Failed to send messages to all responders:', error);
//     throw new Error('Failed to send messages');
//   }
// };

// module.exports = {
//   sendMessageToResponder,
//   sendMessagesToAllResponders,
// };


// // Assign a single responder to the incident and send them a message
// const assignResponder = async (req, res) => {
//   const { responderId, incidentId } = req.body;

//   try {
//     // Update the incident status
//     const incident = await Incident.findById(incidentId);
//     if (!incident) {
//       return res.status(404).json({ error: 'Incident not found' });
//     }

//     incident.status = 'Assigned';
//     incident.responders.push(responderId);
//     await incident.save();

//     // Send a message to the assigned responder
//     await sendMessageToResponder(
//       responderId,
//       incidentId,
//       incident.location,
//       incident.description,
//       incident.priority
//     );

//     res.status(200).json({ message: 'Incident assigned and message sent' });
//   } catch (error) {
//     console.error('Failed to assign responder:', error);
//     res.status(500).json({ error: 'Failed to assign responder' });
//   }
// };

// // Assign all available responders to the incident and send them messages
// const assignAllResponders = async (req, res) => {
//   const { incidentId, responders } = req.body;

//   try {
//     // Update the incident status
//     const incident = await Incident.findById(incidentId);
//     if (!incident) {
//       return res.status(404).json({ error: 'Incident not found' });
//     }

//     incident.status = 'Assigned';
//     incident.responders = responders.map(res => res._id); // Assuming `responders` is an array of responder objects
//     await incident.save();

//     // Send messages to all responders
//     await sendMessagesToAllResponders(incident, responders);

//     res.status(200).json({ message: 'Incident assigned to all responders and messages sent' });
//   } catch (error) {
//     console.error('Failed to assign all responders:', error);
//     res.status(500).json({ error: 'Failed to assign all responders' });
//   }
// };

// module.exports = {
//   assignResponder,
//   assignAllResponders,
// };
const Incident = require('../models/Incident');
const Message = require('../models/Message');

// Create a new incident
exports.createIncident = async (req, res) => {
  try {
    const { incidentId, location, type, priority, description } = req.body;

    const newIncident = new Incident({
      incidentId,
      location,
      type,
      priority,
      description,
    });

    await newIncident.save();
    res.status(201).json({ message: 'Incident created successfully', incident: newIncident });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create incident', error: error.message });
  }
};

// Get all incidents
exports.getIncidents = async (req, res) => {
  try {
    const { type, priority } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (priority) filters.priority = priority;

    const incidents = await Incident.find(filters).sort({ createdAt: -1 });
    res.status(200).json({ message: 'Incidents fetched successfully', incidents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch incidents', error: error.message });
  }
};

// Update incident status
exports.updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    res.status(200).json({ message: 'Incident status updated', incident: updatedIncident });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update incident', error: error.message });
  }
};

// Send a message to a single responder
const sendMessageToResponder = async (responderId, incidentId, location, description, priority) => {
  try {
    // Construct the messageText based on incident details
    const messageText = `Incident at ${location}. Description: ${description}. Priority: ${priority}.`;

    const newMessage = new Message({
      responderId,
      incidentId,
      location,
      description,
      priority,
      messageText, // Ensure messageText is included
    });

    await newMessage.save();
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Failed to send message:', error);
    throw new Error('Failed to send message');
  }
};

// Send messages to all responders
const sendMessagesToAllResponders = async (incident, responders) => {
  try {
    for (const responder of responders) {
      await sendMessageToResponder(responder._id, incident._id, incident.location, incident.description, incident.priority);
    }
  } catch (error) {
    console.error('Failed to send messages to all responders:', error);
    throw new Error('Failed to send messages');
  }
};

// Assign a single responder to the incident and send them a message
exports.assignResponder = async (req, res) => {
  const { responderId, incidentId } = req.body;

  try {
    // Log incoming data for debugging
    console.log('Assigning responder:', { responderId, incidentId });

    // Update the incident status
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      console.log('Incident not found');
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.status = 'Assigned';
    incident.responders.push(responderId);
    await incident.save();

    // Send a message to the assigned responder
    await sendMessageToResponder(
      responderId,
      incidentId,
      incident.location,
      incident.description,
      incident.priority
    );

    res.status(200).json({ message: 'Incident assigned and message sent' });
  } catch (error) {
    console.error('Failed to assign responder:', error);
    res.status(500).json({ error: 'Failed to assign responder', details: error.message });
  }
};


// Assign all available responders to the incident and send them messages
exports.assignAllResponders = async (req, res) => {
  const { incidentId, responders } = req.body;

  try {
    // Update the incident status
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    incident.status = 'Assigned';
    incident.responders = responders.map(res => res._id); // Assuming `responders` is an array of responder objects
    await incident.save();

    // Send messages to all responders
    await sendMessagesToAllResponders(incident, responders);

    res.status(200).json({ message: 'Incident assigned to all responders and messages sent' });
  } catch (error) {
    console.error('Failed to assign all responders:', error);
    res.status(500).json({ error: 'Failed to assign all responders' });
  }
};
