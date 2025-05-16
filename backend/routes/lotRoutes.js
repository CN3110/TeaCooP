const express = require('express');
const router = express.Router();
const lotController = require('../controllers/lotController');

// Basic CRUD routes
router.get('/', lotController.getAllLots);
router.get('/available', lotController.getAvailableLots);
router.get('/made-tea-available-for-teaType-creation', lotController.getAvailableMadeTeaForTeaTypeCreation);
router.get('/available-for-broker', lotController.getAvailableLotsForBroker);
router.get('/:lotNumber', lotController.getLotById);
router.post('/', lotController.createLot);
router.post('/:lotNumber/valuation', lotController.submitBrokerValuation);
router.put('/:lotNumber', lotController.updateLot);
router.delete('/:lotNumber', lotController.deleteLot);

module.exports = router;
