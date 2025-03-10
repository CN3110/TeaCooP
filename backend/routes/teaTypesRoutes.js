const express = require("express");

const {
    getAllTeaTypes,
    addTeaType,
    getTeaTypeById,
    updateTeaType,
    deleteTeaType,  
} = require("../controllers/teaTypesController");

const router = express.Router();

// CRUD routes for tea types
router.get("/", getAllTeaTypes); // Get all tea types
router.post("/", addTeaType); // Add a new tea type
router.put("/:teaTypeId", updateTeaType); // Update a tea type
router.delete("/:teaTypeId", deleteTeaType); // Delete a tea type
router.get("/:teaTypeId", getTeaTypeById); // Get a single tea type by ID

module.exports = router;