// routes/dispatcherAuthRoutes.js
const express = require('express');
const { signup, login } = require('../controllers/dispatcherAuthController');
const { validateDispatcherSignup, validateDispatcherLogin } = require('../middleware/dispatcherValidator');
const { protectDispatcher } = require('../middleware/dispatcherAuthMiddleware');
const router = express.Router();

router.post('/signup', validateDispatcherSignup, signup);
router.post('/login', validateDispatcherLogin, login);

// Example of a protected route
router.get('/protected', protectDispatcher, (req, res) => {
  res.json({ message: 'This is a protected route', dispatcher: req.dispatcher });
});

module.exports = router;
