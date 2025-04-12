const express = require("express");
const {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
  //getProfile  // Make sure this is imported from your controller
} = require("../controllers/supplierController");
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// CRUD routes for suppliers
router.get("/", getAllSuppliers); // Get all suppliers
router.post("/add", addSupplier); // Add a new supplier
router.put("/:supplierId", updateSupplier); // Update a supplier
router.get("/:supplierId", getSupplierById); // Get a single supplier by ID

// Get supplier profile - protected route
//router.get('/profile', authenticate, getProfile);

module.exports = router;