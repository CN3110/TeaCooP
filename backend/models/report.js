const db = require('../config/database');

// Get all delivery records (unfiltered)
exports.getAllRawTeaRecords = async () => {
  const sql = `
    SELECT
      d.deliveryId,
      d.date,
      d.route,
      d.randalu AS randalu_weight,
      d.greenTeaLeaves AS green_tea_weight,
      (d.randalu + d.greenTeaLeaves) AS raw_tea_weight
    FROM
      delivery d
    ORDER BY d.date DESC
  `;
  const [results] = await db.query(sql);
  return results;
};

exports.getRawTeaRecordsOfSupplier = async () => {
  const sql = `
  `
}
