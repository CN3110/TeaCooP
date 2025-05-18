const db = require('../config/database');

const SoldLot = {
  async addOrUpdateSoldPrice(lotNumber, brokerId, soldPrice) {
    let connection;
    try {
      // Get connection from pool and start transaction
      connection = await db.getConnection();
      await connection.beginTransaction();

      // 1. Get lot's total net weight
      const [lotRows] = await connection.query(
        `SELECT totalNetWeight, status FROM lot WHERE lotNumber = ? FOR UPDATE`,
        [lotNumber]
      );

      if (lotRows.length === 0) {
        throw new Error('Lot not found');
      }

      if (lotRows[0].status !== 'confirmed') {
        throw new Error('Lot must be in confirmed status before marking as sold');
      }

      const totalNetWeight = lotRows[0].totalNetWeight;
      const totalSoldPrice = soldPrice * totalNetWeight;

      // 2. Check if sale already exists
      const [existingRows] = await connection.query(
        `SELECT saleId FROM sold_lot WHERE lotNumber = ? AND brokerId = ?`,
        [lotNumber, brokerId]
      );

      let result;
      if (existingRows.length > 0) {
        // Update existing sale
        const [updateResult] = await connection.query(
          `UPDATE sold_lot 
           SET soldPrice = ?, total_sold_price = ?, soldDate = NOW()
           WHERE lotNumber = ? AND brokerId = ?`,
          [soldPrice, totalSoldPrice, lotNumber, brokerId]
        );

        result = {
          operation: 'update',
          affectedRows: updateResult.affectedRows,
          saleId: existingRows[0].saleId,
          totalSoldPrice
        };
      } else {
        // Insert new sale
        const [insertResult] = await connection.query(
          `INSERT INTO sold_lot (lotNumber, brokerId, soldPrice, total_sold_price)
           VALUES (?, ?, ?, ?)`,
          [lotNumber, brokerId, soldPrice, totalSoldPrice]
        );

        result = {
          operation: 'insert',
          affectedRows: insertResult.affectedRows,
          saleId: insertResult.insertId,
          totalSoldPrice
        };
      }

      // 3. Update lot status to 'sold'
      await connection.query(
        `UPDATE lot SET status = 'sold' WHERE lotNumber = ?`,
        [lotNumber]
      );

      // Commit transaction
      await connection.commit();

      return result;
    } catch (err) {
      // Rollback transaction if error occurs
      if (connection) await connection.rollback();
      console.error('Error in addOrUpdateSoldPrice:', err);
      throw err;
    } finally {
      // Release connection back to pool
      if (connection) connection.release();
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
          l.status,
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
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // 1. Get the lot number from the sale
      const [[sale]] = await connection.query(
        `SELECT lotNumber FROM sold_lot WHERE saleId = ?`,
        [saleId]
      );

      if (!sale) {
        throw new Error('Sale record not found');
      }

      // 2. Delete the sale record
      const [result] = await connection.query(
        `DELETE FROM sold_lot WHERE saleId = ?`,
        [saleId]
      );

      if (result.affectedRows === 0) {
        throw new Error('No sale record deleted');
      }

      // 3. Update lot status back to 'confirmed'
      await connection.query(
        `UPDATE lot SET status = 'confirmed' 
         WHERE lotNumber = ? AND status = 'sold'`,
        [sale.lotNumber]
      );

      await connection.commit();
      return true;
    } catch (err) {
      if (connection) await connection.rollback();
      console.error('Error in deleteSoldPrice:', err);
      throw err;
    } finally {
      if (connection) connection.release();
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
          l.status,
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