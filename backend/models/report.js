const db = require('../config/database');

// Get filtered delivery records + totals
exports.getRawTeaReport = (fromDate, toDate, route, callback) => {
  // Query 1: Get records
  const recordsSql = `
    SELECT 
      d.deliveryId, 
      d.date, 
      d.route, 
      d.randalu AS randaluWeight, 
      d.greenTeaLeaves AS greenLeavesWeight, 
      (d.randalu + d.greenTeaLeaves) AS rawTeaWeight
    FROM 
      delivery d
    WHERE 
      d.date BETWEEN ? AND ?
      AND d.route = ?
    ORDER BY d.date DESC
  `;

  // Query 2: Get totals
  const totalsSql = `
    SELECT 
      SUM(d.randalu) AS totalRandaluWeight,
      SUM(d.greenTeaLeaves) AS totalGreenLeavesWeight,
      SUM(d.randalu + d.greenTeaLeaves) AS totalRawTeaWeight
    FROM 
      delivery d
    WHERE 
      d.date BETWEEN ? AND ?
      AND d.route = ?
  `;

  // Run both queries
  db.query(recordsSql, [fromDate, toDate, route], (err, records) => {
    if (err) return callback(err);

    db.query(totalsSql, [fromDate, toDate, route], (err, totals) => {
      if (err) return callback(err);

      callback(null, { records, totals: totals[0] }); // return both
    });
  });
};
