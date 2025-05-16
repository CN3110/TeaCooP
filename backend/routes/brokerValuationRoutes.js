const express = require('express');
const router = express.Router();
const brokerValuationController = require('../controllers/brokerValuationController');

// Get confirmed valuations by broker - to broker view (MUST come before the brokerId route)
router.get('/broker/:brokerId/confirmed', brokerValuationController.getConfirmedValuationsByBroker);

// Get valuations by broker ID
router.get('/broker/:brokerId', brokerValuationController.getValuationsByBroker);

// Get valuations by lot number
router.get('/lot/:lotNumber', brokerValuationController.getValuationsByLot);

// Update valuation price
router.put('/:valuationId', brokerValuationController.updateValuation);

// Delete valuation
router.delete('/:valuationId', brokerValuationController.deleteValuation);

// Existing routes
router.get('/', brokerValuationController.getAllGroupedByLot);
router.post('/:valuationId/confirm', brokerValuationController.confirmValuation);

// Get confirmed valuations - all confirmed valuations - to employee view
router.get('/confirmed', brokerValuationController.getConfirmedValuations);

module.exports = router;
