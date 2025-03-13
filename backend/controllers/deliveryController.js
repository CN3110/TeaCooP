const db = require("../config/database");

// Fetch all delivery records
exports.getAllDeliveryRecords = async (req, res) => {
  try {
    const [deliveryRecords] = await db.query("SELECT * FROM delivery");
    res.status(200).json(deliveryRecords);
  } catch (error) {
    console.error("Error fetching delivery records:", error);
    res.status(500).json({ error: "Failed to fetch delivery records" });
  }
};

// Add a new delivery record
exports.addDeliveryRecord = async (req, res) => {
  const {
    supplierId,
    transport,
    date,
    route,
    totalWeight,
    totalSackWeight,
    forWater,
    forWitheredLeaves,
    forRipeLeaves,
    greenTeaLeaves,
    randalu,
  } = req.body;

  // Validate required fields
  if (
    !supplierId ||
    !transport ||
    !date ||
    !route ||
    !totalWeight ||
    !totalSackWeight ||
    !forWater ||
    !forWitheredLeaves ||
    !forRipeLeaves ||
    !greenTeaLeaves ||
    !randalu
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert delivery record into the delivery table
    const [deliveryResult] = await db.query(
      "INSERT INTO delivery (supplierId, transport, date, route, totalWeight, totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, greenTeaLeaves, randalu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        supplierId,
        transport,
        date,
        route,
        totalWeight,
        totalSackWeight,
        forWater,
        forWitheredLeaves,
        forRipeLeaves,
        greenTeaLeaves,
        randalu,
      ]
    );
    res.status(201).json({ message: "Delivery record added successfully" });
  } catch (error) {
    console.error("Error adding delivery record:", error);
    res.status(500).json({ error: "Failed to add delivery record" });
  }
};

// Fetch a single delivery record by ID
exports.getDeliveryRecordById = async (req, res) => {
  const { deliveryId } = req.params;

  try {
    const [delivery] = await db.query("SELECT * FROM delivery WHERE deliveryId = ?", [deliveryId]);

    if (delivery.length === 0) {
      return res.status(404).json({ error: "Delivery record not found" });
    }

    res.status(200).json(delivery[0]);
  } catch (error) {
    console.error("Error fetching delivery record:", error);
    res.status(500).json({ error: "Failed to fetch delivery record" });
  }
};

// Update a delivery record by ID
exports.updateDeliveryRecord = async (req, res) => {
  const { deliveryId } = req.params;
  const {
    supplierId,
    transport,
    date,
    route,
    totalWeight,
    totalSackWeight,
    forWater,
    forWitheredLeaves,
    forRipeLeaves,
    greenTeaLeaves,
    randalu,
  } = req.body;

  if (
    !supplierId ||
    !transport ||
    !date ||
    !route ||
    !totalWeight ||
    !totalSackWeight ||
    !forWater ||
    !forWitheredLeaves ||
    !forRipeLeaves ||
    !greenTeaLeaves ||
    !randalu
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await db.query(
      "UPDATE delivery SET supplierId = ?, transport = ?, date = ?, route = ?, totalWeight = ?, totalSackWeight = ?, forWater = ?, forWitheredLeaves = ?, forRipeLeaves = ?, greenTeaLeaves = ?, randalu = ? WHERE deliveryId = ?",
      [
        supplierId,
        transport,
        date,
        route,
        totalWeight,
        totalSackWeight,
        forWater,
        forWitheredLeaves,
        forRipeLeaves,
        greenTeaLeaves,
        randalu,
        deliveryId,
      ]
    );
    res.status(200).json({ message: "Delivery record updated successfully" });
  } catch (error) {
    console.error("Error updating delivery record:", error);
    res.status(500).json({ error: "Failed to update delivery record" });
  }
};

// Delete a delivery record by ID
exports.deleteDeliveryRecord = async (req, res) => {
  const { deliveryId } = req.params;

  try {
    await db.query("DELETE FROM delivery WHERE deliveryId = ?", [deliveryId]);
    res.status(200).json({ message: "Delivery record deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery record:", error);
    res.status(500).json({ error: "Failed to delete delivery record" });
  }
};