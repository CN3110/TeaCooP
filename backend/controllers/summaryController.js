const db = require("../config/database");

// Get raw tea summary by month
exports.getRawTeaSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const [year, monthNum] = month.split('-');
    
    const query = `
      SELECT SUM(greenTeaLeaves + randalu) AS totalRawTea
      FROM delivery
      WHERE YEAR(date) = ? AND MONTH(date) = ?
    `;
    
    const [result] = await db.query(query, [year, monthNum]);
    
    res.status(200).json({
      totalRawTea: result[0].totalRawTea || 0
    });
  } catch (error) {
    console.error("Error fetching raw tea summary:", error);
    res.status(500).json({ error: "Failed to fetch raw tea summary" });
  }
};

// Get tea production summary by month
exports.getProductionSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const [year, monthNum] = month.split('-');
    
    const query = `
      SELECT SUM(weightInKg) AS totalMadeTea,
             SUM(weightInKg * 0.01) AS totalFibre
      FROM tea_production
      WHERE YEAR(productionDate) = ? AND MONTH(productionDate) = ?
    `;
    
    const [result] = await db.query(query, [year, monthNum]);
    
    res.status(200).json({
      totalMadeTea: result[0].totalMadeTea || 0,
      totalFibre: result[0].totalFibre || 0
    });
  } catch (error) {
    console.error("Error fetching production summary:", error);
    res.status(500).json({ error: "Failed to fetch production summary" });
  }
};

// Get lot and tea type summary by month
exports.getLotSummary = async (req, res) => {
  try {
    const { month } = req.query;
    const [year, monthNum] = month.split('-');
    
    // Get tea type production totals
    const productionQuery = `
      SELECT t.teaTypeName as name, SUM(l.totalNetWeight) as weight
      FROM lot l
      JOIN tea_type t ON l.teaGrade = t.teaTypeId
      WHERE YEAR(l.manufacturingDate) = ? AND MONTH(l.manufacturingDate) = ?
      GROUP BY t.teaTypeId
    `;
    
    // Get current stock by tea type
    const stockQuery = `
      SELECT t.teaTypeName as name, SUM(s.weightInKg) as weight
      FROM tea_type_stock s
      JOIN tea_type t ON s.teaTypeId = t.teaTypeId
      GROUP BY t.teaTypeId
    `;
    
    // Get total packets and lot weights
    const totalsQuery = `
      SELECT COUNT(*) as totalPackets, SUM(totalNetWeight) as totalLotWeight
      FROM lot
      WHERE YEAR(manufacturingDate) = ? AND MONTH(manufacturingDate) = ?
    `;
    
    const [production] = await db.query(productionQuery, [year, monthNum]);
    const [stock] = await db.query(stockQuery);
    const [totals] = await db.query(totalsQuery, [year, monthNum]);
    
    res.status(200).json({
      production,
      stock,
      totalPackets: totals[0].totalPackets || 0,
      totalLotWeight: totals[0].totalLotWeight || 0
    });
  } catch (error) {
    console.error("Error fetching lot summary:", error);
    res.status(500).json({ error: "Failed to fetch lot summary" });
  }
};
