const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost", // Database host
  user: "root",      // Database username
  password: "CHAThuni12345*",      // Database password
  database: "tea_coop", // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Log the pool to verify it's created
console.log("Database pool created:", pool);

// Export the pool for use in other files
module.exports = pool.promise();