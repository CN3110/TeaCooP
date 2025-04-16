const express = require("express");
const { getAllDrivers, addDriver, updateDriver, getDriverById, getActiveDrivers} = require("../controllers/driverController");

const router = express.Router();

//crud
router.get("/", getAllDrivers);
router.post("/add", addDriver);
router.put("/:driverId", updateDriver);
router.get("/:driverId", getDriverById);
router.get("/active", getActiveDrivers); 
module.exports = router;
