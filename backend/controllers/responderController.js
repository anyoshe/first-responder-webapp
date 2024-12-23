const Responder = require('../models/Responder');
const mongoose = require('mongoose');

// Get the profile of a responder by userId
const getProfile = async (req, res) => {
  try {
    const responder = await Responder.findOne({ userId: req.params.userId });

    if (!responder) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(responder);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the profile of a responder
const updateProfile = async (req, res) => {
  try {
    // Find and update the profile if it exists, or create a new one if it doesn't
    const updatedProfile = await Responder.findOneAndUpdate(
      { userId: req.params.userId }, // Match the profile by userId
      req.body, // The data to update or create
      { 
        new: true, // Return the updated document
        runValidators: true, // Run schema validation
        upsert: true // Create a new document if it doesn't exist
      }
    );

    res.status(200).json(updatedProfile); // Respond with the updated or created profile
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const checkProfileCompletion = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`[CHECK_PROFILE_COMPLETION] Received request for userId: ${userId}`);

    // Validate if userId is a valid ObjectId before querying
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    // Find the responder by userId
    const responder = await Responder.findOne({ userId });
     console.log(responder);
    if (!responder) {
      return res.status(404).json({ message: 'Responder not found' });
    }

    // Check if the profile has the required fields
    const isProfileComplete = 
      responder.location &&
      responder.specializationArea &&
      responder.contactNumbers.length > 0 &&  // Ensure there are contact numbers
      (responder.passportNumber || responder.idNumber);  // Check for passport number or id number

    // Return the result
    res.json({ isProfileComplete });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to fetch responders within a given radius
const getRespondersInRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius } = req.query;

    // Convert the radius to meters
    const radiusInMeters = radius * 1000;

    // Query responders in the radius
    const responders = await Responder.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [longitude, latitude], // [longitude, latitude]
            radiusInMeters / 6371 // Convert meters to radians
          ]
        }
      }
    });

    res.json({ responders });
  } catch (error) {
    console.error('Error fetching responders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


  
module.exports = { getProfile, updateProfile, checkProfileCompletion, getRespondersInRadius };

