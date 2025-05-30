const lotModel = require('../models/lot');
const db = require('../config/database');

// Helper to calculate available stock for a tea type
const getAvailableStockByTeaType = async (teaTypeId) => {
  const [[stockResult]] = await db.query(
    `SELECT COALESCE(SUM(weightInKg), 0) as totalStock FROM tea_type_stock WHERE teaTypeId = ?`,
    [teaTypeId]
  );
  const [[lotResult]] = await db.query(
    `SELECT COALESCE(SUM(totalNetWeight), 0) as usedWeight FROM lot WHERE teaTypeId = ?`,
    [teaTypeId]
  );
  return stockResult.totalStock - lotResult.usedWeight;
};

// Get all lots
exports.getAllLots = async (req, res) => {
  try {
    const lots = await lotModel.getAllLots();
    res.status(200).json(lots);
  } catch (error) {
    console.error("Error fetching lots:", error);
    res.status(500).json({ error: "Failed to fetch lots" });
  }
};

// Get a lot by lotNumber
exports.getLotById = async (req, res) => {
  const { lotNumber } = req.params;
  try {
    const lot = await lotModel.getLotById(lotNumber);
    if (!lot) return res.status(404).json({ message: 'Lot not found' });
    res.status(200).json(lot);
  } catch (error) {
    console.error("Error fetching lot:", error);
    res.status(500).json({ error: "Failed to fetch lot" });
  }
};

// Get available made tea for lot creation (95% of total production this month)
exports.getAvailableMadeTeaForTeaTypeCreation = async (req, res) => {
  try {
    const availableWeight = await lotModel.getAvailableMadeTeaForTeaTypeCreation();
    res.status(200).json({ availableWeight });
  } catch (error) {
    console.error("Error calculating available made tea:", error);
    res.status(500).json({ error: "Failed to calculate available made tea" });
  }
};


// Create a new lot
exports.createLot = async (req, res) => {
  const {
  manufacturingDate, noOfBags, netWeight,
  totalNetWeight, valuationPrice, teaTypeId,
  notes
} = req.body;


  if (!manufacturingDate || !noOfBags || !netWeight || !totalNetWeight || !valuationPrice || !teaTypeId ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const availableStock = await getAvailableStockByTeaType(teaTypeId);
    if (totalNetWeight > availableStock) {
      return res.status(400).json({
        message: `Not enough stock. Available: ${availableStock}kg, Requested: ${totalNetWeight}kg`
      });
    }

    const lotNumber = await lotModel.generateLotNumber();
    await lotModel.createLot({
  lotNumber,
  manufacturingDate,
  noOfBags,
  netWeight,
  totalNetWeight,
  valuationPrice,
  teaTypeId,
  notes
});


    res.status(201).json({ message: 'Lot created successfully', lotNumber });
  } catch (error) {
    console.error("Error creating lot:", error);
    res.status(500).json({ error: "Failed to create lot" });
  }
};

// Update an existing lot
exports.updateLot = async (req, res) => {
  const { lotNumber } = req.params;
  const {
  manufacturingDate, noOfBags, netWeight,
  totalNetWeight, valuationPrice, teaTypeId,
  notes
} = req.body;


  if (!manufacturingDate || !noOfBags || !netWeight || !totalNetWeight || !valuationPrice || !teaTypeId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (isNaN(noOfBags) || isNaN(netWeight) ||
      isNaN(totalNetWeight) || isNaN(valuationPrice) || isNaN(teaTypeId)) {
    return res.status(400).json({ message: 'Numeric fields must contain valid numbers' });
  }

  try {
    const existingLot = await lotModel.getLotById(lotNumber);
    if (!existingLot) {
      return res.status(404).json({ message: 'Lot not found' });
    }

    await lotModel.updateLot(lotNumber, {
  manufacturingDate,
  noOfBags: Number(noOfBags),
  netWeight: Number(netWeight),
  totalNetWeight: Number(totalNetWeight),
  valuationPrice: Number(valuationPrice),
  teaTypeId: Number(teaTypeId),
  notes
});

    res.status(200).json({ message: 'Lot updated successfully' });
  } catch (error) {
    console.error("Error updating lot:", error);
    res.status(500).json({
      error: "Failed to update lot",
      details: error.message
    });
  }
};

// Delete a lot
exports.deleteLot = async (req, res) => {
  const { lotNumber } = req.params;
  try {
    const deleted = await lotModel.deleteLot(lotNumber);
    if (!deleted) return res.status(404).json({ error: "Lot not found" });

    res.status(200).json({ message: "Lot deleted successfully" });
  } catch (error) {
    // Do NOT log specific business logic errors
    if (error.message.includes("Cannot delete this Lot")) {
      return res.status(400).json({ error: error.message });
    }

    // Log unexpected errors only
    console.error("Unexpected error deleting lot:", error);
    res.status(500).json({ error: "Failed to delete lot due to server error" });
  }
};


// Get lots available for a specific broker (not yet valued by them)
exports.getAvailableLotsForBroker = async (req, res) => {
  const brokerId = req.user?.brokerId || req.query.brokerId;
  if (!brokerId) {
    return res.status(400).json({ message: 'Broker ID is required' });
  }
  try {
    const lots = await lotModel.getAvailableLotsForBroker(brokerId);
    res.status(200).json(lots);
  } catch (error) {
    console.error("Error fetching available lots:", error);
    res.status(500).json({ error: "Failed to fetch available lots" });
  }
};

// Submit broker valuation (removes lot from "new" for that broker only)
exports.submitBrokerValuation = async (req, res) => {
  const { brokerId, valuationPrice } = req.body;
  const { lotNumber } = req.params;
  if (!brokerId || !valuationPrice) {
    return res.status(400).json({ message: 'Broker ID and valuation price are required' });
  }
  try {
    await lotModel.submitBrokerValuation(lotNumber, brokerId, valuationPrice);
    res.status(200).json({ message: 'Valuation submitted successfully' });
  } catch (error) {
    console.error("Error submitting valuation:", error);
    res.status(500).json({ error: "Failed to submit valuation" });
  }
};

// Get all available lots (not broker-specific)
exports.getAvailableLots = async (req, res) => {
  try {
    const lots = await lotModel.getAvailableLots();
    res.status(200).json(lots);
  } catch (error) {
    console.error("Error fetching available lots:", error);
    res.status(500).json({ error: "Failed to fetch available lots" });
  }
};

exports.confirmValuation = async (req, res) => {
  const { valuationId } = req.params;
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ message: 'Employee ID is required' });
  }

  try {
    // Start transaction
    await db.query('START TRANSACTION');

    // 1. Get the valuation details first
    const valuation = await lotModel.getValuationById(valuationId);
    if (!valuation) {
      await db.query('ROLLBACK');
      return res.status(404).json({ message: 'Valuation not found' });
    }

    // 2. Confirm the valuation
    await lotModel.confirmBrokerValuation(valuationId, employeeId);

    // 3. Update the lot status and valuation price
    await lotModel.updateLotValuationAndStatus(
      valuation.lotNumber, 
      'confirmed'
    );

    // Commit transaction
    await db.query('COMMIT');

    res.status(200).json({ 
      message: 'Valuation confirmed and lot status updated',
      lotNumber: valuation.lotNumber
    });
  } catch (error) {
    // Rollback on error
    await db.query('ROLLBACK');
    console.error("Error confirming valuation:", error);
    res.status(500).json({ 
      error: "Failed to confirm valuation",
      details: error.message 
    });
  }
};
