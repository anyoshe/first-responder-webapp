const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  responderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Responder', required: true },
  incidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Incident', required: true },
  messageText: { type: String, required: true }, // The message content
  status: { type: String, enum: ['sent', 'read', 'attended'], default: 'sent' }, // Track the message status
  read: { type: Boolean, default: false }, // If the message is read
  attending: { type: Boolean, default: false }, // If the responder is attending the incident
  timestamp: { type: Date, default: Date.now }, // When the message is sent
  createdAt: { type: Date, default: Date.now }, // Creation time of the message
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
