const express = require("express");
const router = express.Router();
const db = require("../config/database");

//add a new supplier with routing
router.post("/add", (req, res) => {
  const { supplierId, name, contact, landDetails } = req.body;

  //check the all input fields are filled
  if (!supplierId || !name || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  //insert supplier into the database - supplier table
  const query = `
    INSERT INTO supplier (supplierId, supplierName, supplierContactNumber)
    VALUES (?, ?, ?)
  `;

  db.query(query, [supplierId, name, contact], (err, result) => {
    if (err) {
      console.error("Error inserting supplier:", err);
      return res.status(500).json({ error: "Failed to add supplier" });
    }

    //insert land details into another table (land_details) - not woking now, check the error
    if (Array.isArray(landDetails) && landDetails.length > 0) {
      const landQuery = `
        INSERT INTO land_details (supplierId, landNo, landSize, landAddress)
        VALUES ?
      `;

      const landValues = landDetails.map((land) => [
        supplierId, //add foreign key supplierId
        land.landNo,
        land.landSize,
        land.landAddress,
      ]);

      db.query(landQuery, [landValues], (err, result) => { //error handling 
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