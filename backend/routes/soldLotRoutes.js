const express = require('express');
const router = express.Router();
const soldLotController = require('../controllers/soldLotController');

// Add/update sold price
router.post('/', soldLotController.addOrUpdateSoldPrice);

// Get sold lots by broker
router.get('/broker/:brokerId', soldLotController.getSoldLotsByBroker);

// Delete sold price
router.delete('/:saleId', soldLotController.deleteSoldPrice);

// to view all the sold records - for employee view
router.get('/all', soldLotController.getAllSoldLotsForEmployee);

module.exports = router;