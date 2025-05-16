const db = require("../config/database");

class TeaProduction {
    static addTeaProduction(productionDate, weightInKg, createdBy, rawTeaUsed, callback) {
        if (!productionDate || !weightInKg || !createdBy || !rawTeaUsed) {
            return callback(new Error("Missing required fields"), null);
        }

        const query = `
          INSERT INTO tea_production (productionDate, weightInKg, createdBy, rawTeaUsed)
          VALUES (?, ?, ?, ?)
        `;

        db.query(query, [productionDate, weightInKg, createdBy, rawTeaUsed], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return callback(err, null);
            }

            return callback(null, { 
                production: result,
                message: "Production record added successfully"
            });
        });
    }

    static getAllProductions(callback) {
        const query = `
          SELECT p.*, e.employeeName 
          FROM tea_production p
          JOIN employee e ON p.createdBy = e.employeeId
          ORDER BY p.productionDate DESC
        `;
        db.query(query, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return callback(err, null);
            }
            return callback(null, results);
        });
    }
}

module.exports = TeaProduction;