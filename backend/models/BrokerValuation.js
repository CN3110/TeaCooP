const db = require('../config/database');

const BrokerValuation = {
  async getAllGroupedByLot() {
    const [results] = await db.query(`
      SELECT bv.*, b.brokerName
      FROM broker_valuation bv
      JOIN broker b ON bv.brokerId = b.brokerId
      ORDER BY bv.lotNumber, bv.valuationDate DESC
    `);
    return results;
  },

  async confirmValuation(valuationId, employeeId) {
    await db.query(`
      UPDATE broker_valuation 
      SET is_confirmed = TRUE, 
          confirmed_by = ?, 
          confirmed_at = NOW()
      WHERE valuation_id = ?
    `, [employeeId, valuationId]);

    await db.query(`
      UPDATE broker_valuation 
      SET is_confirmed = FALSE 
      WHERE lotNumber = (
        SELECT lotNumber FROM (
          SELECT lotNumber FROM broker_valuation WHERE valuation_id = ?
        ) AS sub
      ) 
      AND valuation_id != ?
    `, [valuationId, valuationId]);
  }, 

  async getValuationsByLot(lotNumber) { 
    const [results] = await db.query(`
      SELECT 
        bv.*, 
        b.brokerName, 
        b.brokerCompanyName AS companyName,
        bv.valuationPrice AS valuationAmount
      FROM broker_valuation bv
      JOIN broker b ON bv.brokerId = b.brokerId
      WHERE bv.lotNumber = ?
      ORDER BY bv.valuationDate DESC
    `, [lotNumber]);
    return results;
  },

  async getValuationsByBroker(brokerId) {
    const [results] = await db.query(`
      SELECT 
        bv.*,
        tt.teaTypeName,
        l.noOfBags,
        l.totalNetWeight
      FROM broker_valuation bv
      JOIN lot l ON bv.lotNumber = l.lotNumber
      JOIN teaType tt ON l.teaTypeId = tt.teaTypeId
      WHERE bv.brokerId = ?
      ORDER BY bv.valuationDate DESC
    `, [brokerId]);
    return results;
  },

  async updateValuationPrice(valuationId, valuationPrice) {
    const [checkResult] = await db.query(`
      SELECT is_confirmed FROM broker_valuation WHERE valuation_id = ?
    `, [valuationId]);
    
    if (checkResult.length > 0 && checkResult[0].is_confirmed) {
      throw new Error('Cannot update a confirmed valuation');
    }
    
    const [result] = await db.query(`
      UPDATE broker_valuation 
      SET valuationPrice = ?, 
          valuationDate = NOW() 
      WHERE valuation_id = ? 
      AND is_confirmed = FALSE
    `, [valuationPrice, valuationId]);
    
    return result.affectedRows > 0;
  },

  async deleteValuation(valuationId) {
    const [checkResult] = await db.query(`
      SELECT is_confirmed, lotNumber FROM broker_valuation WHERE valuation_id = ?
    `, [valuationId]);
    
    if (checkResult.length > 0 && checkResult[0].is_confirmed) {
      throw new Error('Cannot delete a confirmed valuation');
    }
    
    const [result] = await db.query(`
      DELETE FROM broker_valuation 
      WHERE valuation_id = ? 
      AND is_confirmed = FALSE
    `, [valuationId]);

    if (result.affectedRows > 0 && checkResult.length > 0) {
      const lotNumber = checkResult[0].lotNumber;
      
      const [countResult] = await db.query(`
        SELECT COUNT(*) as count FROM broker_valuation WHERE lotNumber = ?
      `, [lotNumber]);
      
      if (countResult.length > 0 && countResult[0].count === 0) {
        await db.query(`
          UPDATE lot SET status = 'available' WHERE lotNumber = ?
        `, [lotNumber]);
      }
    }
    
    return result.affectedRows > 0;
  },

  async getConfirmedValuations() {
    const [results] = await db.query(`
      SELECT 
    bv.*,
    b.brokerName,
    b.brokerCompanyName AS companyName,
    tt.teaTypeName,  
    l.noOfBags,
    l.netWeight,
    l.totalNetWeight,
    l.manufacturingDate
FROM broker_valuation bv
JOIN broker b ON bv.brokerId = b.brokerId
JOIN lot l ON bv.lotNumber = l.lotNumber
LEFT JOIN teaType tt ON l.teaTypeId = tt.teaTypeId
WHERE bv.is_confirmed = 1
ORDER BY bv.confirmed_at DESC
LIMIT 0, 1000;

    `);
    return results;
  },

  // To get all confirmed lots for logged broker - broker view
  async getConfirmedValuationsByBroker(brokerId) {
    const [results] = await db.query(`
      SELECT 
        bv.valuation_id,
        bv.lotNumber,
        bv.brokerId,
        bv.valuationPrice AS valuationAmount,
        bv.valuationDate,
        bv.is_confirmed,
        bv.confirmed_by,
        bv.confirmed_at,
        tt.teaTypeName,
        l.noOfBags,
        l.totalNetWeight
      FROM broker_valuation bv
      JOIN lot l ON bv.lotNumber = l.lotNumber
      JOIN teaType tt ON l.teaTypeId = tt.teaTypeId
      WHERE bv.brokerId = ? AND bv.is_confirmed = TRUE
      ORDER BY bv.confirmed_at DESC
    `, [brokerId]);
  
    return results;
  }

};

module.exports = BrokerValuation;
