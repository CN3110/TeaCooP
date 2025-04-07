const express = require('express');
const router = express.Router();
const brokerValuationController = require('../controllers/brokerValuationController');

// New route: GET valuations by lot number
router.get('/lot/:lotNumber', brokerValuationController.getValuationsByLot);

// Existing routes
router.get('/', brokerValuationController.getAllGroupedByLot);
router.post('/:valuationId/confirm', brokerValuationController.confirmValuation);

module.exports = router;
