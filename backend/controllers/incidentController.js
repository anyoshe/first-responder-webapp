// controllers/incidentController.js
const Incident = require('../models/Incident');

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
