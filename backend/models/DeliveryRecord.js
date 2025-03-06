const db = require("../config/database");

class DeliveryRecord {
  // Fetch all delivery records
  static getAll(callback) {
    const query = "SELECT * FROM delivery";
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, results);
    });
  }

  // Fetch a single delivery record by ID
  static getById(id, callback) {
    const query = "SELECT * FROM delivery WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length === 0) {
        return callback(null, null); // No record found
      }
      return callback(null, results[0]);
    });
  }

  // Add a new delivery record
  static create(record, callback) {
    const query = `
      INSERT INTO delivery (supplierId, transport, date, route, totalWeight, totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, greenTeaLeaves, randalu)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      record.supplierId,
      record.transport,
      record.date,
      record.route,
      record.totalWeight,
      record.totalSackWeight,
      record.forWater,
      record.forWitheredLeaves,
      record.forRipeLeaves,
      record.greenTeaLeaves,
      record.randalu,
    ];
    db.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result.insertId);
    });
  }

  // Update a delivery record by ID
  static update(id, record, callback) {
    const query = `
      UPDATE delivery
      SET supplierId = ?, transport = ?, date = ?, route = ?, totalWeight = ?, totalSackWeight = ?, forWater = ?, forWitheredLeaves = ?, forRipeLeaves = ?, greenTeaLeaves = ?, randalu = ?
      WHERE id = ?
    `;
    const values = [
      record.supplierId,
      record.transport,
      record.date,
      record.route,
      record.totalWeight,
      record.totalSackWeight,
      record.forWater,
      record.forWitheredLeaves,
      record.forRipeLeaves,
      record.greenTeaLeaves,
      record.randalu,
      id,
    ];
    db.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result.affectedRows);
    });
  }

  // Delete a delivery record by ID
  static delete(id, callback) {
    const query = "DELETE FROM delivery WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result.affectedRows);
    });
  }
}

module.exports = DeliveryRecord;