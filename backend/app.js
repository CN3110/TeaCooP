const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const middleware = require("./config/middleware");

const app = express();

middleware(app);

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true,
}));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/lands", require("./routes/landRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/brokers", require("./routes/brokerRoutes"));
app.use("/api/teaTypes", require("./routes/teaTypesRoutes"));
app.use("/api/lots", require("./routes/lotRoutes"));
app.use("/api/transportRequests", require("./routes/requestTransportRoutes"));

app.get("/", (req, res) => {
  res.json("backend connected");
});

module.exports = app; // Export the app for use in server.js