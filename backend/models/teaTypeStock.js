const db = require("../config/database");

exports.getAllTeaTypeStocks = async (limit, offset) => {
  let query = `
    SELECT s.*, t.teaTypeName, e.employeeName as employeeName
    FROM tea_type_stock s
    JOIN teatype t ON s.teaTypeId = t.teaTypeId
    LEFT JOIN employee e ON s.createdBy = e.employeeId
    ORDER BY s.productionDate DESC, s.stockId DESC
  `;

  if (limit !== null) {
    query += ` LIMIT ${limit} OFFSET ${offset}`;
  }

  const [stocks] = await db.query(query);
  const [countResult] = await db.query('SELECT COUNT(*) as total FROM tea_type_stock');
  
  return { stocks, total: countResult[0].total };
};

exports.createTeaTypeStock = async (teaTypeId, weightInKg, productionDate, createdBy) => {
  return db.query(
    "INSERT INTO tea_type_stock (teaTypeId, weightInKg, productionDate, createdBy) VALUES (?, ?, ?, ?)",
    [teaTypeId, weightInKg, productionDate, createdBy]
  );
};

exports.getTeaTypeStockById = async (stockId) => {
  const [stock] = await db.query(
    `SELECT s.*, t.teaTypeName, e.employeeName as employeeName
     FROM tea_type_stock s
     JOIN teatype t ON s.teaTypeId = t.teaTypeId
     LEFT JOIN employee e ON s.createdBy = e.employeeId
     WHERE s.stockId = ?`,
    [stockId]
  );
  return stock;
};


exports.updateTeaTypeStock = async (stockId, weightInKg, productionDate, teaTypeId) => {
  return db.query(
    "UPDATE tea_type_stock SET weightInKg = ?, productionDate = ?, teaTypeId = ? WHERE stockId = ?",
    [weightInKg, productionDate, teaTypeId, stockId]
  );
};


exports.adjustTeaTypeStock = async (stockId, adjustment) => {
  return db.query(
    "UPDATE tea_type_stock SET weightInKg = weightInKg + ? WHERE stockId = ?",
    [adjustment, stockId]
  );
};

exports.deleteTeaTypeStock = async (stockId) => {
  return db.query(
    "DELETE FROM tea_type_stock WHERE stockId = ?",
    [stockId]
  );
};

//to get the total tea type stock available (all tea types in one)
exports.getTotalTeaTypeStock = async () => {
  const [total] = await db.query(
    `SELECT 
      COALESCE(SUM(weightInKg), 0) as totalWeight
    FROM 
      tea_type_stock`
  );
  return total[0].totalWeight;
};

exports.getAvailableStockByTeaType = async () => {
  const [totals] = await db.query(
    `SELECT 
      t.teaTypeId,
      t.teaTypeName,
      COALESCE(SUM(s.weightInKg), 0) AS totalStockWeight,
      COALESCE((
        SELECT SUM(l.totalNetWeight) 
        FROM lot l 
        WHERE l.teaTypeId = t.teaTypeId
      ), 0) AS allocatedWeight,
      (COALESCE(SUM(s.weightInKg), 0) - COALESCE((
        SELECT SUM(l.totalNetWeight) 
        FROM lot l 
        WHERE l.teaTypeId = t.teaTypeId
      ), 0)) AS availableWeight
    FROM 
      teatype t
    LEFT JOIN 
      tea_type_stock s ON t.teaTypeId = s.teaTypeId
    GROUP BY 
      t.teaTypeId, t.teaTypeName
    ORDER BY 
      t.teaTypeName ASC`
  );
  return totals;
};
