const db = require("../config/database");

class Vehicle {
  static addVehicleDetails(driverId, vehicleDetails, callback) {
    if (!Array.isArray(vehicleDetails) || vehicleDetails.length === 0) {
      return callback(new Error("Vehicle details must be a non-empty array"), null);
    }

    const query = `
      INSERT INTO vehicle (driverId, vehicleNumber, vehicleType)
      VALUES ?
    `;

    const values = vehicleDetails.map((vehicle) => [
      driverId,
      vehicle.vehicleNumber,
      vehicle.vehicleType,
    ]);

    db.query(query, [values], (err, result) => {
      if (err) return callback(err, null);
      return callback(null, result);
    });
  }
}

module.exports = Vehicle;