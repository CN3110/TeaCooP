const db = require("../config/database");

// Add land details for a supplier
exports.addLandDetails = async (req, res) => {
  const { supplierId, landDetails } = req.body;

  if (!supplierId || !Array.isArray(landDetails) || landDetails.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    // Insert land details into the land table
    for (const land of landDetails) {
      await db.query(
        "INSERT INTO land (supplierId, landSize, landAddress) VALUES (?, ?, ?)",
        [supplierId, land.landSize, land.landAddress]
      );
    }

    res.status(201).json({ message: "Land details added successfully" });
  } catch (error) {
    console.error("Error adding land details:", error);
    res.status(500).json({ error: "Failed to add land details" });
  }
};

// Fetch land details for a supplier
exports.getLandDetailsBySupplierId = async (req, res) => {
  const { supplierId } = req.params;

  if (!supplierId) {
    return res.status(400).json({ error: "Supplier ID is required" });
  }

  try {
    const [landDetails] = await db.query(
      "SELECT * FROM land WHERE supplierId = ?",
      [supplierId]
    );

    res.status(200).json(landDetails);
  } catch (error) {
    console.error("Error fetching land details:", error);
    res.status(500).json({ error: "Failed to fetch land details" });
  }
};

// Update land details
exports.updateLandDetails = async (req, res) => {
  const { landId } = req.params;
  const { landSize, landAddress } = req.body;

  if (!landId || !landSize || !landAddress) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    await db.query(
      "UPDATE land SET landSize = ?, landAddress = ? WHERE landId = ?",
      [landSize, landAddress, landId]
    );

    res.status(200).json({ message: "Land details updated successfully" });
  } catch (error) {
    console.error("Error updating land details:", error);
    res.status(500).json({ error: "Failed to update land details" });
  }
};

// Delete land details
exports.deleteLandDetails = async (req, res) => {
  const { landId } = req.params;

  if (!landId) {
    return res.status(400).json({ error: "Land ID is required" });
  }

  try {
    await db.query("DELETE FROM land WHERE landId = ?", [landId]);

    res.status(200).json({ message: "Land details deleted successfully" });
  } catch (error) {
    console.error("Error deleting land details:", error);
    res.status(500).json({ error: "Failed to delete land details" });
  }
};