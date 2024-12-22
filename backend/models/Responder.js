const mongoose = require('mongoose');

const responderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  specializationArea: String,
  age: Number,
  gender: String,
  experience: Number,
  location: String, // e.g., latitude,longitude
  profilePic: String, // URL of the uploaded profile image
  registeredBodies: String, // Can be a list if you want to expand this later
  passportNumber: { type: String, required: false },  // Added passport number
  idNumber: { type: String, required: false },        // Added ID number
  contactNumbers: { type: [String], required: true }, // Added contact numbers
}, { timestamps: true });

const Responder = mongoose.model('Responder', responderSchema);

module.exports = Responder;
