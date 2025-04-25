const express = require("express");
const router = express.Router();
const { 
  getAllBrokers,
  addBroker,
  updateBroker,
  getBrokerById,
  disableBroker,
  getBrokerConfirmedLots,
} = require("../controllers/brokerController");

// CRUD routes
router.get("/", getAllBrokers);
router.post("/add", addBroker);
router.get("/:brokerId", getBrokerById);
router.put("/:brokerId", updateBroker);
router.put("/:brokerId/disable", disableBroker);

// Broker-specific routes
router.get("/:brokerId/confirmed-lots", getBrokerConfirmedLots);

module.exports = router;