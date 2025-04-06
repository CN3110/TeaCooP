const lotModel = require('../models/lot');

exports.getAllLots = async (req, res) => {
  try {
    const lots = await lotModel.getAllLots();
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLotById = async (req, res) => {
  try {
    const lot = await lotModel.getLotById(req.params.id);
    if (!lot) return res.status(404).json({ message: 'Lot not found' });
    res.json(lot);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createLot = async (req, res) => {
  try {
    await lotModel.createLot(req.body);
    res.status(201).json({ message: 'Lot created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateLot = async (req, res) => {
  try {
    const updated = await lotModel.updateLot(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Lot not found' });
    res.json({ message: 'Lot updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteLot = async (req, res) => {
  try {
    const deleted = await lotModel.deleteLot(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Lot not found' });
    res.json({ message: 'Lot deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableLots = async (req, res) => {
  try {
    const lots = await lotModel.getAvailableLots();
    res.json(lots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitBrokerValuation = async (req, res) => {
  try {
    const { brokerId, valuationPrice } = req.body;
    const { lotNumber } = req.params;

    await lotModel.submitBrokerValuation(lotNumber, brokerId, valuationPrice);

    res.json({ message: 'Valuation submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

