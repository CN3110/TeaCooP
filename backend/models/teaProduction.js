const db = require("../config/database");

class TeaProduction {
    static addTeaProduction(teaTypeId, productionDate, weightInKg, createdBy, callback) {
        if (!teaTypeId || !productionDate || !weightInKg || !createdBy) {
            return callback(new Error("Missing required fields"), null);
        }

        const query = `
          INSERT INTO tea_production (teaTypeId, productionDate, weightInKg, createdBy)
          VALUES (?, ?, ?, ?)
        `;

        db.query(query, [teaTypeId, productionDate, weightInKg, createdBy], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            // Get tea type to check if it's dust tea
            const teaTypeQuery = "SELECT teaTypeName FROM teatype WHERE teaTypeId = ?";
            
            db.query(teaTypeQuery, [teaTypeId], (teaTypeErr, teaTypeResult) => {
                if (teaTypeErr) {
                    return callback(teaTypeErr, null);
                }
                
                let packetCount = null;
                
                // Calculate packets for dust tea
                if (teaTypeResult.length > 0 && 
                    teaTypeResult[0].teaTypeName.toLowerCase() === 'dust tea') {
                    packetCount = Math.floor(weightInKg * 1000 / 400);
                }
                
                return callback(null, { 
                    production: result,
                    packetCount: packetCount
                });
            });
        });
    }

    // Other methods would go here
}

module.exports = TeaProduction;