const db = require("../config/database");

class Land {
  // Add multiple land records for a supplier
  static async addLandDetails(supplierId, landDetails) {
    if (!Array.isArray(landDetails) || landDetails.length === 0) {
      throw new Error("Land details must be a non-empty array");
    }

    const query = `
      INSERT INTO land (supplierId, landSize, landAddress)
      VALUES ?
    `;

    const values = landDetails.map((land) => [
      supplierId,
      land.landSize,
      land.landAddress,
    ]);

    try {
      const [result] = await db.query(query, [values]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Get lands by supplierId
  static async getLandDetailsBySupplierId(supplierId) {
    const query = `SELECT landId, landAddress FROM land WHERE supplierId = ?`;
    try {
      const [rows] = await db.query(query, [supplierId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Land;
