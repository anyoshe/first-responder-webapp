import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginSignUp.css';

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup ? `${process.env.REACT_APP_API_URL}/api/auth/signup` : `${process.env.REACT_APP_API_URL}/api/auth/login`;
      
      // Only include name if it's a signup request
      const userData = isSignup ? { email, password, name } : { email, password };
      
      const { data } = await axios.post(url, userData);
  
      // On successful signup, redirect to login page
      if (isSignup) {
          // After signup, you might want to show a success message instead of redirecting
      setError('Signup successful! Please log in to continue.');
      setIsSignup(false); // Automatically switch to login page after signup
        // navigate('/login/responder');
      } else {
        // On successful login, store token and userId in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);  // Store userId
  
        // Fetch user profile to check if it's complete
        const userId = data.userId;
        console.log('User ID:', userId);
  
        try {
          const profileResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/responder/profile/${userId}`);
          console.log('Profile Response:', profileResponse.data);
  
          if (profileResponse.data && profileResponse.data.isProfileComplete) {
            // If profile is complete, navigate to the dashboard
            navigate('/responder-dashboard');
          } else {
            // If profile is not complete, navigate to the profile page
            navigate('/responder-profile');
          }
        } catch (profileErr) {
          // If profile doesn't exist (404), redirect to the profile page to fill it
          if (profileErr.response && profileErr.response.status === 404) {
            navigate('/responder-profile');
          } else {
            setError('Something went wrong while checking profile status');
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };
  
  
  return (
    <div className="login-signup-container">
      <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

export default LoginSignup;
