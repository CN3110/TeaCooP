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
      SET is_confirmed = TRUE, confirmed_by = ?, confirmed_at = NOW()
      WHERE valuation_id = ?
    `, [employeeId, valuationId]);

    await db.query(`
      UPDATE broker_valuation 
      SET is_confirmed = FALSE 
      WHERE lotNumber = (SELECT lotNumber FROM broker_valuation WHERE valuation_id = ?) 
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
  }
};

module.exports = BrokerValuation;
