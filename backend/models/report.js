// Updated Report model with properly implemented driver records function
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

exports.getAllDailyTeaDeliverySummaries = async () => {
  const sql = `
    SELECT 
      DATE(date) AS deliveryDate,
      SUM(totalWeight) AS totalWeight,
      SUM(totalSackWeight) AS totalSackWeight,
      SUM(forWater) AS forWater,
      SUM(forWitheredLeaves) AS forWitheredLeaves,
      SUM(forRipeLeaves) AS forRipeLeaves,
      SUM(greenTeaLeaves) AS greenTeaLeaves,
      SUM(randalu) AS randalu
    FROM delivery
    GROUP BY DATE(date)
    ORDER BY DATE(date) DESC
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

exports.getDriverReport = async (route, startDate, endDate) => {
  const conditions = ["transport != 'selfTransport'"];
  const values = [];

  if (route) {
    conditions.push("route = ?");
    values.push(route);
  }

  if (startDate && endDate) {
    conditions.push("DATE(date) BETWEEN ? AND ?");
    values.push(startDate, endDate);
  }

  const baseWhere = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

  // Full grouped report by driverId and route
  const fullQuery = `
    SELECT 
      transport AS driverId, 
      route,
      SUM(CAST(greenTeaLeaves AS DECIMAL(10,2))) + SUM(CAST(randalu AS DECIMAL(10,2))) AS rawTeaWeight
    FROM delivery
    ${baseWhere}
    GROUP BY transport, route
    ORDER BY rawTeaWeight DESC;
  `;

  // Summary table by driverId only
  const summaryQuery = `
    SELECT 
      transport AS driverId,
      SUM(CAST(greenTeaLeaves AS DECIMAL(10,2)) + CAST(randalu AS DECIMAL(10,2))) AS rawTeaWeight
    FROM delivery
    ${baseWhere}
    GROUP BY transport
    ORDER BY rawTeaWeight DESC;
  `;

  const [detailedReport] = await db.query(fullQuery, values);
  const [summaryReport] = await db.query(summaryQuery, values);

  return { detailedReport, summaryReport };
};

exports.getTeaProductionReport = async (startDate, endDate) => {
  let query = `
    SELECT 
      productionId, 
      DATE_FORMAT(productionDate, '%Y-%m-%d') AS productionDate, 
      weightInKg, 
      createdBy, 
      created_at, 
      rawTeaUsed
    FROM tea_production
  `;
  
  const params = [];
  const conditions = [];

  // Add date filters only if both are provided
  if (startDate && endDate) {
    conditions.push(`productionDate BETWEEN ? AND ?`);
    params.push(startDate, endDate);
  } 
  // Optional: Handle cases where only one date is provided
  else if (startDate) {
    conditions.push(`productionDate >= ?`);
    params.push(startDate);
  } 
  else if (endDate) {
    conditions.push(`productionDate <= ?`);
    params.push(endDate);
  }

  // Add WHERE clause if there are any conditions
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY productionDate ASC`;

  const [results] = await db.query(query, params);
  return results;
};

// Lot summary report
exports.getLotSummaryReport = async (startDate, endDate, status) => {
  let sql = `
  SELECT lot.*, teatype.teaTypeName
  FROM lot
  JOIN teatype ON lot.teaTypeId = teatype.teaTypeId
  WHERE 1=1
`;
const params = [];
if (startDate && endDate) {
  sql += ` AND manufacturingDate BETWEEN ? AND ?`;
  params.push(startDate, endDate);
}
if (status) {
  sql += ` AND lot.status = ?`;
  params.push(status);
}
const [results] = await db.query(sql, params);
return results;

};