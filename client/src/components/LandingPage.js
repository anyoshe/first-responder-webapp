import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <h1 className="title">First Responder Network</h1>
        <p className="subtitle">Connecting trained responders with emergency situations in real-time</p>
      </header>

      <section className="options">
        <div className="option-card">
          <h2 className="option-title">Dispatcher</h2>
          <p className="option-description">You are the emergency coordinator. Manage responders and emergency situations.</p>
          <Link to="/login/dispatcher" className="btn btn-primary">Login as Dispatcher</Link>
        </div>

        <div className="option-card">
          <h2 className="option-title">Responder</h2>
          <p className="option-description">You are the first line of defense. Respond to emergencies and help save lives.</p>
          <Link to="/login/responder" className="btn btn-secondary">Login as Responder</Link>
        </div>
      </section>

      <footer className="footer">
        <p>© 2024 First Responder Network. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
