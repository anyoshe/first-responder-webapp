// routes/incidentRoutes.js
const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

router.post('/incidents', incidentController.createIncident);
router.get('/incidents', incidentController.getIncidents);
router.patch('/incidents/:id/status', incidentController.updateIncidentStatus);

module.exports = router;
