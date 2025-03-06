const DeliveryRecord = require("../models/DeliveryRecord");

// Add a new delivery record
exports.create = (req, res) => {
  const record = req.body;

  // Validate required fields
  if (
    !record.supplierId ||
    !record.transport ||
    !record.date ||
    !record.route ||
    !record.totalWeight ||
    !record.totalSackWeight ||
    !record.forWater ||
    !record.forWitheredLeaves ||
    !record.forRipeLeaves ||
    !record.greenTeaLeaves ||
    !record.randalu
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  DeliveryRecord.create(record, (err, id) => {
    if (err) {
      console.error("Error creating delivery record:", err);
      return res.status(500).json({ error: "Failed to create delivery record" });
    }
    return res.status(201).json({ message: "Delivery record created successfully", id });
  });
};

// Fetch all delivery records
exports.getAll = (req, res) => {
  DeliveryRecord.getAll((err, results) => {
    if (err) {
      console.error("Error fetching delivery records:", err);
      return res.status(500).json({ error: "Failed to fetch delivery records" });
    }
    return res.status(200).json(results);
  });
};

// Fetch a single delivery record by ID
exports.getById = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Delivery ID is required" });
  }

  DeliveryRecord.getById(id, (err, result) => {
    if (err) {
      console.error("Error fetching delivery record:", err);
      return res.status(500).json({ error: "Failed to fetch delivery record" });
    }
    if (!result) {
      return res.status(404).json({ error: "Delivery record not found" });
    }
    return res.status(200).json(result);
  });
};

// Update a delivery record by ID
exports.update = (req, res) => {
  const id = req.params.id;
  const record = req.body;

  if (!id) {
    return res.status(400).json({ error: "Delivery ID is required" });
  }

  DeliveryRecord.update(id, record, (err, affectedRows) => {
    if (err) {
      console.error("Error updating delivery record:", err);
      return res.status(500).json({ error: "Failed to update delivery record" });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Delivery record not found" });
    }
    return res.status(200).json({ message: "Delivery record updated successfully" });
  });
};

// Delete a delivery record by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Delivery ID is required" });
  }

  DeliveryRecord.delete(id, (err, affectedRows) => {
    if (err) {
      console.error("Error deleting delivery record:", err);
      return res.status(500).json({ error: "Failed to delete delivery record" });
    }
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Delivery record not found" });
    }
    return res.status(200).json({ message: "Delivery record deleted successfully" });
  });
};