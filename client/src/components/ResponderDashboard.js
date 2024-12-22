import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaUser, FaMapMarkerAlt, FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/ResponderDashboard.css';

const ResponderDashboard = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();

  const toggleAvailability = () => setIsAvailable((prev) => !prev);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome, Responder</h1>
        <div className="header-icons">
          <FaBell className="icon" title="Notifications" />
          <FaEnvelope className="icon" title="Messages" />
          <FaUser className="icon" title="Profile" onClick={() => navigate('/responder-profile')} />
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
    </div>
  );
};

export default ResponderDashboard;
