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

exports.getRawTeaRecordsOfSupplier = async (fromDate, toDate, transport) => {
  const sql = `
    SELECT 
      d.supplierId,
      SUM(d.randalu) AS randalu,
      SUM(d.greenTeaLeaves) AS greenTeaLeaves,
      SUM(d.randalu + d.greenTeaLeaves) AS rawTea,
      SUM(CASE WHEN d.transport = 'selfTransport' THEN (d.randalu + d.greenTeaLeaves) ELSE 0 END) AS selfTransportedRawTea,
      SUM(CASE WHEN d.transport != 'selfTransport' THEN (d.randalu + d.greenTeaLeaves) ELSE 0 END) AS usedTransportationRawTea,
      CASE 
        WHEN SUM(d.transport = 'selfTransport') > 0 THEN 'Yes'
        ELSE 'No'
      END AS transport
    FROM 
      delivery d
    JOIN 
      supplier s ON d.supplierId = s.supplierId
    WHERE 
      (d.date >= ? OR ? IS NULL)
      AND (d.date <= ? OR ? IS NULL)
      AND (? = 'All' OR 
           (? = 'Yes' AND d.transport = 'selfTransport') OR 
           (? = 'No' AND d.transport != 'selfTransport'))
    GROUP BY 
      d.supplierId
    ORDER BY 
      d.supplierId ASC
  `;

  const params = [fromDate, fromDate, toDate, toDate, transport, transport, transport];
  const [results] = await db.query(sql, params);
  return results;
};
