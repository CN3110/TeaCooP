const express = require("express");
const { addLandDetails, getLandDetailsBySupplierId } = require("../controllers/landController");

const router = express.Router();

router.post("/add", addLandDetails);
// Get land addresses by supplier ID
router.get("/by-supplier/:supplierId", getLandDetailsBySupplierId);

module.exports = router;