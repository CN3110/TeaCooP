const db = require('../config/database');

//get all the raw tea records
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

//get supplier wise raw delivery reocrds
exports.getRawTeaRecordsOfSupplier = async () => {
  const sql = `
    SELECT 
      d.supplierId,
      SUM(d.randalu) AS total_randalu,
      SUM(d.greenTeaLeaves) AS total_green_tea_leaves,
      (SUM(d.randalu) + SUM(d.greenTeaLeaves)) AS total_raw_tea_weight,
      CASE 
        WHEN SUM(CASE WHEN d.transport = 'selfTransport' THEN 1 ELSE 0 END) > 0 THEN 'Yes'
        ELSE 'No'
      END AS self_transport_used
    FROM 
      delivery d
    GROUP BY 
      d.supplierId
    ORDER BY 
      d.supplierId ASC
  `;
  const [results] = await db.query(sql);
  return results;
};
  
