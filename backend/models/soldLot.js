const db = require('../config/database');

const SoldLot = {
  async addOrUpdateSoldPrice(lotNumber, brokerId, soldPrice) {
    try {
      // Get lot's total net weight
      const [lotRows] = await db.query(
        `SELECT totalNetWeight FROM lot WHERE lotNumber = ?`,
        [lotNumber]
      );

      if (lotRows.length === 0) {
        throw new Error('Lot not found');
      }

      const totalNetWeight = lotRows[0].totalNetWeight;
      const totalSoldPrice = soldPrice * totalNetWeight;

      // Check if sale already exists
      const [existingRows] = await db.query(
        `SELECT saleId FROM sold_lot WHERE lotNumber = ? AND brokerId = ?`,
        [lotNumber, brokerId]
      );

      if (existingRows.length > 0) {
        // Update existing sale
        const [updateResult] = await db.query(
          `UPDATE sold_lot 
           SET soldPrice = ?, total_sold_price = ?, soldDate = NOW()
           WHERE lotNumber = ? AND brokerId = ?`,
          [soldPrice, totalSoldPrice, lotNumber, brokerId]
        );

        return {
          operation: 'update',
          affectedRows: updateResult.affectedRows,
          saleId: existingRows[0].saleId,
          totalSoldPrice
        };
      } else {
        // Insert new sale
        const [insertResult] = await db.query(
          `INSERT INTO sold_lot (lotNumber, brokerId, soldPrice, total_sold_price)
           VALUES (?, ?, ?, ?)`,
          [lotNumber, brokerId, soldPrice, totalSoldPrice]
        );

        return {
          operation: 'insert',
          affectedRows: insertResult.affectedRows,
          saleId: insertResult.insertId,
          totalSoldPrice
        };
      }
    } catch (err) {
      console.error('Error in addOrUpdateSoldPrice:', err);
      throw err;
    }
  },

  async getByBroker(brokerId) {
    try {
      const [results] = await db.query(
        `SELECT 
          sl.saleId,
          sl.lotNumber,
          sl.brokerId,
          sl.soldPrice,
          sl.total_sold_price AS totalSoldPrice,
          sl.soldDate,
          l.noOfBags,
          l.netWeight,
          l.totalNetWeight,
          l.manufacturingDate,
          t.teaTypeName,
          b.brokerName,
          b.brokerCompanyName,
          bv.valuationPrice AS employeePrice
        FROM sold_lot sl
        JOIN lot l ON sl.lotNumber = l.lotNumber
        JOIN teatype t ON l.teaTypeId = t.teaTypeId
        JOIN broker b ON sl.brokerId = b.brokerId
        LEFT JOIN broker_valuation bv 
          ON sl.lotNumber = bv.lotNumber 
          AND sl.brokerId = bv.brokerId 
          AND bv.is_confirmed = TRUE
        WHERE sl.brokerId = ?
        ORDER BY sl.soldDate DESC`,
        [brokerId]
      );

      return results;
    } catch (err) {
      console.error('Error in getByBroker:', err);
      throw err;
    }
  },

  async deleteSoldPrice(saleId) {
    try {
      const [result] = await db.query(
        `DELETE FROM sold_lot WHERE saleId = ?`,
        [saleId]
      );

      return result.affectedRows > 0;
    } catch (err) {
      console.error('Error in deleteSoldPrice:', err);
      throw err;
    }
  },

  async getAllForEmployee() {
    try {
      const [results] = await db.query(
        `SELECT
          sl.saleId,
          sl.lotNumber,
          sl.brokerId,
          sl.soldPrice,
          sl.total_sold_price AS totalSoldPrice,
          sl.soldDate,
          l.totalNetWeight,
          t.teaTypeName,
          b.brokerName,
          b.brokerCompanyName,
          bv.valuationPrice AS employeeValuation
        FROM sold_lot sl
        JOIN lot l ON sl.lotNumber = l.lotNumber
        JOIN teatype t ON l.teaTypeId = t.teaTypeId
        JOIN broker b ON sl.brokerId = b.brokerId
        LEFT JOIN broker_valuation bv 
          ON sl.lotNumber = bv.lotNumber 
          AND sl.brokerId = bv.brokerId 
          AND bv.is_confirmed = TRUE
        ORDER BY sl.soldDate DESC`
      );

      return results;
    } catch (err) {
      console.error('Error in getAllForEmployee:', err);
      throw err;
    }
  }
};

module.exports = SoldLot;
