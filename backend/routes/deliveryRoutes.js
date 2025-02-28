const express = require("express");
const router = express.Router();
const db = require("../config/database");

// POST route to add a new delivery record
router.post("/", (req, res) => {
  console.log("Request Body:", req.body); // Log the request body for debugging

  const {
    supplierId,
    transport,
    date,
    route,
    totalWeight,
    totalSackWeight,
    forWater,
    forWitheredLeaves,
    forRipeLeaves,
    greenTeaLeaves,
    randalu
  } = req.body;

  // Validate required fields
  if (
    !supplierId ||
    !transport ||
    !date ||
    !route ||
    !totalWeight ||
    !totalSackWeight ||
    !forWater ||
    !forWitheredLeaves ||
    !forRipeLeaves ||
    !greenTeaLeaves ||
    !randalu
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // SQL query to insert a new delivery record
  const query = `
    INSERT INTO delivery (supplierId, transport, date, route, totalWeight, totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, greenTeaLeaves, randalu)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Execute the query
  db.query(
    query,
    [supplierId, transport, date, route, totalWeight, totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, greenTeaLeaves, randalu],
    (err, result) => {
      if (err) {
        console.error("Error inserting delivery record:", err);
        return res.status(500).json({ error: "Failed to add delivery record", details: err.message });
      }
      return res.status(201).json({ message: "Delivery record added successfully" });
    }
  );
});

// GET route to fetch all delivery records
router.get("/", (req, res) => {
  const query = "SELECT * FROM delivery"; // Fetch all records from the delivery table

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching delivery records:", err);
      return res.status(500).json({ error: "Failed to fetch delivery records", details: err.message });
    }

    // If successful, return the fetched records
    return res.status(200).json(results);
  });
});

module.exports = router;