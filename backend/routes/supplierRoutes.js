const express = require("express");
const {
  getAllSuppliers,
  addSupplier,
  updateSupplier,
  getSupplierById,
  disableSupplier,
  updateSupplierProfile,
  updatePassword,
} = require("../controllers/supplierController");
const router = express.Router();

// CRUD routes for suppliers
router.get("/", getAllSuppliers); // Get all suppliers
router.post("/add", addSupplier); // Add a new supplier
router.put("/:supplierId", updateSupplier); // Update a supplier
router.put("/profile/:supplierId", updateSupplierProfile) //update supplier profile - by supplier
router.get("/:supplierId", getSupplierById); // Get a single supplier by ID
router.put("/:supplierId/disable", disableSupplier); // Disable a supplier

router.put("/:supplierId/password", updatePassword);

module.exports = router;