const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');


router.get('/raw-tea', ReportController.getRawTeaReport); //get all the raw tea records
router.get('/supplier-records', ReportController.getRawTeaRecordsOfSupplier); //get supplier wise raw delivery reocrds
router.get('/driver-report', ReportController.getDriverReport); //get all the raw tea records of a driver by the selected date range
router.get('/made-tea-production', ReportController.getTeaProductionReport); //// Add Tea Production Report route
router.get('/all-daily-tea-deliveries', ReportController.getAllDailyTeaDeliverySummaries); //get all the daily tea delivery summaries
router.get("/lot-summary", ReportController.getLotSummaryReport);
router.get("/sold-lots", ReportController.getSoldLotsReport);


module.exports = router;
