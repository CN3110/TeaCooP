//after editing users' email by the emolyee - it should be send the passcode to the new email
const db = require("../config/database");
const nodemailer = require("nodemailer");

// Generate a random 6-digit passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", //email service
  auth: {
    user: "mkteacoop@gmail.com", 
    pass: "sinr fmza uvxa soww", 
  },
});

// Fetch all brokers
exports.getAllBrokers = async (req, res) => {
  try {
    const [brokers] = await db.query("SELECT * FROM broker");
    res.status(200).json(brokers);
  } catch (error) {
    console.error("Error fetching brokers:", error);
    res.status(500).json({ error: "Failed to fetch brokers" });
  }
};

// Add a broker
exports.addBroker = async (req, res) => {
  const { brokerId, brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress } = req.body;

  // Validate required fields
  if (!brokerId || !brokerName || !brokerContact || !brokerEmail || !brokerCompanyName || !brokerCompanyContact || !brokerCompanyEmail || !brokerCompanyAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Generate a passcode
  const passcode = generatePasscode();

  try {
    // Insert broker into the broker table
    const [brokerResult] = await db.query(
      "INSERT INTO broker (brokerId, brokerName, brokerContactNumber, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress, passcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [brokerId, brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress, passcode]
    );

    // Send email with passcode
    const mailOptions = {
      from: "mkteacoop@gmail.com",
      to: brokerEmail,
      subject: "Morawakkorale Tea CooP - Your Login Credentials",
      text: `Dear ${brokerName}, 

            Your login credentials for the system are as follows:

            User ID: ${brokerId}
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
        res.status(201).json({ message: "Broker added successfully" });
      }
    });
  } catch (error) {
    console.error("Error adding broker:", error);
    res.status(500).json({ error: "Failed to add broker" });
  }
};

// Fetch a single broker by ID
exports.getBrokerById = async (req, res) => {
  const { brokerId } = req.params;

  try {
    const [broker] = await db.query("SELECT * FROM broker WHERE brokerId = ?", [brokerId]);

    if (broker.length === 0) {
      return res.status(404).json({ error: "Broker not found" });
    }

    res.status(200).json(broker[0]);
  } catch (error) {
    console.error("Error fetching broker:", error);
    res.status(500).json({ error: "Failed to fetch broker" });
  }
};

// Update a broker by ID
exports.updateBroker = async (req, res) => {
  const { brokerId } = req.params;
  const { brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress } = req.body;

  if (!brokerName || !brokerContact || !brokerEmail || !brokerCompanyName || !brokerCompanyContact || !brokerCompanyEmail || !brokerCompanyAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await db.query(
      "UPDATE broker SET brokerName = ?, brokerContactNumber = ?, brokerEmail = ?, brokerCompanyName = ?, brokerCompanyContact = ?, brokerCompanyEmail = ?, brokerCompanyAddress = ? WHERE brokerId = ?",
      [brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress, brokerId]
    );
    res.status(200).json({ message: "Broker updated successfully" });
  } catch (error) {
    console.error("Error updating broker:", error);
    res.status(500).json({ error: "Failed to update broker" });
  }
};

// Delete a broker by ID
exports.deleteBroker = async (req, res) => {
  const { brokerId } = req.params;

  try {
    await db.query("DELETE FROM broker WHERE brokerId = ?", [brokerId]);
    res.status(200).json({ message: "Broker deleted successfully" });
  } catch (error) {
    console.error("Error deleting broker:", error);
    res.status(500).json({ error: "Failed to delete broker" });
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