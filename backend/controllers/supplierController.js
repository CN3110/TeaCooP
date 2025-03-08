const db = require("../config/database");

exports.getAllSuppliers = async (req, res) => {
  try {
    const [suppliers] = await db.query("SELECT * FROM supplier");
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

exports.addSupplier = async (req, res) => {
  const { supplierId, name, contact, landDetails } = req.body;

  if (!supplierId || !name || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert supplier into the supplier table
    const [supplierResult] = await db.query(
      "INSERT INTO supplier (supplierId, supplierName, supplierContactNumber) VALUES (?, ?, ?)",
      [supplierId, name, contact]
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