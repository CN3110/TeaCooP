const express = require("express");

const {
  addLot,
  getAllLots,
  getLotByLotNumber,
  updateLot,
  deleteLot,
} = require("../controllers/lotController");

const router = express.Router();

// CRUD routes
router.get("/", getAllLots);
router.post("/", addLot);
router.put("/:lotNumber", updateLot);
router.delete("/:lotNumber", deleteLot);
router.get("/:lotNumber", getLotByLotNumber);

module.exports = router;