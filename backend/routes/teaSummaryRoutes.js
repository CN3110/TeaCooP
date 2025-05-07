const express = require('express');
const router = express.Router();
const teaSummaryController = require('../controllers/teaSummaryController');

// Get complete tea production summary
router.get('/summary', teaSummaryController.getTeaProductionSummary);

// Get raw tea total
router.get('/raw-tea-total', teaSummaryController.getRawTeaTotal);

// Get made tea total
router.get('/made-tea-total', teaSummaryController.getMadeTeaTotal);

// Get total tea packets
router.get('/total-packets', teaSummaryController.getTotalTeaPackets);

// Get tea production by type
router.get('/production-by-type', teaSummaryController.getTeaProductionByType);

// Get current tea type stock
router.get('/current-stock', teaSummaryController.getCurrentTeaTypeStock);

// Get total lot weights
router.get('/total-lot-weights', teaSummaryController.getTotalLotWeights);

// Get total tea type stock
router.get('/total-tea-type-stock', teaSummaryController.getTotalTeaTypeStock);

module.exports = router;
