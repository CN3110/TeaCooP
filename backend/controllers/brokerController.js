const db = require("../config/database");

//to fetch all brokers
exports.getAllBrokers = async (req, res) => {
  try {
    const [brokers] = await db.query("SELECT * FROM broker");
    res.status(200).json(brokers);
  } catch (error) {
    console.error("Error fetching brokers:", error);
    res.status(500).json({ error: "Failed to fetch brokers" });
  }
}

//to add a broker
exports.addBroker = async (req, res) => {
  const { brokerId, brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress } = req.body;

  // Validate required fields
  if (!brokerId || !brokerName || !brokerContact || !brokerEmail || !brokerCompanyName || !brokerCompanyContact || !brokerCompanyEmail || !brokerCompanyAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert broker into the broker table
    const [brokerResult] = await db.query(
      "INSERT INTO broker (brokerId, brokerName, brokerContactNumber, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [brokerId, brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress]
    );
    res.status(201).json({ message: "Broker added successfully" });
  } catch (error) {
    console.error("Error adding broker:", error);
    res.status(500).json({ error: "Failed to add broker" });
  }
};

//to fetch a single broker by ID
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

//to update a broker by ID
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

//to delete a broker by ID
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

