const db = require("../config/database");
const Land = require("./land");

class Supplier {
  static addSupplier(supplierId, name, contact, email, passcode, landDetails, addedByEmployeeId,  callback) {
    const query = `
      INSERT INTO supplier (supplierId, supplierName, supplierContactNumber, supplierEmail, addedByEmployeeId, passcode)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [supplierId, name, contact, email, passcode, addedByEmployeeId ], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      if (Array.isArray(landDetails) && landDetails.length > 0) {
        Land.addLandDetails(supplierId, landDetails, (landErr, landResult) => {
          if (landErr) {
            console.error("Error adding land details:", landErr);
            return callback(landErr, null);
          }
          console.log("Land details added successfully:", landResult);
          return callback(null, { supplier: result, land: landResult });
        });
      } else {
        return callback(null, { supplier: result });
      }
    });
  }
}

module.exports = Supplier;