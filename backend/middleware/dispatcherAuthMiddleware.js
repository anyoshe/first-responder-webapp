// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Dispatcher = require('../models/Dispatcher');

exports.protectDispatcher = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach dispatcher to request
    req.dispatcher = await Dispatcher.findById(decoded.id).select('-password');

    if (!req.dispatcher) {
      return res.status(401).json({ message: 'Not authorized, dispatcher not found' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
