const express = require("express");
const { getAllDrivers, addDriver, updateDriver, deleteDriver, getDriverById } = require("../controllers/driverController");

const router = express.Router();

router.get("/", getAllDrivers);
router.post("/add", addDriver);  // ✅ Matches frontend
router.put("/:driverId", updateDriver);
router.delete("/:driverId", deleteDriver);
router.get("/:driverId", getDriverById);

module.exports = router;
