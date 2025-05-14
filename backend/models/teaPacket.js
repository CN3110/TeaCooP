const db = require("../config/database");
class TeaPacket {
  static async addTeaPacket(productionDate, sourceMadeTeaWeight, packetWeight, numberOfPackets, createdBy) {
    if (!productionDate || !sourceMadeTeaWeight || !packetWeight || !numberOfPackets || !createdBy) {
      throw new Error("Missing required fields");
    }

    const query = `
      INSERT INTO tea_packets (productionDate, sourceMadeTeaWeight, packetWeight, numberOfPackets, createdBy)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      productionDate,
      sourceMadeTeaWeight,
      packetWeight,
      numberOfPackets,
      createdBy
    ]);

    return result;
  }

  static async getAllTeaPackets() {
    const query = `
      SELECT p.*, e.employeeName as employeeName
      FROM tea_packets p
      JOIN employee e ON p.createdBy = e.employeeId
      ORDER BY p.productionDate DESC, p.createdAt DESC
    `;

    const [results] = await db.query(query);
    return results;
  }

  static async deleteTeaPacket(id) {
  if (!id) throw new Error("ID is required for deletion");

  const query = `DELETE FROM tea_packets WHERE packetId = ?`;

  const [result] = await db.query(query, [id]);
  return result;
}


  static async getAvailableMadeTea() {
    const monthlyQuery = `
      SELECT SUM(weightInKg) as totalProduction 
      FROM tea_production 
      WHERE productionDate >= DATE_FORMAT(NOW(), '%Y-%m-01') 
      AND productionDate <= LAST_DAY(NOW())
    `;

    const usedQuery = `
      SELECT SUM(sourceMadeTeaWeight) as totalUsed 
      FROM tea_packets 
      WHERE productionDate >= DATE_FORMAT(NOW(), '%Y-%m-01') 
      AND productionDate <= LAST_DAY(NOW())
    `;

    const [[{ totalProduction = 0 }]] = await db.query(monthlyQuery);
    const [[{ totalUsed = 0 }]] = await db.query(usedQuery);

    const allocatedForPackets = totalProduction * 0.05;
    const available = allocatedForPackets - totalUsed;

    return {
      totalMonthlyProduction: totalProduction,
      allocatedForPackets,
      totalUsedForPackets: totalUsed,
      availableForPackets: available
    };
  }
}

module.exports = TeaPacket;