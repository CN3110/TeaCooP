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

exports.getValuationsByBroker = async (req, res) => {
  const { brokerId } = req.params;

  try {
    const results = await BrokerValuation.getValuationsByBroker(brokerId);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching valuations by broker');
  }
};

exports.updateValuation = async (req, res) => {
  const { valuationId } = req.params;
  const { valuationPrice } = req.body;

  if (!valuationPrice || isNaN(valuationPrice)) {
    return res.status(400).json({ message: 'Valid valuation price is required' });
  }

  try {
    const updated = await BrokerValuation.updateValuationPrice(valuationId, parseFloat(valuationPrice));
    
    if (updated) {
      res.json({ message: 'Valuation updated successfully' });
    } else {
      res.status(404).json({ message: 'Valuation not found or already confirmed' });
    }
  } catch (err) {
    console.error(err);
    if (err.message === 'Cannot update a confirmed valuation') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Error updating valuation' });
    }
  }
};

exports.deleteValuation = async (req, res) => {
  const { valuationId } = req.params;

  try {
    const deleted = await BrokerValuation.deleteValuation(valuationId);
    
    if (deleted) {
      res.json({ message: 'Valuation deleted successfully' });
    } else {
      res.status(404).json({ message: 'Valuation not found or already confirmed' });
    }
  } catch (err) {
    console.error(err);
    if (err.message === 'Cannot delete a confirmed valuation') {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: 'Error deleting valuation' });
    }
  }
};