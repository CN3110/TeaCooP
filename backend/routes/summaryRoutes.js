const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');

// Summary routes
router.get('/api/deliveries/summary', summaryController.getRawTeaSummary);
router.get('/api/production/summary', summaryController.getProductionSummary);
router.get('/api/lots/summary', summaryController.getLotSummary);

module.exports = router;
