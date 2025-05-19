const db = require("../config/database");
const Land = require("./land");
const bcrypt = require('bcrypt');

class Supplier {
  // Add new supplier along with optional land details
  static async addSupplier(supplierId, name, contact, email, passcode, landDetails, addedByEmployeeId, callback) {
    try {
      // Hash passcode
      const hashedPasscode = await bcrypt.hash(passcode, 10);

      const query = `
        INSERT INTO supplier (supplierId, supplierName, supplierContactNumber, supplierEmail, addedByEmployeeId, passcode)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(query, [supplierId, name, contact, email, addedByEmployeeId, hashedPasscode], (err, result) => {
        if (err) {
          return callback(err, null);
        }

        if (Array.isArray(landDetails) && landDetails.length > 0) {
          Land.addLandDetails(supplierId, landDetails, (landErr, landResult) => {
            if (landErr) {
              console.error("Error adding land details:", landErr);
              return callback(landErr, null);
            }
            return callback(null, { supplier: result, land: landResult });
          });
        } else {
          return callback(null, { supplier: result });
        }
      });
    } catch (error) {
      return callback(error, null);
    }
  }

  // At the bottom, before module.exports
static async getAllSuppliers() {
  const [rows] = await db.query('SELECT * FROM supplier');
  return rows;
}


  // Verify supplier credentials (for login)
  static async verifySupplierCredentials(supplierId, password) {
    try {
      const [rows] = await db.query('SELECT * FROM supplier WHERE supplierId = ?', [supplierId]);
      if (rows.length === 0) return null;

      const supplier = rows[0];
      const match = await bcrypt.compare(password, supplier.passcode);
      if (!match) return null;

      return supplier;
    } catch (err) {
      console.error('Error verifying supplier credentials:', err);
      return null;
    }
  }

  // Update supplier password
  static async updateSupplierPassword(supplierId, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.query('UPDATE supplier SET passcode = ? WHERE supplierId = ?', [hashedPassword, supplierId]);
      return true;
    } catch (err) {
      console.error('Error updating supplier password:', err);
      throw err;
    }
  }
}

module.exports = Supplier;
