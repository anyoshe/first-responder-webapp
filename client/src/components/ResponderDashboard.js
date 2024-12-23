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
  const [selectedChat, setSelectedChat] = useState(null);
  const navigate = useNavigate();

  const toggleAvailability = () => setIsAvailable((prev) => !prev);

  // Fetch unread messages periodically
  useEffect(() => {
    const fetchResponderIdAndUnreadMessages = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('No valid userId in localStorage');
        return;
      }

      try {
        // Fetch responderId based on userId
        const response = await axios.get(`http://localhost:5000/api/responder/responderId/${userId}`);
        const responderId = response.data.responderId;

        // Now fetch unread messages for this responderId
        const messagesResponse = await axios.get(`http://localhost:5000/api/messages/unread/${responderId}`);
        setUnreadMessages(messagesResponse.data.messages.length);
      } catch (error) {
        console.error('Error fetching responderId or unread messages:', error);
      }
    };

    fetchResponderIdAndUnreadMessages();
    const interval = setInterval(fetchResponderIdAndUnreadMessages, 5000);

    return () => clearInterval(interval);
  }, []);

  const openChatBox = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setMessages(response.data.reverse());
      setIsChatOpen(true);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const openMessage = (message) => {
    setSelectedChat(message.sender);
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg._id === message._id ? { ...msg, read: true } : msg
      )
    );
    axios.post(`http://localhost:5000/api/messages/${message._id}/read`);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, Responder</h1>
        <div className="header-icons">
          <div className="message-icon-container">
            <FaBell className="icon" title="Notifications" />
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
            {messages.map((message) => (
              <div
                key={message._id}
                className={`message-item ${message.read ? 'read' : 'unread'}`}
                onClick={() => openMessage(message)}
              >
                <strong>{message.sender}</strong>: {message.text}
              </div>
            ))}
          </div>
          {selectedChat && (
            <div className="chat-window">
              <h3>Chat with {selectedChat}</h3>
              <div className="chat-messages">
                {/* Add dynamic message rendering here */}
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ResponderDashboard;

