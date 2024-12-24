const Notification = require('../models/Notification'); // Path to your Notification model
const Responder = require('../models/Responder'); // Adjust the path as necessary

// Create a new notification when accepting or rejecting
const createNotification = async (req, res) => {
  const { responderId, incidentId, messageText, attending } = req.body;

  try {
    const newNotification = new Notification({
      responderId,
      incidentId,
      messageText,
      attending,
    });
    console.log(newNotification);
    await newNotification.save();
    res.status(201).json(newNotification); // Return the created notification
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the notification status (read and attending)
const updateNotificationStatus = async (req, res) => {
  const { notificationId } = req.params;
  const { read, attending } = req.body;

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read, attending },
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getNotificationByIncidentId = async (req, res) => {
  const { incidentId } = req.params;

  try {
    // Find the notification based on incidentId
    const notification = await Notification.findOne({ incidentId });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    console.log('Notification before population:', notification);

    // Manually fetch the responder and user details
    const responder = await Responder.findById(notification.responderId).populate('userId', 'name');

    // If no responder is found
    if (!responder) {
      return res.status(404).json({ success: false, message: 'Responder not found' });
    }

    // Attach the user information to the notification
    notification.responderId = responder;
    notification.responderId.userId = responder.userId;

    console.log('Notification after manual population:', notification);

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error('Error fetching notification by incidentId:', error);
    res.status(500).json({ success: false, message: 'Error fetching notification', error });
  }
};


// Send a message to the notification
const sendMessage = async (req, res) => {
  const { notificationId } = req.params;
  const { messageText, dispatcherId } = req.body; // The message and dispatcherId sent by the frontend
console.log(dispatcherId)
  try {
    // Validate that dispatcherId is provided
    if (!dispatcherId) {
      return res.status(400).json({ message: "Dispatcher ID is required" });
    }

    // Find the notification by its ID
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Add the new message to the conversation thread
    notification.conversationThread.push({
      senderId: dispatcherId, // Use dispatcherId from the request body
      message: messageText,
    });

    // Save the updated notification document
    await notification.save();

    // Return the updated notification
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Controller function to fetch notification and its conversation by incidentId
const getNotificationWithConversation = async (req, res) => {
  const { incidentId } = req.params;

  try {
    // Fetch notifications related to the given incidentId
    const notifications = await Notification.find({ incidentId });

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this incident.' });
    }

    // Fetch the conversation related to the incidentId
    const conversation = await Message.find({ incidentId }).sort({ timestamp: 1 });

    if (!conversation || conversation.length === 0) {
      return res.status(404).json({ message: 'No conversation found for this incident.' });
    }

    // Return both notifications and conversation in the response
    res.status(200).json({
      notifications,
      conversationThread: conversation,
    });
  } catch (error) {
    console.error('Error fetching notifications or conversation:', error);
    res.status(500).json({ message: 'Error fetching notifications or conversation' });
  }
};



module.exports = { createNotification, updateNotificationStatus, getNotificationByIncidentId, sendMessage, getNotificationWithConversation };
