const db = require("../config/database");

class TeaType {
    static addTeaType(teaTypeName, teaTypeDescription, callback) {
        if (!teaTypeName || !teaTypeDescription) {
            return callback(new Error("Missing required fields"), null);
        }

        const query = `
          INSERT INTO tea_type (teaTypeName, teaTypeDescription)
          VALUES (?, ?)
        `;

        db.query(query, [teaTypeName, teaTypeDescription], (err, result) => {
            if (err) {
                return callback(err, null);
            }

            return callback(null, { teaType: result });
        });
    }
}


module.exports = TeaType; 