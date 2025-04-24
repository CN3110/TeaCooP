const lot = require('../models/lot');

exports.getAllLots = async (req, res) => {
  try {
    const lots = await lot.getAllLots();
    res.status(200).json(lots);
  } catch (error) {
    console.error("Error fetching lots:", error);
    res.status(500).json({ error: "Failed to fetch lots" });
  }
};

exports.getLotById = async (req, res) => {
  const { lotNumber } = req.params;

  try {
    const result = await lot.getLotById(lotNumber);
    if (!result) {
      return res.status(404).json({ message: 'Lot not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching lot:", error);
    res.status(500).json({ error: "Failed to fetch lot" });
  }
};

exports.createLot = async (req, res) => {
  const { invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice } = req.body;

  if (!invoiceNumber || !manufacturingDate || !teaGrade || !noOfBags || !netWeight || !totalNetWeight || !valuationPrice) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const lotNumber = await lot.generateLotNumber();

    await lot.createLot({
      lotNumber,
      invoiceNumber,
      manufacturingDate,
      teaGrade,
      noOfBags,
      netWeight,
      totalNetWeight,
      valuationPrice
    });

    res.status(201).json({ message: "Lot added successfully", lotNumber });
  } catch (error) {
    console.error("Error adding lot:", error);
    res.status(500).json({ error: "Failed to add lot" });
  }
};

exports.updateLot = async (req, res) => {
  const { lotNumber } = req.params;
  const { invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice } = req.body;

  if (!invoiceNumber || !manufacturingDate || !teaGrade || !noOfBags || !netWeight || !totalNetWeight || !valuationPrice) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingLot = await lot.getLotById(lotNumber);
    if (!existingLot) {
      return res.status(404).json({ message: 'Lot not found' });
    }

    await lot.updateLot(lotNumber, {
      invoiceNumber,
      manufacturingDate,
      teaGrade,
      noOfBags,
      netWeight,
      totalNetWeight,
      valuationPrice
    });

    res.json({ message: 'Lot updated successfully' });
  } catch (err) {
    console.error("Error updating lot:", err);
    res.status(500).json({ error: "Failed to update lot" });
  }
};

exports.deleteLot = async (req, res) => {
  const { lotNumber } = req.params;

  try {
    const deleted = await lot.deleteLot(lotNumber);
    if (!deleted) return res.status(404).json({ message: 'Lot not found' });

    res.json({ message: 'Lot deleted successfully' });
  } catch (err) {
    console.error("Error deleting lot:", err);
    res.status(500).json({ error: "Failed to delete lot" });
  }
};

exports.getAvailableLots = async (req, res) => {
  try {
    const lots = await lot.getAvailableLots();
    res.json(lots);
  } catch (err) {
    console.error("Error fetching available lots:", err);
    res.status(500).json({ error: "Failed to fetch available lots" });
  }
};

exports.submitBrokerValuation = async (req, res) => {
  const { brokerId, valuationPrice } = req.body;
  const { lotNumber } = req.params;

  if (!brokerId || !valuationPrice) {
    return res.status(400).json({ message: 'Broker ID and valuation price are required' });
  }

  try {
    await lot.submitBrokerValuation(lotNumber, brokerId, valuationPrice);
    res.json({ message: 'Valuation submitted successfully' });
  } catch (err) {
    console.error("Error submitting valuation:", err);
    res.status(500).json({ error: "Failed to submit valuation" });
  }
};
