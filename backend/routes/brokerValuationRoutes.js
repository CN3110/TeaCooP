const express = require('express');
const router = express.Router();
const brokerValuationController = require('../controllers/brokerValuationController');

// Get valuations by lot number
router.get('/lot/:lotNumber', brokerValuationController.getValuationsByLot);

// Get valuations by broker ID
router.get('/broker/:brokerId', brokerValuationController.getValuationsByBroker);

// Update valuation price
router.put('/:valuationId', brokerValuationController.updateValuation);

// Delete valuation
router.delete('/:valuationId', brokerValuationController.deleteValuation);

// Existing routes
router.get('/', brokerValuationController.getAllGroupedByLot);
router.post('/:valuationId/confirm', brokerValuationController.confirmValuation);

module.exports = router;