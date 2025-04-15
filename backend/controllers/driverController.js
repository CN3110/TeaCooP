const db = require("../config/database");
const nodemailer = require("nodemailer");

// Generate random passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate new Driver ID
const generateDriverId = async () => {
  try {
    const query = `
      SELECT MAX(CAST(SUBSTRING(driverId, 2) AS UNSIGNED)) AS lastId 
      FROM driver
    `;
    const [results] = await db.query(query);
    const lastId = results[0].lastId || 100;
    return `D${lastId + 1}`;
  } catch (err) {
    console.error("Error generating driver ID:", err);
    throw new Error("Failed to generate Driver ID");
  }
};

// Get all drivers with vehicles
exports.getAllDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query("SELECT * FROM driver");

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

// Add a new driver
exports.addDriver = async (req, res) => {
  const {
    driverName,
    driverContactNumber,
    driverEmail,
    vehicleDetails,
    status = "pending",
    notes = null,
  } = req.body;

  if (!driverName || !driverContactNumber || !driverEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const driverId = await generateDriverId();
  const passcode = generatePasscode();

  try {
    await db.query(
      `INSERT INTO driver 
       (driverId, driverName, driverContactNumber, driverEmail, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [driverId, driverName, driverContactNumber, driverEmail, status, notes]
    );

    if (Array.isArray(vehicleDetails)) {
      for (const vehicle of vehicleDetails) {
        if (!vehicle.vehicleNumber || !vehicle.vehicleType) continue;

        await db.query(
          "INSERT INTO vehicle (driverId, vehicleNumber, vehicleType) VALUES (?, ?, ?)",
          [driverId, vehicle.vehicleNumber, vehicle.vehicleType]
        );
      }
    }

    // Send email if driver is active
    if (status === "active") {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: driverEmail,
        subject: "Morawakkorale Tea CooP - Your Login Credentials",
        text: `Dear ${driverName},

Your login credentials for the system are as follows:
User ID: ${driverId}
Passcode: ${passcode}

Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: "Driver added successfully!" });
  } catch (error) {
    console.error("Error adding Driver:", error);
    res.status(500).json({ error: "Failed to add Driver" });
  }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
  const { driverId } = req.params;

  try {
    const [driver] = await db.query(
      "SELECT * FROM driver WHERE driverId = ?",
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

// Update driver
exports.updateDriver = async (req, res) => {
  const { driverId } = req.params;
  const {
    driverName,
    driverContactNumber,
    driverEmail,
    status,
    notes,
    vehicleDetails = [],
  } = req.body;

  if (!driverName || !driverContactNumber || !driverEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const validStatuses = ["pending", "active", "disabled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status value. Must be one of: pending, active, disabled",
    });
  }

  try {
    const [existingDriver] = await db.query(
      "SELECT * FROM driver WHERE driverId = ?",
      [driverId]
    );

    if (!existingDriver || existingDriver.length === 0) {
      return res.status(404).json({ error: "Driver not found" });
    }

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
            "INSERT INTO vehicle (driverId, vehicleNumber, vehicleType) VALUES (?, ?, ?)",
            [driverId, vehicle.vehicleNumber, vehicle.vehicleType]
          );
        }

        await db.query("COMMIT");
      } catch (vehicleError) {
        await db.query("ROLLBACK");
        throw vehicleError;
      }
    }

    res.status(200).json({
      message: `Driver ${
        status === "disabled" ? "disabled" : "updated"
      } successfully`,
      status,
    });
  } catch (error) {
    console.error("Error updating Driver:", error);
    res
      .status(500)
      .json({ error: error.message || "Failed to update Driver" });
  }
};
