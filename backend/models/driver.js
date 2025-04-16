const db = require("../config/database");

// Generate a new unique driver ID
const generateDriverId = async () => {
  const query = `
    SELECT MAX(CAST(SUBSTRING(driverId, 2) AS UNSIGNED)) AS lastId 
    FROM driver
  `;
  const [results] = await db.query(query);
  const lastId = results[0].lastId || 100;
  return `D${lastId + 1}`;
};

// Create a new driver
const createDriver = async ({ driverId, driverName, driverContactNumber, driverEmail, status, notes }) => {
  const query = `
    INSERT INTO driver 
    (driverId, driverName, driverContactNumber, driverEmail, status, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.query(query, [driverId, driverName, driverContactNumber, driverEmail, status, notes]);
};

// Add multiple vehicles for a driver
const addVehicles = async (driverId, vehicleDetails = []) => {
  for (const vehicle of vehicleDetails) {
    if (!vehicle.vehicleNumber || !vehicle.vehicleType) continue;

    await db.query(
      `INSERT INTO vehicle (driverId, vehicleNumber, vehicleType)
       VALUES (?, ?, ?)`,
      [driverId, vehicle.vehicleNumber, vehicle.vehicleType]
    );
  }
};

// Get all drivers with their vehicles
const getAllDrivers = async () => {
  const [drivers] = await db.query("SELECT * FROM driver");

  for (const driver of drivers) {
    const [vehicleDetails] = await db.query(
      "SELECT * FROM vehicle WHERE driverId = ?",
      [driver.driverId]
    );
    driver.vehicleDetails = vehicleDetails;
  }

  return drivers;
};

// Get driver and their vehicles by driverId
const getDriverById = async (driverId) => {
  const [driverRows] = await db.query(
    "SELECT * FROM driver WHERE driverId = ?",
    [driverId]
  );

  if (driverRows.length === 0) return null;

  const [vehicleDetails] = await db.query(
    "SELECT * FROM vehicle WHERE driverId = ?",
    [driverId]
  );

  return {
    ...driverRows[0],
    vehicleDetails,
  };
};

// Update driver and their vehicles
const updateDriver = async ({ driverId, driverName, driverContactNumber, driverEmail, status, notes, vehicleDetails }) => {
  await db.query(
    `UPDATE driver 
     SET driverName = ?, driverContactNumber = ?, driverEmail = ?, status = ?, notes = ?
     WHERE driverId = ?`,
    [driverName, driverContactNumber, driverEmail, status, notes, driverId]
  );

  if (Array.isArray(vehicleDetails)) {
    await db.query("START TRANSACTION");

    try {
      await db.query("DELETE FROM vehicle WHERE driverId = ?", [driverId]);

      for (const vehicle of vehicleDetails) {
        if (!vehicle.vehicleNumber || !vehicle.vehicleType) {
          throw new Error("All vehicle fields are required");
        }

        await db.query(
          `INSERT INTO vehicle (driverId, vehicleNumber, vehicleType)
           VALUES (?, ?, ?)`,
          [driverId, vehicle.vehicleNumber, vehicle.vehicleType]
        );
      }

      await db.query("COMMIT");
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }
};

//get active drivers
const getActiveDrivers = async () => {
  try {
    const [rows] = await db.execute(
      "SELECT driverId, driverName FROM driver WHERE status = 'active'"
    );
    return rows; // Will be empty array if no results
  } catch (error) {
    console.error("Error in getActiveDrivers:", error);
    throw error; // Let controller handle the error
  }
};


// Export all model functions
module.exports = {
  generateDriverId,
  createDriver,
  addVehicles,
  getAllDrivers,
  getDriverById,
  updateDriver,
  getActiveDrivers,
};
