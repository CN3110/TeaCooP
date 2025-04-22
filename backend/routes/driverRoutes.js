const express = require("express");
const { getAllDrivers, addDriver, updateDriver, getDriverById, getActiveDrivers, disableDriver} = require("../controllers/driverController");

const router = express.Router();

//crud
router.get("/", getAllDrivers);
router.post("/add", addDriver);
router.put("/:driverId", updateDriver);
router.get("/:driverId", getDriverById);
router.get("/active", getActiveDrivers); 
router.put("/:driverId/disable", disableDriver);  // Disable driver

module.exports = router;
