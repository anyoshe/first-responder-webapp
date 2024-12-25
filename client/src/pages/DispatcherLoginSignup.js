import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginSignUp.css';

const DispatcherLoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [company, setCompany] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup
        ? `${process.env.REACT_APP_API_URL}/api/auth/dispatcher/signup`
        : `${process.env.REACT_APP_API_URL}/api/auth/dispatcher/login`;

      const payload = isSignup
        ? { company, username, email, password }
        : { email, password };

      const { data } = await axios.post(url, payload);

      // On successful login or signup, store token and userId in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('dispatcherId', data.dispatcherId); // Store dispatcherId

      // Redirect to the dispatcher dashboard
      navigate('/dispatcher-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-signup-container">
      <h2>{isSignup ? 'Dispatcher Sign Up' : 'Dispatcher Login'}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>

      <p>
        {isSignup ? (
          <>
            Already have an account?{' '}
            <span onClick={() => setIsSignup(false)} className="toggle-btn">
              Log in
            </span>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <span onClick={() => setIsSignup(true)} className="toggle-btn">
              Sign up
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default DispatcherLoginSignup;
