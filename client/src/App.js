// export default App;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginSignup from './pages/LoginSignUp';
import DispatcherLoginSignup from './pages/DispatcherLoginSignup';
import ResponderDashboard from './components/ResponderDashboard';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/responder" element={<LoginSignup />} />
        <Route path="/login/dispatcher" element={<DispatcherLoginSignup />} />
        <Route path="/responder-dashboard" element={<ResponderDashboard />} />
        <Route path="/responder-profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
