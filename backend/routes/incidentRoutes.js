// routes/incidentRoutes.js
const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const { assignResponder, assignAllResponders } = require('../controllers/incidentController');

router.post('/incidents', incidentController.createIncident);
router.get('/incidents', incidentController.getIncidents);

router.patch('/incidents/:id/status', incidentController.updateIncidentStatus);
// Route to assign a single responder to an incident
router.patch('/incidents/assign', assignResponder);

// Route to assign all responders to an incident
router.patch('/incidents/assign-all', assignAllResponders);


module.exports = router;
