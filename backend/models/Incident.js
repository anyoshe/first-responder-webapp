// models/Incident.js
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentId: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Fire', 'Medical', 'Accident', 'Heart Attack'], required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
  status: { type: String, enum: ['Pending', 'Assigned', 'Resolved', 'Escalated'], default: 'Pending' },
  description: { type: String },
  responders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Responder' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Incident', incidentSchema);
