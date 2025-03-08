const mysql = require("mysql2/promise"); // Use the promise-compatible version

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "CHAThuni12345*",
  database: "tea_coop",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then((connection) => {
    console.log("Connected to the database");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });

module.exports = db;