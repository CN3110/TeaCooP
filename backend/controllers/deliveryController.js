const db = require("../config/database");

// Fetch all delivery records
exports.getAllDeliveryRecords = async (req, res) => {
  try {
    const [deliveryRecords] = await db.query("SELECT * FROM delivery");
    res.status(200).json(deliveryRecords);
  } catch (error) {
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
    totalWeight === undefined ||
    totalSackWeight === undefined ||
    forWater === undefined ||
    forWitheredLeaves === undefined ||
    forRipeLeaves === undefined ||
    greenTeaLeaves === undefined ||
    randalu === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Convert to numbers for validation
  const totalWeightNum = parseFloat(totalWeight);
  const totalSackWeightNum = parseFloat(totalSackWeight);
  const forWaterNum = parseFloat(forWater);
  const forWitheredLeavesNum = parseFloat(forWitheredLeaves);
  const forRipeLeavesNum = parseFloat(forRipeLeaves);
  const greenTeaLeavesNum = parseFloat(greenTeaLeaves);
  const randaluNum = parseFloat(randalu);

  // Validate weight values
  if (
    totalSackWeightNum < 0 ||
    totalWeightNum < 0 ||
    forWaterNum < 0 ||
    forWitheredLeavesNum < 0 ||
    forRipeLeavesNum < 0 ||
    greenTeaLeavesNum < 0 ||
    randaluNum < 0
  ) {
    return res.status(400).json({ error: "Weight values cannot be negative." });
  }

  if (totalWeightNum <= 0) {
    return res.status(400).json({ error: "Total weight must be greater than zero." });
  }

  if (totalWeightNum < totalSackWeightNum) {
    return res.status(400).json({ error: "Total weight cannot be less than total sack weight." });
  }

  const sumOfComponents = totalSackWeightNum + forWaterNum + forWitheredLeavesNum + 
                         forRipeLeavesNum + greenTeaLeavesNum + randaluNum;
  
  if (Math.abs(totalWeightNum - sumOfComponents) > 0.01) { // Allowing small floating point differences
    return res.status(400).json({ 
      error: `Total weight (${totalWeightNum}) must equal the sum of all components (${sumOfComponents}).` 
    });
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
        totalWeightNum,
        totalSackWeightNum,
        forWaterNum,
        forWitheredLeavesNum,
        forRipeLeavesNum,
        greenTeaLeavesNum,
        randaluNum,
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

  // Validate required fields
  if (
    !supplierId ||
    !transport ||
    !date ||
    !route ||
    totalWeight === undefined ||
    totalSackWeight === undefined ||
    forWater === undefined ||
    forWitheredLeaves === undefined ||
    forRipeLeaves === undefined ||
    greenTeaLeaves === undefined ||
    randalu === undefined
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Convert to numbers for validation
  const totalWeightNum = parseFloat(totalWeight);
  const totalSackWeightNum = parseFloat(totalSackWeight);
  const forWaterNum = parseFloat(forWater);
  const forWitheredLeavesNum = parseFloat(forWitheredLeaves);
  const forRipeLeavesNum = parseFloat(forRipeLeaves);
  const greenTeaLeavesNum = parseFloat(greenTeaLeaves);
  const randaluNum = parseFloat(randalu);

  // Validate weight values
  if (
    totalSackWeightNum < 0 ||
    totalWeightNum < 0 ||
    forWaterNum < 0 ||
    forWitheredLeavesNum < 0 ||
    forRipeLeavesNum < 0 ||
    greenTeaLeavesNum < 0 ||
    randaluNum < 0
  ) {
    return res.status(400).json({ error: "Weight values cannot be negative." });
  }

  if (totalWeightNum <= 0) {
    return res.status(400).json({ error: "Total weight must be greater than zero." });
  }

  if (totalWeightNum < totalSackWeightNum) {
    return res.status(400).json({ error: "Total weight cannot be less than total sack weight." });
  }

  const sumOfComponents = totalSackWeightNum + forWaterNum + forWitheredLeavesNum + 
                         forRipeLeavesNum + greenTeaLeavesNum + randaluNum;
  
  if (Math.abs(totalWeightNum - sumOfComponents) > 0.01) {
    return res.status(400).json({ 
      error: `Total weight (${totalWeightNum}) must equal the sum of all components (${sumOfComponents}).` 
    });
  }

  try {
    await db.query(
      "UPDATE delivery SET supplierId = ?, transport = ?, date = ?, route = ?, totalWeight = ?, totalSackWeight = ?, forWater = ?, forWitheredLeaves = ?, forRipeLeaves = ?, greenTeaLeaves = ?, randalu = ? WHERE deliveryId = ?",
      [
        supplierId,
        transport,
        date,
        route,
        totalWeightNum,
        totalSackWeightNum,
        forWaterNum,
        forWitheredLeavesNum,
        forRipeLeavesNum,
        greenTeaLeavesNum,
        randaluNum,
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
    const [result] = await db.query("DELETE FROM delivery WHERE deliveryId = ?", [deliveryId]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Delivery record not found" });
    }
    
    res.status(200).json({ message: "Delivery record deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery record:", error);
    res.status(500).json({ error: "Failed to delete delivery record" });
  }
};

// Controller to fetch raw tea records with optional date filtering
exports.getRawTeaRecords = (req, res) => {
  const { startDate, endDate } = req.query;

  Delivery.getRawTeaRecords(startDate, endDate, (err, results) => {
    if (err) {
      console.error('Error fetching raw tea records:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(results);
  });
};

// Controller to fetch total raw tea weight
exports.getTotalRawTeaWeight = (req, res) => {
  Delivery.getTotalRawTeaWeight((err, result) => {
    if (err) {
      console.error('Error fetching total raw tea weight:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(result);
  });
};