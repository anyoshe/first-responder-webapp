const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/responderController');
const { checkProfileCompletion } = require('../controllers/responderController');
const { getRespondersInRadius } = require('../controllers/responderController');
const { getResponderId } = require('../controllers/responderController');


// Route to get responder profile
router.get('/:userId/profile', getProfile);

// Route to update responder profile
router.put('/:userId/profile', updateProfile);

// Route to check if a responder's profile is complete
router.get('/profile/:userId', checkProfileCompletion);

// Route to get responders within a specific radius
router.get('/nearby', getRespondersInRadius);

// Route to fetch responderId by userId
router.get('/responderId/:userId', getResponderId);

module.exports = router;
