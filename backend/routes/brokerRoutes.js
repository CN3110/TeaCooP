const express = require("express");
const router = express.Router();
const { 
  getAllBrokers,
  addBroker,
  updateBroker,
  getBrokerById,
  getBrokerConfirmedLots,
} = require("../controllers/brokerController");

// CRUD routes
router.get("/", getAllBrokers);
router.post("/", addBroker);
router.get("/:brokerId", getBrokerById);
router.put("/:brokerId", updateBroker);


// Broker-specific routes
router.get("/:brokerId/confirmed-lots", getBrokerConfirmedLots);

module.exports = router;