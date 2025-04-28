const express = require("express");
const {
  getAllDeliveryRecords,
  addDeliveryRecord,
  getDeliveryRecordById,
  updateDeliveryRecord,
  deleteDeliveryRecord,
} = require("../controllers/deliveryController");

const router = express.Router();

// CRUD routes for delivery records
router.get("/", getAllDeliveryRecords); // Get all delivery records
router.post("/", addDeliveryRecord); // Add a new delivery record
router.get("/:deliveryId", getDeliveryRecordById); // Get a single delivery record by ID
router.put("/:deliveryId", updateDeliveryRecord); // Update a delivery record
router.delete("/:deliveryId", deleteDeliveryRecord); // Delete a delivery record

// Route to fetch raw tea records
router.get('/raw-tea-records', deliveryController.getRawTeaRecords);

// Route to fetch total raw tea weight
router.get('/total-raw-tea-weight', deliveryController.getTotalRawTeaWeight);

module.exports = router;