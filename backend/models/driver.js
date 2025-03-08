const db = require("../config/database");
const Vehicle = require("./vehicle");

class Driver {
    static addDriver(driverId, name, contact, vehicleDetails, callback) {
        if (!driverId || !name || !contact) {
            return callback(new Error("Missing required fields"), null);
        }

        const query = `
          INSERT INTO driver (driverId, driverName, driverContactNumber)
          VALUES (?, ?, ?)
        `;

        db.query(query, [driverId, name, contact], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            if (Array.isArray(vehicleDetails) && vehicleDetails.length > 0) {
                Vehicle.addVehicleDetails(driverId, vehicleDetails, (vehicleErr, vehicleResult) => {
                    if (vehicleErr) {
                        console.error("Error adding vehicle details:", vehicleErr);
                        return callback(vehicleErr, null);
                    }
                    console.log("Vehicle details added successfully:", vehicleResult);
                    return callback(null, { driver: result, vehicle: vehicleResult });
                });
            } else {
                return callback(null, { driver: result });
            }
        });
    }
}

module.exports = Driver;