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

  // New method to fetch raw tea details for a specific delivery
  static getRawTeaDetailsByDeliveryId(deliveryId, callback) {
    const sql = `
      SELECT 
        deliveryId, 
        date, 
        DATE_FORMAT(date, '%Y-%m-%d') as deliveryDate,
        TIME(date) as deliveryTime,
        (greenTeaLeaves + randalu) AS rawTeaWeight,
        greenTeaLeaves,
        randalu
      FROM delivery
      WHERE deliveryId = ?
    `;

    db.query(sql, [deliveryId], (err, result) => {
      if (err) {
        return callback(err, null);
      }

      return callback(null, result[0] || null);
    });
  }

  // New method to get delivery details immediately after insertion
  static getLatestDeliveryRawTeaDetails(callback) {
    const sql = `
      SELECT 
        deliveryId, 
        date, 
        DATE_FORMAT(date, '%Y-%m-%d') as deliveryDate,
        TIME(date) as deliveryTime,
        (greenTeaLeaves + randalu) AS rawTeaWeight,
        greenTeaLeaves,
        randalu
      FROM delivery
      ORDER BY deliveryId DESC
      LIMIT 1
    `;

    db.query(sql, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      return callback(null, result[0] || null);
    });
  }
}

module.exports = Delivery;