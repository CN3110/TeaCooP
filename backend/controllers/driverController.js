const db = require("../config/database");
const nodemailer = require("nodemailer");

// Generate a random 6-digit passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the email service
  auth: {
    user: "mkteacoop@gmail.com", // Sender's email address
    pass: "sinr fmza uvxa soww", // Sender's email password
  },
});

// Fetch all drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query("SELECT * FROM driver");

    // Fetch vehicle details for each driver
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
  const { driverId, driverName, driverContactNumber, driverEmail, vehicleDetails } = req.body;

  // Validate required fields
  if (!driverId || !driverName || !driverContactNumber || !driverEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Validate vehicle details
  if (!Array.isArray(vehicleDetails) || vehicleDetails.length === 0) {
    return res.status(400).json({ error: "Invalid vehicle details" });
  }

  let connection;
  try {
    // Get a connection from the pool
    connection = await db.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Generate passcode
    const passcode = generatePasscode();

    // Insert driver into the driver table
    await connection.query(
      "INSERT INTO driver (driverId, driverName, driverContactNumber, driverEmail, passcode) VALUES (?, ?, ?, ?, ?)",
      [driverId, driverName, driverContactNumber, driverEmail, passcode]
    );

    // Insert vehicle details into the vehicle table
    for (const vehicle of vehicleDetails) {
      await connection.query(
        "INSERT INTO vehicle (driverId, vehicleNumber, vehicleType) VALUES (?, ?, ?)",
        [driverId, vehicle.vehicleNo, vehicle.vehicleType]
      );
    }

    // Commit the transaction
    await connection.commit();

    // Send email with passcode
    const mailOptions = {
      from: "mkteacoop@gmail.com",
      to: driverEmail,
      subject: "Morawakkorale Tea CooP - Your Login Credentials",
      text: `Dear ${driverName}, 

            Your login credentials for the system are as follows:

            User ID: ${driverId}
            Passcode: ${passcode}

            Please use the above passcode as your password during your first login. After logging in, you will be able to create your own password.

            If you have any questions, please contact us.

            Best regards,
            Morawakkorale Tea Co-op
            041-2271400`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        res.status(201).json({ message: "Driver added successfully" });
      }
    });
  } catch (error) {
    // Roll back the transaction in case of error
    if (connection) await connection.rollback();
    console.error("Error adding driver:", error);
    res.status(500).json({ error: "Failed to add driver" });
  } finally {
    // Release the connection
    if (connection) connection.release();
  }
};

// Fetch a single driver by ID
exports.getDriverById = async (req, res) => {
  const { driverId } = req.params;

  try {
    const [driver] = await db.query("SELECT * FROM driver WHERE driverId = ?", [driverId]);

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

// Update a driver
exports.updateDriver = async (req, res) => {
  const { driverId } = req.params;
  const { driverName, driverContactNumber, vehicleDetails } = req.body;

  if (!driverName || !driverContactNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Update driver details
    await db.query(
      "UPDATE driver SET driverName = ?, driverContactNumber = ? WHERE driverId = ?",
      [driverName, driverContactNumber, driverId]
    );

    // Update vehicle details
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

// Delete a driver
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