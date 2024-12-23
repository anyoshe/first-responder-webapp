const express = require('express');
const {
  getUnreadMessages,
  markMessageAsRead,
  getIncidentMessages,
  getMessages,
  sendMessage,
} = require('../controllers/messageController');

const router = express.Router();

// Route to fetch unread messages for a specific responder
router.get('/unread/:responderId', getUnreadMessages);

// Ensure this route exists to handle the GET request
router.get('/', getMessages);


// Route to mark a specific message as read
router.put('/mark-read/:messageId', markMessageAsRead);

// Route to fetch all messages for a specific incident
router.get('/incident/:incidentId', getIncidentMessages);

// Route to send a new message
router.post('/send', sendMessage);

module.exports = router;
