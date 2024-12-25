import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaUser, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For API calls
import '../styles/ResponderDashboard.css';

const ResponderDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const toggleAvailability = () => setIsAvailable((prev) => !prev);

  
// Fetch messages and notifications periodically
useEffect(() => {
  const fetchMessagesAndNotifications = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No valid userId in localStorage');
      return;
    }

    try {
      // Fetch responderId based on userId
      const responderResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/responder/responderId/${userId}`);
      const responderId = responderResponse.data.responderId;

      // Fetch all messages (chat messages and notifications)
      const messagesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages`);
      const allMessages = messagesResponse.data;

      // Separate notifications and messages
      const notifications = allMessages.filter(
        (msg) => msg.responderId === responderId && msg.incidentId
      );

      const chatMessages = allMessages.filter(
       (msg) => msg.responderId === responderId && !msg.incidentId
              );

      setNotifications(notifications.reverse()); // Save to state
      setMessages(chatMessages.reverse());

      // Update unread count for messages
        setUnreadMessages(chatMessages.filter((msg) => !msg.read).length);

    } catch (error) {
      console.error('Error fetching messages or notifications:', error);
    }
  };

  fetchMessagesAndNotifications();
  const interval = setInterval(fetchMessagesAndNotifications, 5000);

  return () => clearInterval(interval);
}, []);


const handleNotificationAction = async (notification, action) => {
  if (!notification) {
    console.error('Notification data is missing.');
    return;
  }

  try {
    const { responderId, incidentId, messageText } = notification;

    if (!responderId || !incidentId || !messageText) {
      throw new Error('Missing required notification data.');
    }

    const updatedReadStatus = true; // Mark as read
    const updatedAttendingStatus = action === 'accept'; // Accept or reject

    console.log('Processing notification:', { responderId, incidentId, messageText });

    // Step 1: Create a new notification (Mark notification as read)
    await axios.post(`${process.env.REACT_APP_API_URL}/api/notifications`, {
      responderId,
      incidentId,
      messageText,
      attending: updatedAttendingStatus,
      read: updatedReadStatus,
    });

    // Step 2: Update the corresponding message document
    await axios.put(`${process.env.REACT_APP_API_URL}/api/messages/${incidentId}`, {
      read: updatedReadStatus,
      attending: updatedAttendingStatus,
    });

    // Step 3: Update local state with read status and attending status
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif._id === notification._id
          ? { ...notif, read: updatedReadStatus, attending: updatedAttendingStatus }
          : notif
      )
    );

    // Step 4: Start polling for new conversations related to this notification
    startConversationPolling(incidentId);

  } catch (error) {
    console.error(`Error updating notification status or creating new notification: ${error.message}`);
  }
};

