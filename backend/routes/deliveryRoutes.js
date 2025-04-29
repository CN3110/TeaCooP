const express = require("express");
const {
  getAllDeliveryRecords,
  addDeliveryRecord,
  getDeliveryRecordById,
  updateDeliveryRecord,
  deleteDeliveryRecord,
  getRawTeaRecords,
  getTotalRawTeaWeight,
  getRawTeaDetailsByDeliveryId,
  getLatestDeliveryRawTeaDetails,

} = require("../controllers/deliveryController");

const router = express.Router();

// CRUD routes for delivery records
router.get("/", getAllDeliveryRecords); // Get all delivery records
router.post("/", addDeliveryRecord); // Add a new delivery record
router.get("/:deliveryId", getDeliveryRecordById); // Get a single delivery record by ID
router.put("/:deliveryId", updateDeliveryRecord); // Update a delivery record
router.delete("/:deliveryId", deleteDeliveryRecord); // Delete a delivery record

// Raw tea related routes
router.get("/raw-tea/records", getRawTeaRecords); // Get raw tea records with optional date filtering
router.get("/raw-tea/total", getTotalRawTeaWeight); // Get total raw tea weight
router.get("/raw-tea/latest", getLatestDeliveryRawTeaDetails); // Get latest delivery raw tea details
//router.get("/raw-tea/daily", getDailyRawTeaAggregates); // Get daily aggregated raw tea data
router.get("/raw-tea/:deliveryId", getRawTeaDetailsByDeliveryId); // Get raw tea details by delivery ID

module.exports = router;