const express = require('express');
const router = express.Router();
const deliveryReportController = require('../controllers/reportController');

router.get('/raw-tea', deliveryReportController.getRawTeaReport);

module.exports = router;
