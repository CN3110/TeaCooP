const db = require("../config/database");

class TeaSummary {
  // Helper function to get the last day of a month
  static getLastDayOfMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  // Get total raw tea weight for a specific month and year
  static async getTotalRawTeaWeight(month, year) {
    const lastDay = this.getLastDayOfMonth(year, month);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

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
    const lastDay = this.getLastDayOfMonth(year, month);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

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
    const lastDay = this.getLastDayOfMonth(year, month);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

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
    const lastDay = this.getLastDayOfMonth(year, month);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

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
    const lastDay = this.getLastDayOfMonth(year, month);
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

    const query = `
      SELECT SUM(totalNetWeight) AS totalLotWeight 
      FROM lot
      WHERE manufacturingDate >= ? AND manufacturingDate <= ?
    `;

    const [result] = await db.query(query, [startDate, endDate]);
    return result[0]?.totalLotWeight || 0;
  }

  static async getAvailableStockByTeaType() {
    const [totals] = await db.query(
      `SELECT 
        t.teaTypeId,
        t.teaTypeName,
        COALESCE(SUM(s.weightInKg), 0) as totalStockWeight,
        COALESCE(SUM(l.totalNetWeight), 0) as allocatedWeight,
        (COALESCE(SUM(s.weightInKg), 0) - COALESCE(SUM(l.totalNetWeight), 0)) as currentStock
      FROM 
        teatype t
      LEFT JOIN 
        tea_type_stock s ON t.teaTypeId = s.teaTypeId
      LEFT JOIN
        lot l ON t.teaTypeId = l.teaTypeId
      GROUP BY 
        t.teaTypeId, t.teaTypeName
      ORDER BY 
        t.teaTypeName ASC`
    );
    return totals;
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
    const currentStock = await this.getAvailableStockByTeaType();
    const totalLotWeight = await this.getTotalLotWeights(targetMonth, targetYear);

    return {
      rawTeaWeight,
      madeTeaWeight,
      totalPackets,
      teaProduction,
      currentStock,
      totalLotWeight,
      month: targetMonth,
      year: targetYear
    };
  }
}

module.exports = TeaSummary;