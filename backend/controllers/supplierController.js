const db = require("../config/database");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const supplier = require("../models/supplier");

// Generate a random 6-digit passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
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
    const lastId = results[0].lastId || 10000;
    return `S${lastId + 1}`;
  } catch (err) {
    console.error("Error generating supplier ID:", err);
    throw new Error("Failed to generate Supplier ID");
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    // Join supplier with employee to get employee name and ID
    const [suppliers] = await db.query(`
      SELECT s.*, e.employeeName
      FROM supplier s
      JOIN employee e ON s.addedByEmployeeId = e.employeeId
    `);

    // Fetch land details for each supplier
    for (let supplier of suppliers) {
      const [landDetails] = await db.query(
        "SELECT * FROM land WHERE supplierId = ?",
        [supplier.supplierId]
      );
      supplier.landDetails = landDetails;
    }

    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};


// Add supplier
exports.addSupplier = async (req, res) => {
  const { name, contact, email, landDetails, status, notes, addedByEmployeeId } = req.body;

  if (!name || !contact || !email || !addedByEmployeeId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Verify employee exists and is active
  try {
    const [employee] = await db.query(
      "SELECT * FROM employee WHERE employeeId = ? AND status = 'active'",
      [addedByEmployeeId]
    );
    if (!employee.length) {
      return res.status(400).json({ error: "Invalid employee ID or employee not active" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error verifying employee" });
  }

  const supplierId = await generateSupplierId();
  const passcode = generatePasscode();
  const hashedPasscode = await bcrypt.hash(passcode, 10);

  try {
    // Insert supplier
    await db.query(
      `INSERT INTO supplier 
       (supplierId, supplierName, supplierContactNumber, supplierEmail, status, notes, addedByEmployeeId, passcode) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [supplierId, name, contact, email, status, notes || null, addedByEmployeeId, hashedPasscode]
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
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Morawakkorale Tea Co-op - Your Login Credentials",
        text: `Dear ${name},
Your login credentials for the system have been created:
User ID: ${supplierId}
Passcode: ${passcode}

Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`
      };
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({
      success: true,
      supplierId,
      message: "Supplier added successfully!"
    });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add supplier"
    });
  }
};

// Fetch a single supplier by ID
exports.getSupplierById = async (req, res) => {
  const { supplierId } = req.params;
  try {
    const [supplier] = await db.query(
      "SELECT * FROM supplier WHERE supplierId = ?",
      [supplierId]
    );
    if (!supplier.length) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    const [landDetails] = await db.query(
      "SELECT * FROM land WHERE supplierId = ?",
      [supplierId]
    );
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
  const validStatuses = ['pending', 'active', 'disabled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status value. Must be one of: pending, active, disabled"
    });
  }

  try {
    // Check if supplier exists
    const [existingSupplier] = await db.query(
      "SELECT * FROM supplier WHERE supplierId = ?",
      [supplierId]
    );
    if (!existingSupplier.length) {
      return res.status(404).json({ error: "Supplier not found" });
    }
    const oldEmail = existingSupplier[0].supplierEmail;

    // Update supplier details
    await db.query(
      "UPDATE supplier SET supplierName = ?, supplierContactNumber = ?, supplierEmail = ?, status = ?, notes = ? WHERE supplierId = ?",
      [name, contact, email, status, notes || null, supplierId]
    );

    // Send passcode if email was changed
    if (oldEmail !== email) {
      const passcode = generatePasscode();
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Morawakkorale Tea Co-op - Updated Login Credentials",
        text: `Dear ${name},

Your login credentials for the system have been updated:

User ID: ${supplierId}
Passcode: ${passcode}

Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
      };
      await transporter.sendMail(mailOptions);
    }

    // Update land details if provided
    if (Array.isArray(landDetails)) {
      await db.query("START TRANSACTION");
      try {
        await db.query("DELETE FROM land WHERE supplierId = ?", [supplierId]);
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

// Disable a supplier
exports.disableSupplier = async (req, res) => {
  const { supplierId } = req.params;
  try {
    const [supplier] = await db.query("SELECT * FROM supplier WHERE supplierId = ?", [supplierId]);
    if (!supplier.length) {
      return res.status(404).json({ error: "Supplier not found" });
    }
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

exports.updatePassword = async (req, res) => {
  const { supplierId } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    // Check if supplier exists
    const supplierExists = await supplier.getSupplierById(supplierId);
    if (!supplierExists) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Update the password
    await supplier.updateSupplierPassword(supplierId, newPassword);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
};
