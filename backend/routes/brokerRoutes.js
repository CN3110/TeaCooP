const express = require("express");
const router = express.Router();
const brokerController = require("../controllers/brokerController");




// CRUD routes
router.get("/", brokerController.getAllBrokers);
router.post("/", brokerController.addBroker);
router.get("/:brokerId", brokerController.getBrokerById);
router.put("/:brokerId", brokerController.updateBroker);
router.delete("/:brokerId", brokerController.deleteBroker);

// Broker-specific routes
router.get("/:brokerId/confirmed-lots", brokerController.getBrokerConfirmedLots);

module.exports = router;