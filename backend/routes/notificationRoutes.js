const express = require('express');
const router = express.Router();
const { createNotification, updateNotificationStatus, getNotificationByIncidentId, sendMessage } = require('../controllers/notificationController');
const notificationController = require('../controllers/notificationController');
// Route to create a new notification
router.post('/', createNotification);

// Route to update the notification status (read and attending)
router.post('/:notificationId/update', updateNotificationStatus);

// Route to fetch notification by incidentId
router.get('/:incidentId', getNotificationByIncidentId);

// Route to send a message to a notification's conversation thread
router.post('/:notificationId/send-message', sendMessage);

// Route to fetch notifications and conversation thread for a given incidentId
router.get('/notifications/:incidentId', notificationController.getNotificationWithConversation);



module.exports = router;
