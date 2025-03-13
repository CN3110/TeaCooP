const express = require("express");
const { addLandDetails } = require("../controllers/landController");

const router = express.Router();

router.post("/add", addLandDetails);

module.exports = router;