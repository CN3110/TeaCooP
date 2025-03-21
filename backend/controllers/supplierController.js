const db = require("../config/database");

// Fetch all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    // Fetch all suppliers
    const [suppliers] = await db.query("SELECT * FROM supplier");

    // Fetch land details for each supplier
    for (let supplier of suppliers) {
      const [landDetails] = await db.query(
        "SELECT * FROM land WHERE supplierId = ?",
        [supplier.supplierId]
      );
      supplier.landDetails = landDetails; // Add land details to the supplier object
    }

    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

// Add a new supplier
exports.addSupplier = async (req, res) => {
  const { supplierId, name, contact, email, landDetails } = req.body; // Add email

  if (!supplierId || !name || !contact || !email) { // Add email validation
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert supplier into the supplier table
    const [supplierResult] = await db.query(
      "INSERT INTO supplier (supplierId, supplierName, supplierContactNumber, supplierEmail) VALUES (?, ?, ?, ?)", // Add supplierEmail
      [supplierId, name, contact, email] // Add email
    );

    // Insert land details into the land table
    if (Array.isArray(landDetails) && landDetails.length > 0) {
      for (const land of landDetails) {
        await db.query(
          "INSERT INTO land (supplierId, landSize, landAddress) VALUES (?, ?, ?)",
          [supplierId, land.landSize, land.landAddress]
        );
      }
    }

    res.status(201).json({ message: "Supplier added successfully" });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({ error: "Failed to add supplier" });
  }
};

// Fetch a single supplier by ID
exports.getSupplierById = async (req, res) => {
  const { supplierId } = req.params;

  try {
    // Fetch the supplier
    const [supplier] = await db.query(
      "SELECT * FROM supplier WHERE supplierId = ?",
      [supplierId]
    );

    if (supplier.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Fetch land details for the supplier
    const [landDetails] = await db.query(
      "SELECT * FROM land WHERE supplierId = ?",
      [supplierId]
    );

    // Add land details to the supplier object
    supplier[0].landDetails = landDetails;

    res.status(200).json(supplier[0]);
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
};

// Update a supplier
exports.updateSupplier = async (req, res) => {
  const { supplierId } = req.params;
  const { name, contact, email, landDetails } = req.body; // Add email

  console.log("Request Body:", req.body); // Debugging log

  if (!supplierId) {
    return res.status(400).json({ error: "Supplier ID is required" });
  }

  if (!name || !contact || !email) { // Add email validation
    return res.status(400).json({ error: "Missing required fields: name, contact, and email" });
  }

  try {
    // Update supplier details
    await db.query(
      "UPDATE supplier SET supplierName = ?, supplierContactNumber = ?, supplierEmail = ? WHERE supplierId = ?", // Add supplierEmail
      [name, contact, email, supplierId] // Add email
    );

    // Update land details if provided
    if (Array.isArray(landDetails)) {
      // Delete existing land details
      await db.query("DELETE FROM land WHERE supplierId = ?", [supplierId]);

      // Insert new land details
      for (const land of landDetails) {
        await db.query(
          "INSERT INTO land (supplierId, landSize, landAddress) VALUES (?, ?, ?)",
          [supplierId, land.landSize, land.landAddress]
        );
      }
    }

    res.status(200).json({ message: "Supplier updated successfully" });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ error: "Failed to update supplier" });
  }
};

// Delete a supplier
exports.deleteSupplier = async (req, res) => {
  const { supplierId } = req.params;

  if (!supplierId) {
    return res.status(400).json({ error: "Supplier ID is required" });
  }

  try {
    // Delete land details first (due to foreign key constraint)
    await db.query("DELETE FROM land WHERE supplierId = ?", [supplierId]);

    // Delete supplier
    await db.query("DELETE FROM supplier WHERE supplierId = ?", [supplierId]);

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ error: "Failed to delete supplier" });
  }
};