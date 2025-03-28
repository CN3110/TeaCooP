const db = require("../config/database");

const getUserById = (userId, callback) => {
    let table;
    if (userId.startsWith("S")) table = "supplier";
    else if (userId.startsWith("D")) table = "driver";
    else if (userId.startsWith("B")) table = "broker";
    else return callback("Invalid User ID", null);

    const query = `SELECT * FROM ${table} WHERE ${table}Id = ?`;
    db.query(query, [userId], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

const updateUserPassword = (userId, hashedPassword, callback) => {
    let table;
    if (userId.startsWith("S")) table = "supplier";
    else if (userId.startsWith("D")) table = "driver";
    else if (userId.startsWith("B")) table = "broker";
    else return callback("Invalid User ID", null);

    const query = `UPDATE ${table} SET passcode = NULL, password = ? WHERE ${table}Id = ?`;
    db.query(query, [hashedPassword, userId], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results);
    });
};

module.exports = { getUserById, updateUserPassword };