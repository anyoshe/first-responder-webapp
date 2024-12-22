const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/responderController');
const { checkProfileCompletion } = require('../controllers/responderController');


// Route to get responder profile
router.get('/:userId/profile', getProfile);

// Route to update responder profile
router.put('/:userId/profile', updateProfile);

// Route to check if a responder's profile is complete
router.get('/profile/:userId', checkProfileCompletion);

module.exports = router;
