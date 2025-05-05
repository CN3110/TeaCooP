const express = require("express");
const router = express.Router();
const teaTypeStockController = require("../controllers/teaTypeStockController");

router.get("/", teaTypeStockController.getAllTeaTypeStocks);
router.get("/:stockId", teaTypeStockController.getTeaTypeStockById);
router.post("/", teaTypeStockController.createTeaTypeStock);
router.put("/:stockId", teaTypeStockController.updateTeaTypeStock);
router.patch("/:stockId", teaTypeStockController.adjustTeaTypeStock);
router.delete("/:stockId", teaTypeStockController.deleteTeaTypeStock);
router.get("/totals", teaTypeStockController.getTeaTypeTotals);

module.exports = router;