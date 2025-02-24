const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Add a new supplier
router.post("/add", (req, res) => {
  const { supplierId, name, contact, landDetails } = req.body;

  // Validate required fields
  if (!supplierId || !name || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Insert supplier into the database
  const query = `
    INSERT INTO supplier (supplierId, supplierName, supplierContactNumber)
    VALUES (?, ?, ?)
  `;

  db.query(query, [supplierId, name, contact], (err, result) => {
    if (err) {
      console.error("Error inserting supplier:", err);
      return res.status(500).json({ error: "Failed to add supplier" });
    }

    // Insert land details into another table (if provided)
    if (Array.isArray(landDetails) && landDetails.length > 0) {
      const landQuery = `
        INSERT INTO land_details (supplierId, landNo, landSize, landAddress)
        VALUES ?
      `;

      const landValues = landDetails.map((land) => [
        supplierId,
        land.landNo,
        land.landSize,
        land.landAddress,
      ]);

      db.query(landQuery, [landValues], (err, result) => {
        if (err) {
          console.error("Error inserting land details:", err);
          return res.status(500).json({ error: "Failed to add land details" });
        }

        res.status(201).json({ message: "Supplier and land details added successfully" });
      });
    } else {
      res.status(201).json({ message: "Supplier added successfully" });
    }
  });
});

module.exports = router;