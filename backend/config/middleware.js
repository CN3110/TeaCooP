const cors = require("cors");
const bodyParser = require("body-parser");

module.exports = (app) => {
  // Add cors middleware
  app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Add your React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};