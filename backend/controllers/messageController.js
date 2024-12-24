const Message = require('../models/Message');

// Fetch unread messages for a specific responder
const getUnreadMessages = async (req, res) => {
    try {
      const { responderId } = req.params;
      if (!responderId) {
        return res.status(400).json({ success: false, message: 'Responder ID is required' });
      }
      const unreadMessages = await Message.find({ responderId, read: false }).sort({ timestamp: -1 });
      console.log(unreadMessages);
      res.status(200).json({ success: true, messages: unreadMessages });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching unread messages', error });
    }
  };
  

// Mark a message as read
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Message marked as read', data: updatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking message as read', error });
  }
};

// Fetch all messages for a specific incident
const getIncidentMessages = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const messages = await Message.find({ incidentId }).sort({ timestamp: -1 });
    console.log(messages);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching incident messages', error });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { responderId, incidentId, messageText } = req.body;
    const newMessage = new Message({ responderId, incidentId, messageText });
    const savedMessage = await newMessage.save();
    res.status(201).json({ success: true, message: 'Message sent', data: savedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error sending message', error });
  }
};


// Get all messages (or messages for the specific user, if needed)
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });  // Adjust query if needed (e.g., for specific user)
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateMessageByIncidentId = async (req, res) => {
  try {
    const { incidentId } = req.params; // Extract incidentId from the request parameters
    const { read, attending } = req.body; // Extract updated fields from the request body

    // Find the message by incidentId and update the specified fields
    const updatedMessage = await Message.findOneAndUpdate(
      { incidentId }, // Find by incidentId
      { read, attending }, // Update these fields
      { new: true } // Return the updated document
    );

    if (!updatedMessage) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({ success: true, message: 'Message updated successfully', data: updatedMessage });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ success: false, message: 'Error updating message', error });
  }
};


module.exports = {
  getUnreadMessages,
  markMessageAsRead,
  getIncidentMessages,
  getMessages,
  sendMessage,
  updateMessageByIncidentId,
};

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { sender, receiver, text, responderId, incidentId } = req.body;
    const newMessage = new Message({ sender, receiver, text, responderId, incidentId });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating message', error });
  }
};
