const express = require("express");
const {
  getAllBrokers,
  addBroker,
  updateBroker,
  deleteBroker,
  getBrokerById,
} = require("../controllers/brokerController");

const router = express.Router();

// CRUD routes for brokers
router.get("/", getAllBrokers); // Get all brokers
router.post("/", addBroker); // Add a new broker *****
router.put("/:brokerId", updateBroker); // Update a broker
router.delete("/:brokerId", deleteBroker); // Delete a broker
router.get("/:brokerId", getBrokerById); // Get a single broker by ID

module.exports = router;