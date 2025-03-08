const express = require("express");
const {addVehicleDetails} = require("../controllers/vehicleController");

const router = express.Router();

router.post("/add", addVehicleDetails);

module.exports = router;