const express = require("express");

const {
  addLot,
  getAllLots,
  getLotByLotNumber,
  updateLot,
  deleteLot,
  updateBrokerValuation
} = require("../controllers/lotController");

const router = express.Router();

// CRUD routes
router.get("/", getAllLots);
router.post("/", addLot);
router.put("/:lotNumber", updateLot);
router.delete("/:lotNumber", deleteLot);
router.get("/:lotNumber", getLotByLotNumber);

router.patch('/:lotNumber/valuation', updateBrokerValuation);

module.exports = router;