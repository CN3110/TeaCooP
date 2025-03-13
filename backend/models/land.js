const db = require("../config/database");

class Land {
  static addLandDetails(supplierId, landDetails, callback) {
    if (!Array.isArray(landDetails) || landDetails.length === 0) {
      return callback(new Error("Land details must be a non-empty array"), null);
    }

    const query = `
      INSERT INTO land (supplierId, landSize, landAddress)
      VALUES ?
    `;

    const values = landDetails.map((land) => [
      supplierId,
      land.landSize,
      land.landAddress,
    ]);

    db.query(query, [values], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  }
}

module.exports = Land;