const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database");
const middleware = require("./config/middleware");

const app = express();
dotenv.config();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Add all allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

//Routes
app.use('/api/auth', require("./routes/authRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/lands", require("./routes/landRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/brokers", require("./routes/brokerRoutes"));
app.use("/api/teaTypes", require("./routes/teaTypesRoutes"));
app.use("/api/lots", require("./routes/lotRoutes"));
app.use("/api/transportRequests", require("./routes/requestTransportRoutes"));
app.use("/api/deliveryRoutes" , require("./routes/deliveryRoutesRoutes"));
app.use('/api/employees', require("./routes/employeeRoutes"));

app.get("/", (req, res) => {
  res.json("backend connected");
});

module.exports = app; 