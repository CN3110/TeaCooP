const db = require("../config/database");

//to fetch all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query("SELECT * FROM driver");

    //to fetch vehicle details for each driver
    for (let driver of drivers) {
      const [vehicleDetails] = await db.query(
        "SELECT * FROM vehicle WHERE driverId = ?",
        [driver.driverId]
      );
      driver.vehicleDetails = vehicleDetails;
    }

    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
};

//to add a new driver
exports.addDriver = async (req, res) => {
  const { driverId, driverName, driverContactNumber, vehicleDetails } = req.body;

  // Validate required fields
  if (!driverId || !driverName || !driverContactNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate vehicle details
  if (!Array.isArray(vehicleDetails) || vehicleDetails.length === 0) {
    return res.status(400).json({ error: "Invalid vehicle details" });
  }

  try {
    // Insert driver into the driver table
    const [driverResult] = await db.query(
      "INSERT INTO driver (driverId, driverName, driverContactNumber) VALUES (?, ?, ?)",
      [driverId, driverName, driverContactNumber]
    );

    // Insert vehicle details into the vehicle table
    for (const vehicle of vehicleDetails) {
      await db.query(
        "INSERT INTO vehicle (driverId, vehicleNumber, vehicleType) VALUES (?, ?, ?)",
        [driverId, vehicle.vehicleNo, vehicle.vehicleType]
      );
    }

    res.status(201).json({ message: "Driver added successfully" });
  } catch (error) {
    console.error("Error adding driver:", error);
    res.status(500).json({ error: "Failed to add driver" });
  }
};

//to fetch a single driver by ID
exports.getDriverById = async (req, res) => {
  const { driverId } = req.params;

  try {
    const [driver] = await db.query("SELECT * FROM driver WHERE driverId = ?", 
      [driverId]
    );

    if (driver.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const [vehicleDetails] = await db.query(
      "SELECT * FROM vehicle WHERE driverId = ?",
      [driverId]
    );
    driver[0].vehicleDetails = vehicleDetails;

    res.status(200).json(driver[0]);
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ error: "Failed to fetch driver" });
  }
};

//to update a driver
exports.updateDriver = async (req, res) => {
  const { driverId } = req.params;
  const { driverName, driverContactNumber, vehicleDetails } = req.body;

  if (!driverName || !driverContactNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    //to update driver details
    await db.query(
      "UPDATE driver SET driverName = ?, driverContactNumber = ? WHERE driverId = ?",
      [driverName, driverContactNumber, driverId]
    );

    //to update vehicle details
    if (Array.isArray(vehicleDetails) && vehicleDetails.length > 0) {
      await db.query("DELETE FROM vehicle WHERE driverId = ?", [driverId]);

      for (const vehicle of vehicleDetails) {
        await db.query(
          "INSERT INTO vehicle (driverId, vehicleNumber, vehicleType) VALUES (?, ?, ?)",
          [driverId, vehicle.vehicleNumber, vehicle.vehicleType]
        );
      }
    }

    res.status(200).json({ message: "Driver updated successfully" });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ error: "Failed to update driver" });
  }
};

//to delete a driver
exports.deleteDriver = async (req, res) => {
  const { driverId } = req.params;

  if (!driverId) {
    return res.status(400).json({ error: "Driver ID is required" });
  }
  try {
    await db.query("DELETE FROM driver WHERE driverId = ?", [driverId]);
    await db.query("DELETE FROM vehicle WHERE driverId = ?", [driverId]);

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ error: "Failed to delete driver" });
  }
};
