const jwt = require('jsonwebtoken');
const Dispatcher = require('../models/Dispatcher');

// Dispatcher Signup
exports.signup = async (req, res) => {
  const { company, username, email, password } = req.body;
  console.log(`[SIGNUP] Received signup request:`, req.body);

  try {
    const dispatcherExists = await Dispatcher.findOne({ email });
    if (dispatcherExists) {
      console.log(`[SIGNUP] Dispatcher with email ${email} already exists.`);
      return res.status(400).json({ message: 'Dispatcher already exists' });
    }

    console.log(`[SIGNUP] Creating new dispatcher: ${email}`);
    const dispatcher = await Dispatcher.create({ company, username, email, password });

    const token = jwt.sign(
      { id: dispatcher._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log(`[SIGNUP] Dispatcher created successfully: ID ${dispatcher._id}`);
    res.status(201).json({
      message: 'Dispatcher created successfully',
      token,
      dispatcherId: dispatcher._id,
    });
  } catch (error) {
    console.error(`[SIGNUP] Error signing up:`, error.message);
    res.status(500).json({ message: 'Error signing up' });
  }
};

// Dispatcher Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN] Received login request for email: ${email}`);

  try {
    const dispatcher = await Dispatcher.findOne({ email });
    if (!dispatcher) {
      console.log(`[LOGIN] No dispatcher found with email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(`[LOGIN] Found dispatcher: ${email}, verifying password.`);
    const isMatch = await dispatcher.matchPassword(password);
    if (!isMatch) {
      console.log(`[LOGIN] Invalid password for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: dispatcher._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    console.log(`[LOGIN] Login successful for email: ${email}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      dispatcherId: dispatcher._id,
    });
  } catch (error) {
    console.error(`[LOGIN] Error logging in:`, error.message);
    res.status(500).json({ message: 'Error logging in' });
  }
};
