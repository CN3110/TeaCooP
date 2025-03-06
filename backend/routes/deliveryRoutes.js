const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

// POST route to add a new delivery record
router.post("/", deliveryController.create);

// GET route to fetch all delivery records
router.get("/", deliveryController.getAll);

// GET route to fetch a single delivery record by ID
router.get("/:id", deliveryController.getById);

// PUT route to update a delivery record by ID
router.put("/:id", deliveryController.update);

// DELETE route to delete a delivery record by ID
router.delete("/:id", deliveryController.delete);

module.exports = router;