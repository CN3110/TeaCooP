const db = require("../config/database");

class Broker {
    static addBroker(brokerId, brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail,brokerComapnyAddress, callback) {
        if (!brokerId || !brokerName || !brokerContact) {
            return callback(new Error("Missing required fields"), null);
        }

        const query = `
          INSERT INTO broker (brokerId, brokerName, brokerContactNumber, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(query, [brokerId, brokerName, brokerContact, brokerEmail, brokerCompanyName, brokerCompanyContact, brokerCompanyEmail, brokerComapnyAddress], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            return callback(null, { broker: result });
        });
    }
}

module.exports = Broker;