const db = require("../config/database");
const nodemailer = require("nodemailer");

// Generate a random 6-digit passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate the next supplier ID (S10001, S10002, ...)
const generateSupplierId = async () => {
  try {
    const query = "SELECT MAX(CAST(SUBSTRING(supplierId, 2) AS UNSIGNED)) AS lastId FROM supplier";
    const [results] = await db.query(query);
    const lastId = results[0].lastId || 10000;  // Default to 10000 if no records exist
    return `S${lastId + 1}`;
  } catch (err) {
    console.error("Error generating supplier ID:", err);
    throw new Error("Failed to generate Supplier ID");
  }
};

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

// Add supplier
exports.addSupplier = async (req, res) => {
  const { name, contact, email, landDetails, status, notes } = req.body;

  if (!name || !contact || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const supplierId = await generateSupplierId();
  const passcode = generatePasscode();

  try {
    // Insert supplier into the supplier table
    await db.query(
      "INSERT INTO supplier (supplierId, supplierName, supplierContactNumber, supplierEmail, status, notes) VALUES (?, ?, ?, ?, ?, ?)",
      [supplierId, name, contact, email, status, notes]
    );

    // Insert land details if provided
    if (Array.isArray(landDetails) && landDetails.length > 0) {
      for (const land of landDetails) {
        await db.query(
          "INSERT INTO land (supplierId, landSize, landAddress, delivery_routeName) VALUES (?, ?, ?, ?)",
          [supplierId, land.landSize, land.landAddress, land.delivery_routeName]
        );
      }
    }

    // Send email only if supplier status is "active"
    if (status === "active") {
      const mailOptions = {
        from: "mkteacoop@gmail.com",
        to: email,
        subject: "Morawakkorale Tea CooP - Your Login Credentials",
        text: `Dear ${name},

        Your login credentials for the system are as follows:
        User ID: ${supplierId}
        Passcode: ${passcode}

        Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

        If you have any questions, please contact us.

        Best regards,
        Morawakkorale Tea Co-op
        041-2271400`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Failed to send email" });
        }
        res.status(201).json({ message: "Supplier added successfully!" });
      });
    } else {
      res.status(201).json({ message: "Supplier added successfully!" });
    }
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
  const { name, contact, email, status, notes, landDetails } = req.body;

  if (!supplierId) {
    return res.status(400).json({ error: "Supplier ID is required" });
  }

  if (!name || !contact || !email || !status) {
    return res.status(400).json({ 
      error: "Missing required fields: name, contact, email, and status" 
    });
  }

  // Validate status value
  const validStatuses = ['pending', 'active', 'disabled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: "Invalid status value. Must be one of: pending, active, disabled" 
    });
  }

  try {
    // First, check if supplier exists
    const [existingSupplier] = await db.query(
      "SELECT * FROM supplier WHERE supplierId = ?",
      [supplierId]
    );

    if (!existingSupplier || existingSupplier.length === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Update supplier details including status
    await db.query(
      "UPDATE supplier SET supplierName = ?, supplierContactNumber = ?, supplierEmail = ?, status = ?, notes = ? WHERE supplierId = ?",
      [name, contact, email, status, notes || null, supplierId]
    );

    // Update land details if provided
    if (Array.isArray(landDetails)) {
      // Start transaction for land updates
      await db.query("START TRANSACTION");

      try {
        // Delete existing land details
        await db.query("DELETE FROM land WHERE supplierId = ?", [supplierId]);

        // Insert new land details
        for (const land of landDetails) {
          if (!land.landSize || !land.landAddress || !land.delivery_routeName) {
            throw new Error("All land details fields are required");
          }

          await db.query(
            "INSERT INTO land (supplierId, landSize, landAddress, delivery_routeName) VALUES (?, ?, ?, ?)",
            [supplierId, land.landSize, land.landAddress, land.delivery_routeName]
          );
        }

        await db.query("COMMIT");
      } catch (landError) {
        await db.query("ROLLBACK");
        throw landError;
      }
    }

    res.status(200).json({ 
      message: `Supplier ${status === 'disabled' ? 'disabled' : 'updated'} successfully`,
      status: status 
    });
  } catch (error) {
    console.error("Error updating supplier:", error);
    res.status(500).json({ 
      error: error.message || "Failed to update supplier" 
    });
  }
};

exports.disableSupplier = async (req, res) => {
  const { supplierId } = req.params;

  try {
    // Check if Supplier exists
    const [supplier] = await db.query("SELECT * FROM supplier WHERE supplierId = ?", [supplierId]);
    if (!supplier.length) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Update status to disabled
    await db.query(
      "UPDATE supplier SET status = 'disabled' WHERE supplierId = ?",
      [supplierId]
    );

    res.status(200).json({ message: "Supplier disabled successfully" });
  } catch (error) {
    console.error("Error disabling supplier:", error);
    res.status(500).json({ error: "Failed to disable supplier" });
  }
};