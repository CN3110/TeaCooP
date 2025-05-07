const db = require("../config/database");

class TeaSummary {
  // Get total raw tea weight for a specific month and year
  static async getTotalRawTeaWeight(month, year) {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const query = `
      SELECT SUM(greenTeaLeaves + randalu) AS totalRawTeaWeight 
      FROM delivery
      WHERE date >= ? AND date <= ?
    `;

    const [result] = await db.query(query, [startDate, endDate]);
    return result[0]?.totalRawTeaWeight || 0;
  }

  // Get total made tea weight for a specific month and year
  static async getTotalMadeTeaWeight(month, year) {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const query = `
      SELECT SUM(weightInKg) AS totalMadeTeaWeight 
      FROM tea_production
      WHERE productionDate >= ? AND productionDate <= ?
    `;

    const [result] = await db.query(query, [startDate, endDate]);
    return result[0]?.totalMadeTeaWeight || 0;
  }

  // Get total number of tea packets for a specific month and year
  static async getTotalTeaPackets(month, year) {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const query = `
      SELECT SUM(numberOfPackets) AS totalPackets 
      FROM tea_packets
      WHERE productionDate >= ? AND productionDate <= ?
    `;

    const [result] = await db.query(query, [startDate, endDate]);
    return result[0]?.totalPackets || 0;
  }

  // Get tea production categorized by tea type for a specific month and year
  static async getTeaProductionByType(month, year) {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const query = `
      SELECT 
        t.teaTypeId,
        t.teaTypeName,
        COALESCE(SUM(s.weightInKg), 0) as totalWeight
      FROM 
        teatype t
      LEFT JOIN 
        tea_type_stock s ON t.teaTypeId = s.teaTypeId AND s.productionDate >= ? AND s.productionDate <= ?
      GROUP BY 
        t.teaTypeId, t.teaTypeName
      ORDER BY 
        t.teaTypeName ASC
    `;

    const [results] = await db.query(query, [startDate, endDate]);
    return results;
  }

  // Get current tea type stock
  static async getCurrentTeaTypeStock() {
    const query = `
      SELECT 
        t.teaTypeId,
        t.teaTypeName,
        COALESCE(SUM(s.weightInKg), 0) as currentStock
      FROM 
        teatype t
      LEFT JOIN 
        tea_type_stock s ON t.teaTypeId = s.teaTypeId
      GROUP BY 
        t.teaTypeId, t.teaTypeName
      ORDER BY 
        t.teaTypeName ASC
    `;

    const [results] = await db.query(query);
    return results;
  }

  // Get total lot weights for a specific month and year
  static async getTotalLotWeights(month, year) {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const query = `
      SELECT SUM(totalNetWeight) AS totalLotWeight 
      FROM lot
      WHERE manufacturingDate >= ? AND manufacturingDate <= ?
    `;

    const [result] = await db.query(query, [startDate, endDate]);
    return result[0]?.totalLotWeight || 0;
  }

  // Get total stock for each tea type during a specific time period
  static async getTotalTeaTypeStock(month, year) {
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;

    const query = `
      SELECT 
        t.teaTypeId,
        t.teaTypeName,
        COALESCE(SUM(s.weightInKg), 0) as totalStock
      FROM 
        teatype t
      LEFT JOIN 
        tea_type_stock s ON t.teaTypeId = s.teaTypeId
      WHERE s.productionDate >= ? AND s.productionDate <= ?
      GROUP BY 
        t.teaTypeId, t.teaTypeName
      ORDER BY 
        t.teaTypeName ASC
    `;

    const [results] = await db.query(query, [startDate, endDate]);
    return results;
  }

  // Get complete tea production summary for a specific month and year
  static async getTeaProductionSummary(month, year) {
    const currentDate = new Date();
    const targetMonth = month || (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const targetYear = year || currentDate.getFullYear();
    
    const rawTeaWeight = await this.getTotalRawTeaWeight(targetMonth, targetYear);
    const madeTeaWeight = await this.getTotalMadeTeaWeight(targetMonth, targetYear);
    const totalPackets = await this.getTotalTeaPackets(targetMonth, targetYear);
    const teaProduction = await this.getTeaProductionByType(targetMonth, targetYear);
    const currentStock = await this.getCurrentTeaTypeStock();
    const totalLotWeight = await this.getTotalLotWeights(targetMonth, targetYear);
    const totalStock = await this.getTotalTeaTypeStock(targetMonth, targetYear);

    return {
      rawTeaWeight,
      madeTeaWeight,
      totalPackets,
      teaProduction,
      currentStock,
      totalLotWeight,
      totalStock,
      month: targetMonth,
      year: targetYear
    };
  }
}

module.exports = TeaSummary;
