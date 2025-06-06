const express = require("express");
const { getAllDrivers, addDriver, updateDriver, getDriverById, getActiveDrivers, disableDriver, updatePassword} = require("../controllers/driverController");

const router = express.Router();

//crud
router.get("/", getAllDrivers);
router.post("/add", addDriver);

router.get("/active", getActiveDrivers); 
router.put("/:driverId", updateDriver);
router.get("/:driverId", getDriverById);

router.put("/:driverId/disable", disableDriver);  // Disable driver

router.put("/:driverId/password", updatePassword);

module.exports = router;
