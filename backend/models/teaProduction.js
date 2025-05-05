const db = require("../config/database");

class TeaProduction {
    static addTeaProduction(productionDate, weightInKg, createdBy, callback) {
        if (!productionDate || !weightInKg || !createdBy) {
            return callback(new Error("Missing required fields"), null);
        }

        const query = `
          INSERT INTO tea_production (productionDate, weightInKg, createdBy)
          VALUES (?, ?, ?)
        `;

        db.query(query, [productionDate, weightInKg, createdBy], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            return callback(null, { 
                production: result,
            });
        });
    }
    

}



module.exports = TeaProduction;