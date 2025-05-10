const express = require('express');
const router = express.Router();
const deliveryReportController = require('../controllers/reportController');


router.get('/raw-delivery-report', deliveryReportController.getRawTeaReport);

module.exports = router;
