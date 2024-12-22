const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
exports.signup = async (req, res) => {
    const { email, password, name } = req.body;
    console.log(req.body);
    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({ email, password, name });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(token);
      res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
      console.error('Error during signup:', error);  // Log the actual error
      res.status(500).json({ message: 'Error signing up', error: error.message });  // Return more specific error
    }
  };
  


// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);  // Log the request body for debugging purposes
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send token and userId in the response
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      userId: user._id  // Add userId to the response
    });
    console.log('User ID:', user._id);  // Add this for debugging

  } catch (error) {
    console.error('Error during login:', error);  // Log the actual error
    res.status(500).json({ message: 'Error logging in', error: error.message });  // Return more specific error
  }
};
