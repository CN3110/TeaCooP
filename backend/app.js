const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const middleware = require("./config/middleware");

const app = express();

middleware(app);

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', //frontend URL
  credentials: true,
}));

app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/lands", require("./routes/landRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/brokers", require("./routes/brokerRoutes"));


app.get("/", (req, res) => {
  res.json("Hello from backend");
});

module.exports = app; // Export the app for use in server.js