const db = require("../config/database");

class Delivery {
  // Method to add a delivery record
  static addDeliveryRecord(supplierId, transport, date, route, totalWeight, totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, greenTeaLeaves, randalu, callback) {
    if (!supplierId || !transport || !date || !route || !totalWeight || !totalSackWeight || !forWater || !forWitheredLeaves || !forRipeLeaves || !greenTeaLeaves || !randalu) {
      return callback(new Error("Missing required fields"), null);  
    }

    const query = `
      INSERT INTO delivery (supplierId, transport, date, route, totalWeight, totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, greenTeaLeaves, randalu)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [supplierId, transport, date, route, totalWeight, totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, greenTeaLeaves, randalu], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      return callback(null, { delivery: result });
    });
  }

  // Method to fetch raw tea records, optionally filtered by date
  static getRawTeaRecords(startDate, endDate, callback) {
    let sql = `SELECT deliveryId, date, (greenTeaLeaves + randalu) AS rawTeaWeight FROM delivery`;
    const params = [];

    if (startDate && endDate) {
      sql += ` WHERE date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    sql += ` ORDER BY date DESC`;

    db.query(sql, params, (err, results) => {
      if (err) {
        return callback(err, null);
      }

      return callback(null, results);
    });
  }

  // Method to fetch total raw tea weight (sum of all raw tea weights)
  static getTotalRawTeaWeight(callback) {
    const sql = `
      SELECT SUM(greenTeaLeaves + randalu) AS totalRawTeaWeight FROM delivery
    `;

    db.query(sql, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      return callback(null, result);
    });
  }
}

module.exports = Delivery;
