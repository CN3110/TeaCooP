const express = require("express");
const cors = require("cors");
const db = require("./config/database"); // ✅ Just require the database (don't call db.connect() again)
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

app.get("/", (req, res) => {
  res.json("Hello from backend");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
