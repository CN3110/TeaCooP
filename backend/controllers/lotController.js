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
  const { manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice, teaTypeId } = req.body;
  
  if (!manufacturingDate || !teaGrade || !noOfBags || !netWeight || !totalNetWeight || !valuationPrice || !teaTypeId) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    // Check if there's enough stock for the selected tea type
    const [teaTypeStock] = await db.query(
      'SELECT SUM(weightInKg) as totalWeight FROM tea_type_stock WHERE teaTypeId = ?',
      [teaTypeId]
    );
    
    const availableStock = teaTypeStock[0]?.totalWeight || 0;
    
    // Compare with the requested weight
    if (availableStock < totalNetWeight) {
      return res.status(400).json({ 
        message: 'Insufficient stock', 
        availableStock,
        requestedWeight: totalNetWeight
      });
    }
    
    const lotNumber = await lot.generateLotNumber();
    await lot.createLot({
      lotNumber,
      manufacturingDate,
      teaGrade,
      noOfBags,
      netWeight,
      totalNetWeight,
      valuationPrice,
      teaTypeId
    });
    
    // Reduce the stock after creating the lot
    await db.query(
      'UPDATE tea_type_stock SET weightInKg = weightInKg - ? WHERE teaTypeId = ? LIMIT 1',
      [totalNetWeight, teaTypeId]
    );
    
    res.status(201).json({ message: "Lot added successfully", lotNumber });
  } catch (error) {
    console.error("Error adding lot:", error);
    res.status(500).json({ error: "Failed to add lot" });
  }
};


exports.updateLot = async (req, res) => {
  const { lotNumber } = req.params;
  const { manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice } = req.body;

  if (!manufacturingDate || !teaGrade || !noOfBags || !netWeight || !totalNetWeight || !valuationPrice) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingLot = await lot.getLotById(lotNumber);
    if (!existingLot) {
      return res.status(404).json({ message: 'Lot not found' });
    }

    await lot.updateLot(lotNumber, {
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
