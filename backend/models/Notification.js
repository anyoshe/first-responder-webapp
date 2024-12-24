const mongoose = require('mongoose');

// Define the schema for notifications
const notificationSchema = new mongoose.Schema({
  responderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming you're storing users in a 'User' collection
    required: true,
  },
  incidentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',  // Assuming you're storing incidents in an 'Incident' collection
    required: true,
  },
  messageText: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'accepted', 'rejected'],  // Default status is 'sent'
    default: 'sent',
  },
  read: {
    type: Boolean,
    default: false,  // Initially unread
  },
  attending: {
    type: Boolean,
    default: false,  // Initially not attending
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  conversationThread: [{
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // The user who sent the message (responder or dispatcher)
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }]
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
