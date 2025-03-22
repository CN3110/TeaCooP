const express = require("express");
const { getAllDrivers, addDriver, updateDriver, deleteDriver, getDriverById } = require("../controllers/driverController");

const router = express.Router();

//crud
router.get("/", getAllDrivers);
router.post("/add", addDriver);
router.put("/:driverId", updateDriver);
router.delete("/:driverId", deleteDriver);
router.get("/:driverId", getDriverById);

module.exports = router;
