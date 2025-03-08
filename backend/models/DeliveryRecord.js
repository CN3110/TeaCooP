const db = require("../config/database");

class Delivery{
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
}
 
module.exports = Delivery;