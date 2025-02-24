const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const middleware = require("./config/middleware");

const app = express();

// Middleware
middleware(app);

// Database connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Routes
app.use("/api/suppliers", require("./routes/supplierRoutes"));

// Default route
app.get("/", (req, res) => {
  res.json("Hello from backend");
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});