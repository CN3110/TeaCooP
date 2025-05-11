const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');


router.get('/raw-tea', ReportController.getRawTeaReport); //get all the raw tea records
router.get('/supplier-records', ReportController.getRawTeaRecordsOfSupplier); //get supplier wise raw delivery reocrds

module.exports = router;
