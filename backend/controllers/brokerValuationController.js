const BrokerValuation = require('../models/BrokerValuation');
const db = require('../config/database');


exports.getAllGroupedByLot = async (req, res) => {
  try {
    const results = await BrokerValuation.getAllGroupedByLot();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching valuations');
  }
};

exports.confirmValuation = async (req, res) => {
  const { valuationId } = req.params;
  const { employeeId } = req.body;

 

console.log(`Employee ID: ${employeeId}, Valuation ID: ${valuationId}`); // Log for debugging

await db.query(`
  UPDATE broker_valuation 
  SET is_confirmed = TRUE, confirmed_by = ?, confirmed_at = NOW()
  WHERE valuation_id = ?
`, [employeeId, valuationId]);


  try {
    await BrokerValuation.confirmValuation(valuationId, employeeId);
    res.send('Valuation confirmed successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error confirming valuation');
  }
};

exports.getValuationsByLot = async (req, res) => {
  const { lotNumber } = req.params;

  try {
    const results = await BrokerValuation.getValuationsByLot(lotNumber);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching valuations by lot');
  }
};
