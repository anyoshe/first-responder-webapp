// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/EmergencyDashboard.css';

// const EmergencyDashboard = () => {
//   return (
//     <div className="emergency-dashboard">
//       {/* Header */}
//       <header className="headerPart">
//         <div className="logo-title">
//           <span className="logo">🚨</span>
//           <h1>Emergency Dispatch System</h1>
//         </div>
//         <div className="header-tools">
//           <div className="live-clock">🕒 12:45 PM | Dec 22, 2024</div>
//           <div className="notification-icons">
//             <div className="icon">
//               <span className="material-icons">warning</span>
//               <span className="badge urgent">2</span>
//             </div>
//             <div className="icon">
//               <span className="material-icons">notifications</span>
//               <span className="badge">5</span>
//             </div>
//           </div>
//           <div className="profile-menu">👤 Dispatcher</div>
//         </div>
//       </header>

//       {/* Sidebar */}
//       <aside className="sidebar">
//         <ul>
//           <li>🏠 Dashboard Overview</li>
//           <li>🔥 Active Incidents</li>
//           <li>🚑 Responders</li>
//           <li>📡 Communication Hub</li>
//           <li>📊 Reports & Analytics</li>
//           <li>⚙️ Settings</li>
//         </ul>
//       </aside>

//       {/* Main Section */}
//       <main className="main-content">
//         {/* Incident Management Panel */}
//         <section className="incident-panel">
//           <h2>Incident Management</h2>
//           <div className="incident-list">
//             <div className="incident-card">
//               <p><strong>Incident #00123</strong> | Fire at 123 Main St.</p>
//               <p>Priority: High</p>
//               <div className="actions">
//                 <button className="btn assign">Assign</button>
//                 <button className="btn resolve">Resolve</button>
//                 <button className="btn escalate">Escalate</button>
//               </div>
//             </div>
//             {/* Add more incidents */}
//             <p>
//             <Link to="/incident-panel">
//               Go to Incident Panel
//             </Link>
//           </p>
//           </div>
//         </section>

//         {/* Responder Monitoring */}
//         <section className="responder-panel">
//           <h2>Responder Monitoring</h2>
//           <p>Live map integration here (e.g., Google Maps)</p>
//           <div className="responder-status">
//             <p>🚑 Responder 1: En Route</p>
//             <p>🚒 Responder 2: On Scene</p>
//             {/* Add more responders */}
//           </div>
//         </section>

//         {/* Communication Hub */}
//         <section className="communication-panel">
//           <h2>Communication Hub</h2>
//           <div className="chat-window">
//             <p><strong>Responder 1:</strong> On my way!</p>
//             <input type="text" placeholder="Type a message..." />
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="footer">
//         <p>System Stable | Contact Admin | Help Center</p>
//       </footer>
//     </div>
//   );
// };

// export default EmergencyDashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EmergencyDashboard.css';

const EmergencyDashboard = () => {
  const [incidents, setIncidents] = useState([]);

  // Function to fetch incidents from the API
  const fetchIncidents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/incidents');
      const data = await response.json();
      setIncidents(data.incidents);
    } catch (error) {
      console.error('Failed to fetch incidents', error);
    }
  };

  // Fetch incidents when the component mounts
  useEffect(() => {
    fetchIncidents();
  }, []);

  // Update the incident status
  const updateStatus = async (incidentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchIncidents(); // Re-fetch the incidents after updating
      } else {
        console.error('Failed to update incident status');
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="emergency-dashboard">
      {/* Header */}
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

      {/* Sidebar */}
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

      {/* Main Section */}
      <main className="main-content">
        {/* Incident Management Panel */}
        <section className="incident-panel">
          <h2>Incident Management</h2>
          <p>
            <Link to="/incident-panel">
               List your incident details
            </Link>
          </p>
          <div className="incident-list">
            {incidents.map((incident) => (
              <div key={incident._id} className="incident-card">
                <p><strong>ID:</strong> {incident.incidentId}</p>
                <p><strong>Location:</strong> {incident.location}</p>
                <p><strong>Type:</strong> {incident.type}</p>
                <p><strong>Priority:</strong> {incident.priority}</p>
                <p><strong>Status:</strong> {incident.status}</p>
                <div className="actions">
                <Link to="/responder-panel">
                <button onClick={() => updateStatus(incident._id, 'Assigned')}>Assign</button>
                 </Link>
                 
                  <button onClick={() => updateStatus(incident._id, 'Resolved')}>Resolve</button>
                  <button onClick={() => updateStatus(incident._id, 'Escalated')}>Escalate</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Responder Monitoring */}
        <section className="responder-panel">
          <h2>Responder Monitoring</h2>
          <p>Live map integration here (e.g., Google Maps)</p>
          <div className="responder-status">
            <p>🚑 Responder 1: En Route</p>
            <p>🚒 Responder 2: On Scene</p>
          </div>
        </section>

        {/* Communication Hub */}
        <section className="communication-panel">
          <h2>Communication Hub</h2>
          <div className="chat-window">
            <p><strong>Responder 1:</strong> On my way!</p>
            <input type="text" placeholder="Type a message..." />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>System Stable | Contact Admin | Help Center</p>
      </footer>
    </div>
  );
};

export default EmergencyDashboard;
