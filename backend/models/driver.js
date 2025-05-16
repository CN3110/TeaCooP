const db = require("../config/database");
const bcrypt = require("bcrypt");

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
const createDriver = async ({ driverId, driverName, driverContactNumber, driverEmail, status, notes, addedByEmployeeId, passcode }) => {
  const hashedPassword = await bcrypt.hash(passcode, 10);
  const query = `
    INSERT INTO driver 
    (driverId, driverName, driverContactNumber, driverEmail, status, notes, addedByEmployeeId, passcode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await db.query(query, [driverId, driverName, driverContactNumber, driverEmail, status, notes, addedByEmployeeId, hashedPassword]);
};

// Verify driver credentials (for login)
const verifyDriverCredentials = async (driverId, password) => {
  const [drivers] = await db.query(
    "SELECT * FROM driver WHERE driverId = ? AND status = 'active'",
    [driverId]
  );
  if (drivers.length === 0) return null;

  const driver = drivers[0];
  const isPasswordValid = await bcrypt.compare(password, driver.passcode);
  if (!isPasswordValid) return null;

  return driver;
};

// Update driver password
const updateDriverPassword = async (driverId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE driver SET passcode = ? WHERE driverId = ?", [hashedPassword, driverId]);
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

// Get driver and their vehicles by ID
const getDriverById = async (driverId) => {
  const [driverRows] = await db.query("SELECT * FROM driver WHERE driverId = ?", [driverId]);

  if (driverRows.length === 0) return null;

  const [vehicleDetails] = await db.query("SELECT * FROM vehicle WHERE driverId = ?", [driverId]);

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

// Get only active drivers (for dropdowns or assignments)
const getActiveDrivers = async () => {
  try {
    const [rows] = await db.query("SELECT driverId, driverName FROM driver WHERE status = 'active'");
    return rows;
  } catch (error) {
    console.error("Error in getActiveDrivers:", error);
    throw error;
  }
};

// Export all functions
module.exports = {
  generateDriverId,
  createDriver,
  verifyDriverCredentials,
  updateDriverPassword,
  addVehicles,
  getAllDrivers,
  getDriverById,
  updateDriver,
  getActiveDrivers,
};
