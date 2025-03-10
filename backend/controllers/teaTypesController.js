const db = require("../config/database");

// Fetch all tea types
exports.getAllTeaTypes = async (req, res) => {
  try {
    const [teaTypes] = await db.query("SELECT * FROM teatype");
    res.status(200).json(teaTypes);
  } catch (error) {
    console.error("Error fetching tea types:", error);
    res.status(500).json({ error: "Failed to fetch tea types" });
  }
};

// Add a new tea type
exports.addTeaType = async (req, res) => {
  const { teaTypeName, teaTypeDescription } = req.body;

  // Validate required fields
  if (!teaTypeName || !teaTypeDescription) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert tea type into the tea_type table (teaTypeId is auto-incremented)
    const [teaTypeResult] = await db.query(
      "INSERT INTO teatype (teaTypeName, teaTypeDescription) VALUES (?, ?)",
      [teaTypeName, teaTypeDescription]
    );

    res.status(201).json({ message: "Tea type added successfully" });
  } catch (error) {
    console.error("Error adding tea type:", error);
    res.status(500).json({ error: "Failed to add tea type" });
  }
};

// Fetch a single tea type by ID
exports.getTeaTypeById = async (req, res) => {
  const { teaTypeId } = req.params;

  try {
    const [teaType] = await db.query("SELECT * FROM teatype WHERE teaTypeId = ?", [teaTypeId]);

    if (teaType.length === 0) {
      return res.status(404).json({ error: "Tea type not found" });
    }

    res.status(200).json(teaType[0]);
  } catch (error) {
    console.error("Error fetching tea type:", error);
    res.status(500).json({ error: "Failed to fetch tea type" });
  }
};

// Update a tea type by ID
exports.updateTeaType = async (req, res) => {
  const { teaTypeId } = req.params;
  const { teaTypeName, teaTypeDescription } = req.body;

  // Validate required fields
  if (!teaTypeName || !teaTypeDescription) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Update the tea type in the tea_type table
    const [teaTypeResult] = await db.query(
      "UPDATE teatype SET teaTypeName = ?, teaTypeDescription = ? WHERE teaTypeId = ?",
      [teaTypeName, teaTypeDescription, teaTypeId]
    );

    if (teaTypeResult.affectedRows === 0) {
      return res.status(404).json({ error: "Tea type not found" });
    }

    res.status(200).json({ message: "Tea type updated successfully" });
  } catch (error) {
    console.error("Error updating tea type:", error);
    res.status(500).json({ error: "Failed to update tea type" });
  }
};

// Delete a tea type by ID
exports.deleteTeaType = async (req, res) => {
  const { teaTypeId } = req.params;

  try {
    // Delete the tea type from the tea_type table
    const [teaTypeResult] = await db.query("DELETE FROM teatype WHERE teaTypeId = ?", [teaTypeId]);

    if (teaTypeResult.affectedRows === 0) {
      return res.status(404).json({ error: "Tea type not found" });
    }

    res.status(200).json({ message: "Tea type deleted successfully" });
  } catch (error) {
    console.error("Error deleting tea type:", error);
    res.status(500).json({ error: "Failed to delete tea type" });
  }
};