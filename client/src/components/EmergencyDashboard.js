import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/EmergencyDashboard.css';

const EmergencyDashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [currentNotificationId, setCurrentNotificationId] = useState(null);  // New state for storing current notification ID
  const navigate = useNavigate();

  const chatSectionRef = useRef(null);

  // Fetch incidents from the API
  const fetchIncidents = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/incidents`);
      const data = await response.json();
      setIncidents(data.incidents || []);
    } catch (error) {
      console.error('Failed to fetch incidents', error);
    }
  };

  // Fetch Notifications (without full responder details)
  const fetchNotifications = async (incidentId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/${incidentId}`);
      const notification = response.data.notification;

      notification.responderId = notification.responderId || 'N/A';
      notification.attending = notification.attending || false;

      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  // Fetch incidents and notifications when the component mounts
  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    if (Array.isArray(incidents) && incidents.length > 0) {
      incidents.forEach((incident) => {
        fetchNotifications(incident._id);
      });
    }
  }, [incidents]);

  // Update the status when needed
  const updateStatus = (newStatus) => {
    setStatus(newStatus);
  };

  // Navigate to responder panel
  const navigateToResponderPanel = (incidentId, incidentLocation) => {
    navigate('/responder-panel', { state: { incidentId, incidentLocation } });
  };

  // Handle notification click for communication
  const handleNotificationClick = (notification) => {
    console.log('Communication with responder:', notification.responderId);
    setCurrentNotificationId(notification._id);  // Set the notificationId when starting a chat
    navigate('/communication-panel', { state: { responder: notification.responderId } });
  };

  // Handle chat and set the first message
  const handleChat = (notification) => {

    //Set the notificationId when starting a chat
  setCurrentNotificationId(notification._id); 
    // Scroll to the communication section
    chatSectionRef.current.scrollIntoView({ behavior: 'smooth' });

    // Set the initial chat message with responder info
    const initialMessage = {
      sender: notification.responderId,
      message: notification.attending
        ? `${notification.responderId} is attending to the incident.`
        : `${notification.responderId} is not attending.`,
    };

    // Update the chatMessages state with the initial message
    setChatMessages([initialMessage]);
  };

  // Handle the typing of a message
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

// Function to get the dispatcherId from localStorage
const getDispatcherId = () => {
  try {
    const dispatcherId = localStorage.getItem("dispatcherId"); // Retrieve dispatcherId from localStorage
    if (!dispatcherId) {
      throw new Error("Dispatcher ID not found in localStorage");
    }
    return dispatcherId;
  } catch (error) {
    console.error("Error retrieving dispatcherId:", error.message);
    return null;
  }
};

// Send message to the responder's notification
const sendMessage = async (notificationId) => {
  if (!notificationId || notificationId === "null") {
    alert("Invalid notification selected.");
    return;
  }

  const dispatcherId = getDispatcherId(); // Retrieve dispatcherId dynamically
  if (!dispatcherId) {
    alert("Unable to send message: Dispatcher not logged in.");
    return;
  }

  if (!message.trim()) {
    alert("Message cannot be empty.");
    return;
  }

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}/send-message`,
      {
        messageText: message,
        dispatcherId, // Include dispatcherId in the request
      }
    );

    // Update chat messages
    const newMessage = {
      sender: "Dispatcher",
      message: message,
    };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Clear the message input
    setMessage("");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};



  return (
    <div className="emergency-dashboard">
      <header className="headerPart">
        <div className="logo-title">
          <span className="logo">🚨</span>
          <h1>Emergency Dispatch System</h1>
        </div>
        <div className="header-tools">
          <div className="live-clock">🕒 12:45 PM | Dec 22, 2024</div>
          <div className="notification-icons">
            <div className="icon">
              <span className="material-icons">warning</span>
              <span className="badge urgent">2</span>
            </div>
            <div className="icon">
              <span className="material-icons">notifications</span>
              <span className="badge">5</span>
            </div>
          </div>
          <div className="profile-menu">👤 Dispatcher</div>
        </div>
      </header>

      <aside className="sidebar">
        <ul>
          <li>🏠 Dashboard Overview</li>
          <li>🔥 Active Incidents</li>
          <li>🚑 Responders</li>
          <li>📡 Communication Hub</li>
          <li>📊 Reports & Analytics</li>
          <li>⚙️ Settings</li>
        </ul>
      </aside>

      <main className="main-content">
        <section className="incident-panel">
          <h2>Incident Management</h2>
          <p>
            <Link to="/incident-panel">
              List your incident details
            </Link>
          </p>
          <div className="incident-list">
            {Array.isArray(incidents) && incidents.length > 0 ? (
              incidents.map((incident) => (
                <div key={incident._id} className="incident-card">
                  <p><strong>ID:</strong> {incident.incidentId}</p>
                  <p><strong>Location:</strong> {incident.location}</p>
                  <p><strong>Type:</strong> {incident.type}</p>
                  <p><strong>Priority:</strong> {incident.priority}</p>
                  <p><strong>Status:</strong> {incident.status}</p>
                  <div className="actions">
                    <button
                      onClick={() =>
                        navigateToResponderPanel(incident._id, incident.location)
                      }
                    >
                      Assign
                    </button>
                    <button onClick={() => updateStatus(incident._id, 'Resolved')}>Resolve</button>
                    <button onClick={() => updateStatus(incident._id, 'Escalated')}>Escalate</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No incidents to display.</p>
            )}
          </div>
        </section>

        <section className="responder-panel">
          <h2>Responder Monitoring</h2>
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification._id} className="responder-card">
                <p>
                  <strong>Responder ID:</strong> {notification.responderId || 'N/A'}
                </p>
                <p>
                  <strong>Attending Status:</strong>
                  {notification.attending ? 'Attending' : 'Not Attending'}
                </p>
                <p>
                  <strong>Chat:</strong>
                  <button
                    onClick={() => handleChat(notification)}
                    style={{ color: 'green' }}
                  >
                    Start Chat
                  </button>
                </p>
              </div>
            ))
          ) : (
            <p>No notifications available.</p>
          )}
        </section>

        <section ref={chatSectionRef} className="communication-panel">
          <h2>Communication Hub</h2>
          <div className="chat-window">
            {/* Display chat messages dynamically */}
            {chatMessages.length > 0 ? (
              chatMessages.map((msg, index) => (
                <p key={index}><strong>{msg.sender}:</strong> {msg.message}</p>
              ))
            ) : (
              <p>No chat messages yet.</p>
            )}
            <input
              type="text"
              value={message}
              onChange={handleMessageChange}
              placeholder="Type a message..."
            />
            <button
              onClick={() => sendMessage(currentNotificationId)}  // Pass the notificationId here
            >
              Send
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EmergencyDashboard;
