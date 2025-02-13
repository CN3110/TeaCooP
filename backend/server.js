const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Database connection
const db = mysql.createConnection({
  host: "localhost", // Replace with your MySQL host
  user: "root",      // Replace with your MySQL username
  password: "",      // Replace with your MySQL password
  database: "tea_coop", // Replace with your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

// Fetch all suppliers
app.get("/suppliers", (req, res) => {
  const sql = "SELECT supplierId, supplierName, supplierContactNumber, createdAt FROM suppliers";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    // Format the data to match the desired output
    const formattedData = data.map((supplier) => ({
      supplierId: supplier.supplierId,
      supplierName: supplier.supplierName,
      supplierContactNumber: supplier.supplierContactNumber,
      createdAt: supplier.createdAt.toISOString(), // Format date as ISO string
    }));

    return res.json(formattedData);
  });
});

// Start the server
const PORT = 3001; // Use the correct port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});