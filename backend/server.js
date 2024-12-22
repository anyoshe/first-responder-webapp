require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const protect = require('./middleware/authMiddleware');
const dispatcherAuthRoutes = require('./routes/dispatcherAuthRoutes');
const responderRoutes = require('./routes/responderRoutes');
const bodyParser = require("body-parser");
const app = express();
const mongoString = process.env.DATABASE_URL;
const jwt = require("jsonwebtoken");


mongoose.connect(mongoString);
const database = mongoose.connection;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/dispatcher', dispatcherAuthRoutes); 
app.use('/api/responder', responderRoutes);
// Error Handler
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message });
}

app.use(errorHandler);

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

database.once("connected", () => {
  console.log("Database Connected");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
