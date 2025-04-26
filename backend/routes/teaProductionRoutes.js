const express = require("express");

const {
    getAllTeaProductions,
    addTeaProduction,
    getTeaProductionById,
    updateTeaProduction,
    deleteTeaProduction,
    getTeaProductionByDate,
} = require("../controllers/teaProductionController");

const router = express.Router();

// CRUD routes for tea production
router.get("/", getAllTeaProductions); // Get all tea production records
router.post("/", addTeaProduction); // Add a new tea production record
router.put("/:productionId", updateTeaProduction); // Update a tea production record
router.delete("/:productionId", deleteTeaProduction); // Delete a tea production record
router.get("/:productionId", getTeaProductionById); // Get a single tea production record by ID
router.get("/date/:date", getTeaProductionByDate); // Get production records by date

module.exports = router;