const db = require("../config/database");
const driver = require("../models/driver"); 
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

  try {
    const driverId = await driver.generateDriverId();
    const passcode = generatePasscode();

    await driver.createDriver({
      driverId,
      driverName,
      driverContactNumber,
      driverEmail,
      status,
      notes,
    });

    await driver.addVehicles(driverId, vehicleDetails);

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

// Get all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await driver.getAllDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
  const { driverId } = req.params;

  try {
    const result = await driver.getDriverById(driverId);
    if (!result) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json(result);
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
    const existing = await driver.getDriverById(driverId);
    if (!existing) {
      return res.status(404).json({ error: "Driver not found" });
    }

    await driver.updateDriver({
      driverId,
      driverName,
      driverContactNumber,
      driverEmail,
      status,
      notes,
      vehicleDetails,
    });

    res.status(200).json({
      message: `Driver ${
        status === "disabled" ? "disabled" : "updated"
      } successfully`,
      status,
    });
  } catch (error) {
    console.error("Error updating Driver:", error);
    res.status(500).json({ error: error.message || "Failed to update Driver" });
  }
};

exports.getActiveDrivers = async (req, res) => {
  try {
    const drivers = await driver.getActiveDrivers();
    
    if (!drivers || drivers.length === 0) {
      // Return empty array instead of error when no drivers found
      return res.status(200).json([]);
    }
    
    // Format response consistently
    const response = drivers.map(d => ({
      driverId: d.driverId,
      driverName: d.driverName
    }));
    
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching active drivers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.disableDriver = async (req, res) => {
  const { driverId } = req.params;

  try {
    // Check if driver exists
    const [driver] = await db.query("SELECT * FROM driver WHERE driverId = ?", [driverId]);
    if (!driver.length) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Update status to disabled
    await db.query(
      "UPDATE driver SET status = 'disabled' WHERE driverId = ?",
      [driverId]
    );

    res.status(200).json({ message: "Driver disabled successfully" });
  } catch (error) {
    console.error("Error disabling driver", error);
    res.status(500).json({ error: "Failed to disable driver" });
  }
};
