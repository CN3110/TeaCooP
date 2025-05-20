const db = require("../config/database");

// Generate a new unique lot number
const generateLotNumber = async () => {
  const query = `
    SELECT MAX(CAST(SUBSTRING(lotNumber, 2) AS UNSIGNED)) AS lastId
    FROM lot
  `;
  const [[result]] = await db.query(query);
  const lastId = result?.lastId || 1000;
  return `L${lastId + 1}`;
};

// Get all lots
const getAllLots = async () => {
  const [lots] = await db.query("SELECT * FROM lot ORDER BY lotNumber DESC");
  return lots;
};

// Get a lot by lotNumber
const getLotById = async (lotNumber) => {
  const [lots] = await db.query("SELECT * FROM lot WHERE lotNumber = ?", [
    lotNumber,
  ]);
  return lots[0] || null;
};

// Get the available made tea weight for lot creation (95% from total made tea production)
const getAvailableMadeTeaForTeaTypeCreation = async () => {
  const monthlyQuery = `
    SELECT SUM(weightInKg) as totalProduction 
    FROM tea_production 
    WHERE productionDate >= DATE_FORMAT(NOW(), '%Y-%m-01') 
      AND productionDate < DATE_FORMAT(NOW() + INTERVAL 1 MONTH, '%Y-%m-01')
  `;
  const [[monthlyResult]] = await db.query(monthlyQuery);
  const monthlyProduction = monthlyResult?.totalProduction || 0;

  const availableMadeTea = monthlyProduction * 0.95; // 95% of the total production
  return availableMadeTea;
};

// Create a new lot
const createLot = async ({
  lotNumber,
  manufacturingDate,
  noOfBags,
  netWeight,
  totalNetWeight,
  valuationPrice,
  teaTypeId,
  notes,
}) => {
  const query = `
    INSERT INTO lot (
      lotNumber, manufacturingDate, noOfBags, netWeight, totalNetWeight,
      valuationPrice, teaTypeId, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'available', ?)
  `;
  await db.query(query, [
    lotNumber,
    manufacturingDate,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice,
    teaTypeId,
    notes || null,
  ]);
};

// Update an existing lot
const updateLot = async (
  lotNumber,
  {
    manufacturingDate,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice,
    teaTypeId,
    notes,
  }
) => {
  const query = `
    UPDATE lot SET
      manufacturingDate = ?,
      noOfBags = ?,
      netWeight = ?,
      totalNetWeight = ?,
      valuationPrice = ?,
      teaTypeId = ?,
      notes = ?
    WHERE lotNumber = ?
  `;
  await db.query(query, [
    manufacturingDate,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice,
    teaTypeId,
    notes || null,
    lotNumber,
  ]);
};

// Delete a lot
const deleteLot = async (lotNumber) => {
  // Check if there are any broker valuations for this lot
  const [related] = await db.query(
    "SELECT * FROM broker_valuation WHERE lotNumber = ?",
    [lotNumber]
  );

  if (related.length > 0) {
    // Prevent deletion if any related entries exist
    throw new Error(
      "Cannot delete this Lot, because brokers have added valuations for it."
    );
  }

  // If no dependencies, proceed with deletion
  const [result] = await db.query("DELETE FROM lot WHERE lotNumber = ?", [
    lotNumber,
  ]);
  return result.affectedRows > 0;
};

// Get lots marked as available for a specific broker (not yet valued by them)
const getAvailableLotsForBroker = async (brokerId) => {
  const [lots] = await db.query(
    `SELECT * FROM lot
     WHERE status = 'available'
     AND lotNumber NOT IN (
       SELECT lotNumber FROM broker_valuation WHERE brokerId = ?
     )`,
    [brokerId]
  );
  return lots;
};

// Get all available lots (not broker-specific)
const getAvailableLots = async () => {
  const [lots] = await db.query("SELECT * FROM lot WHERE status = 'available'");
  return lots;
};

// Submit a broker valuation (do NOT update the global lot status)
const submitBrokerValuation = async (lotNumber, brokerId, valuationPrice) => {
  await db.query(
    `INSERT INTO broker_valuation (lotNumber, brokerId, valuationPrice) VALUES (?, ?, ?)`,
    [lotNumber, brokerId, valuationPrice]
  );
  // Do NOT update lot status here!
};



const updateLotStatus = async (lotNumber, status) => {
  const query = `
    UPDATE lot SET
      status = ?
    WHERE lotNumber = ?
  `;
  await db.query(query, [status, lotNumber]);
};

// Confirm a broker valuation
const confirmBrokerValuation = async (valuationId, employeeId) => {
  await db.query(
    `UPDATE broker_valuation 
     SET is_confirmed = TRUE, 
         confirmed_by = ?, 
         confirmed_at = CURRENT_TIMESTAMP 
     WHERE valuation_id = ?`,
    [employeeId, valuationId]
  );
};

// Get valuation details by ID
const getValuationById = async (valuationId) => {
  const [[valuation]] = await db.query(
    `SELECT * FROM broker_valuation WHERE valuation_id = ?`,
    [valuationId]
  );
  return valuation || null;
};

// Update lot valuation price and status
const updateLotValuationAndStatus = async (lotNumber, status) => {
  await db.query(
    `UPDATE lot 
     SET status = ? 
     WHERE lotNumber = ?`,
    [status, lotNumber]
  );
};


module.exports = {
  generateLotNumber,
  getAllLots,
  getLotById,
  getAvailableMadeTeaForTeaTypeCreation,
  createLot,
  updateLot,
  deleteLot,
  getAvailableLotsForBroker,
  getAvailableLots,
  submitBrokerValuation,
  updateLotStatus,
  confirmBrokerValuation,       
  getValuationById,
  updateLotValuationAndStatus
};
