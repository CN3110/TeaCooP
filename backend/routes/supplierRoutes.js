const express = require("express");
const { getAllSuppliers } = require("../controllers/supplierController");

const router = express.Router();

// Define the route for fetching all suppliers
router.get("/", getAllSuppliers);

module.exports = router;