// Function to start polling for new conversations related to the notification
const startConversationPolling = (incidentId) => {
  // Poll every 5 seconds for new conversation updates related to the incidentId
  const interval = setInterval(async () => {
    try {
      // Fetch the latest conversation thread for the incident
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/conversations/${incidentId}`);
      const conversationThread = response.data.conversationThread;

      // If new messages are found, update the state and the notification icon
      if (conversationThread && conversationThread.length > 0) {
        setMessages((prevMessages) => {
          // Check if there are new messages in the thread
          const latestMessage = conversationThread[conversationThread.length - 1];
          const lastMessageTime = new Date(latestMessage.timestamp).getTime();
          
          // If the latest message is newer than the last message in the state, update the state
          const updatedMessages = [...prevMessages];
          const existingMessageIndex = updatedMessages.findIndex(
            (msg) => new Date(msg.timestamp).getTime() === lastMessageTime
          );

          if (existingMessageIndex === -1) {
            updatedMessages.push(latestMessage); // Add the new message
          }
          
          return updatedMessages;
        });

        // Update the notification icon for the specific notification
        setNotifications((prevNotifications) =>
          prevNotifications.map((notif) =>
            notif.incidentId === incidentId
              ? { ...notif, newMessages: true } // Mark as having new messages
              : notif
          )
        );
      }

    } catch (error) {
      console.error(`Error fetching conversation updates: ${error.message}`);
    }
  }, 5000); // Poll every 5 seconds

  // Optionally, you can clear the interval when done
  return () => clearInterval(interval);
};


  const openChatBox = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No valid userId in localStorage');
      return;
    }
  
    try {
      // Fetch responderId based on userId
      const responderResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/responder/responderId/${userId}`);
      const responderId = responderResponse.data.responderId;
      console.log(responderId);
      // Fetch all messages
      const messagesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages`);
      const allMessages = messagesResponse.data;
     console.log(allMessages)
      // Filter messages for the current responder
      const responderMessages = allMessages.filter(
        (message) => message.responderId === responderId
      );
      console.log(responderMessages);
      // Update the state with the filtered messages
      setMessages(responderMessages.reverse()); // Reverse for latest messages at the top
      console.log("Filtered Messages for Responder:", responderMessages);
  
      setIsChatOpen(true);
    } catch (error) {
      console.error('Error fetching messages or responderId:', error);
    }
  };
  

  const openMessage = (message) => {
    setSelectedChat(message.sender); // Or message.senderId if applicable
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === message._id ? { ...msg, read: true } : msg
      )
    );

    // Mark the message as read on the server
    axios.post(`${process.env.REACT_APP_API_URL}/api/messages/${message._id}/read`).catch((error) => {
      console.error('Error marking message as read:', error);
    });
  };

  const sendMessage = async (text) => {
    if (!selectedChat) {
      console.error("No chat selected!");
      return;
    }

    try {
      const newMessage = { sender: "Responder", receiver: selectedChat, text }; // Adjust sender/receiver logic
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/messages`, newMessage);

      console.log('Messages:', messages);

      // Append the new message to the current chat
      setMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, Responder</h1>
        <div className="header-icons">
          <div className="message-icon-container">
            <FaBell className={`icon ${isNotificationOpen ? 'active' : ''}`}
             title="Notifications"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)} />
          {notifications.filter((notif) => !notif.read).length > 0 && (
              <span className="unread-badge">
                {notifications.filter((notif) => !notif.read).length}
              </span>
            )}
          </div>
          <div className="icon-container">
            <FaEnvelope className="icon" title="Messages" onClick={openChatBox} />
            {unreadMessages > 0 && (
              <span className="unread-badge">{unreadMessages}</span>
            )}
          </div>
          <div className="icon-container">
            <FaUser className="icon" title="Profile" onClick={() => navigate('/responder-profile')} />
          </div>
        </div>
      </header>

      {/* Availability Toggle */}
      <div className="availability-section">
        <button
          className={`availability-btn ${isAvailable ? 'available' : 'unavailable'}`}
          onClick={toggleAvailability}
        >
          {isAvailable ? 'Go Unavailable' : 'Go Available'}
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Section */}
        <div className="dashboard-left">
          <div className="card" onClick={() => navigate('/community')}>
            Join the Community
          </div>
          <div className="card" onClick={() => navigate('/help')}>
            Get Help
          </div>
          <div className="card" onClick={() => navigate('/hospitals')}>
            <FaMapMarkerAlt className="card-icon" />
            Hospitals Within Reach
          </div>
          <div className="card" onClick={() => navigate('/trainings')}>
            Trainings and Updates
          </div>
        </div>

        {/* Right Section */}
        <div className="dashboard-right">

            {/* Notifications Section */}
        {isNotificationOpen && (
          <div className="notification-box">
            <div className="notification-header">
              <h2>Notifications</h2>
              <button onClick={() => setIsNotificationOpen(false)}>Close</button>
            </div>
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <p>{notification.messageText}</p>
                  <div className="notification-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleNotificationAction(notification, 'accept')}
                      disabled={notification.attending}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleNotificationAction(notification, 'reject')}
                      disabled={!notification.attending}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          <div className="chatbot-section">
            <FaRobot className="chatbot-icon" />
            <p>Need Assistance? Chat with our Bot!</p>
          </div>
          <div className="emergency-section">
            <button className="emergency-btn" onClick={() => navigate('/emergency')}>
              Emergency Response
            </button>
          </div>
          <div className="chat-section">
            <button className="chat-btn" onClick={() => navigate('/start-chat')}>
              Start a Chat
            </button>
          </div>
        </div>
      </div>
      {isChatOpen && <div className="chat-overlay" onClick={() => setIsChatOpen(false)}></div>}

      {/* Chat Box */}
      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <h2>Messages</h2>
            <button onClick={() => setIsChatOpen(false)}>Close</button>
          </div>
          <div className="message-list">
            {messages.map((message) => {
              console.log("Rendering Message:", message);
              return (
                <div
                  key={message._id}
                  className={`message-item ${message.read ? 'read' : 'unread'}`}
                  onClick={() => openMessage(message)}
                >
                  <strong>{message.sender}</strong>: {message.messageText}
                </div>
              );
            })}
          </div>


          {selectedChat && (
            <div className="chat-window">
              <h3>Chat with {selectedChat}</h3>
              <div className="chat-messages">
                {messages
                  .filter(
                    (msg) => msg.sender === selectedChat || msg.receiver === selectedChat
                  )
                  .map((msg) => (
                    <div key={msg._id} className={`chat-message ${msg.read ? 'read' : 'unread'}`}>
                      <p><strong>{msg.sender}:</strong> {msg.text}</p>
                    </div>
                  ))}

              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ResponderDashboard;