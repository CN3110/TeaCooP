const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database");
const cookieParser = require('cookie-parser');

// Initialize app
const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



app.use(express.json());
app.use(cookieParser());



// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use('/api/dashboard', require("./routes/dashboardRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/lands", require("./routes/landRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/brokers", require("./routes/brokerRoutes"));
app.use("/api/teaTypes", require("./routes/teaTypesRoutes"));
app.use("/api/transportRequests", require("./routes/requestTransportRoutes"));
app.use("/api/deliveryRoutes", require("./routes/deliveryRoutesRoutes"));
app.use('/api/employees', require("./routes/employeeRoutes"));
app.use('/api/lots', require("./routes/lotRoutes"));
app.use('/api/valuations', require("./routes/brokerValuationRoutes"));
app.use('/api/teaProductions', require("./routes/teaProductionRoutes"));
app.use('/api/notices', require("./routes/noticeRoutes"));
app.use('/api/teaTypeStocks', require("./routes/teaTypeStockRoutes"));

// Test route
app.get("/", (req, res) => {
  
  res.json("backend connected");
});

module.exports = app;