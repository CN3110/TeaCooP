const db = require("../config/database");

class DeliveryRoutes {
    static addDeliveryRoutes(delivery_routeName, callback) {
        if (!delivery_routeName) {
            return callback(new Error("Please Add Delivery Route Name."), null);
        }

        const query = `
          INSERT INTO delivery_route (delivery_routeName)
          VALUES (?)
        `;

        db.query(query, [delivery_routeName], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            return callback(null, {deliveryRouteId: result.insertId, deliveryRouteName });
        });
    }
}


module.exports = DeliveryRoutes; 