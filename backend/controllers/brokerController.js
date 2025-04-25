const db = require("../config/database");
const broker = require("../models/broker");
const nodemailer = require("nodemailer");

// Generate a random 6-digit passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Add a new broker
exports.addBroker = async (req, res) => {
  let {
    brokerName,
    brokerContact,
    brokerEmail,
    brokerCompanyName,
    brokerCompanyContact,
    brokerCompanyEmail,
    brokerCompanyAddress,
    status = "pending",
    notes = null,
    addedByEmployeeId,
  } = req.body;

  if (
    status === "active" &&
    (!brokerName ||
      !brokerContact ||
      !brokerEmail ||
      !brokerCompanyName ||
      !brokerCompanyContact ||
      !brokerCompanyEmail ||
      !brokerCompanyAddress ||
      !addedByEmployeeId)
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const brokerId = await broker.generateBrokerId();
    const passcode = generatePasscode();

    await broker.createBroker({
      brokerId,
      brokerName,
      brokerContact,
      brokerEmail,
      brokerCompanyName,
      brokerCompanyContact,
      brokerCompanyEmail,
      brokerCompanyAddress,
      status,
      notes,
      addedByEmployeeId,
    });

    if (status === "active") {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: brokerEmail,
        subject: "Morawakkorale Tea Co-op - Your Login Credentials",
        text: `Dear ${brokerName},

Your login credentials for the system are as follows:

User ID: ${brokerId}
Passcode: ${passcode}

Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
      };

      await transporter.sendMail(mailOptions);
    }

    // Return brokerId in the response so the frontend can display it
    res.status(201).json({ 
      message: "Broker added successfully", 
      brokerId: brokerId, 
      brokerName: brokerName 
    });
  } catch (error) {
    console.error("Error adding broker:", error);
    res.status(500).json({ error: "Failed to add broker" });
  }
};

// Fetch all brokers
exports.getAllBrokers = async (req, res) => {
  try {
    const [brokers] = await db.query(`
      SELECT b.*, e.employeeName 
      FROM broker b
      JOIN employee e ON b.addedByEmployeeId = e.employeeId
      `);
    res.status(200).json(brokers);
  } catch (error) {
    console.error("Error fetching brokers:", error);
    res.status(500).json({ error: "Failed to fetch brokers" });
  }
};

// Fetch a single broker by ID
exports.getBrokerById = async (req, res) => {
  const { brokerId } = req.params;

  try {
    const result = await broker.getBrokerById(brokerId);
    if (!result) {
      return res.status(404).json({ error: "Broker not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching broker:", error);
    res.status(500).json({ error: "Failed to fetch broker" });
  }
};

// Update a broker by ID
exports.updateBroker = async (req, res) => {
  const { brokerId } = req.params;
  const {
    brokerName,
    brokerContact,
    brokerEmail,
    brokerCompanyName,
    brokerCompanyContact,
    brokerCompanyEmail,
    brokerCompanyAddress,
    status,
    notes,
  } = req.body;

  if (
    !brokerName ||
    !brokerContact ||
    !brokerEmail ||
    !brokerCompanyName ||
    !brokerCompanyContact ||
    !brokerCompanyEmail ||
    !brokerCompanyAddress ||
    !status
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query("SELECT * FROM broker WHERE brokerId = ?", [brokerId]);

    if (!result.length) {
      return res.status(404).json({ error: "Broker not found" });
    }

    const currentBroker = result[0];
    const oldEmail = currentBroker.brokerEmail;

    // Use the broker model function instead of direct db query
    await broker.updateBroker(brokerId, {
      brokerName,
      brokerContact,
      brokerEmail,
      brokerCompanyName,
      brokerCompanyContact,
      brokerCompanyEmail,
      brokerCompanyAddress,
      status,
      notes,
    });

    // Send passcode if email was changed
    if (oldEmail !== brokerEmail) {
      const passcode = generatePasscode();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: brokerEmail,
        subject: "Morawakkorale Tea Co-op - Updated Login Credentials",
        text: `Dear ${brokerName},

Your login credentials for the system have been updated:

User ID: ${brokerId}
Passcode: ${passcode}

Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: "Broker updated successfully" });
  } catch (error) {
    console.error("Error updating broker:", error);
    res.status(500).json({ error: "Failed to update broker" });
  }
};

exports.disableBroker = async (req, res) => {
  const { brokerId } = req.params;

  try {
    // Check if broker exists
    const [broker] = await db.query("SELECT * FROM broker WHERE brokerId = ?", [brokerId]);
    if (!broker.length) {
      return res.status(404).json({ error: "Broker not found" });
    }

    // Update status to disabled
    await db.query(
      "UPDATE broker SET status = 'disabled' WHERE brokerId = ?",
      [brokerId]
    );

    res.status(200).json({ message: "Broker disabled successfully" });
  } catch (error) {
    console.error("Error disabling broker:", error);
    res.status(500).json({ error: "Failed to disable broker" });
  }
};

// Get confirmed lots for a broker
exports.getBrokerConfirmedLots = async (req, res) => {
  const { brokerId } = req.params;
  
  try {
    const [lots] = await db.query(`
      SELECT 
        l.lotNumber, l.teaGrade, l.noOfBags, l.totalNetWeight,
        cl.valuationPrice, cl.confirmedAt,
        sl.saleId, sl.soldPrice, sl.paymentStatus, sl.paymentDate
      FROM confirmed_lot cl
      JOIN lot l ON cl.lotNumber = l.lotNumber
      LEFT JOIN sold_lot sl ON cl.lotNumber = sl.lotNumber AND cl.brokerId = sl.brokerId
      WHERE cl.brokerId = ?
      ORDER BY cl.confirmedAt DESC
    `, [brokerId]);
    
    res.status(200).json(lots);
  } catch (error) {
    console.error("Error fetching broker confirmed lots:", error);
    res.status(500).json({ error: "Failed to fetch confirmed lots" });
  }
};