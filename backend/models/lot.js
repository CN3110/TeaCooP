const db = require('../config/database');

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
  const [lots] = await db.query('SELECT * FROM lot');
  return lots;
};

// Get a lot by lotNumber
const getLotById = async (lotNumber) => {
  const [lots] = await db.query('SELECT * FROM lot WHERE lotNumber = ?', [lotNumber]);
  return lots[0] || null;
};

// Create a new lot
const createLot = async ({
  lotNumber,
  manufacturingDate,
  noOfBags,
  netWeight,
  totalNetWeight,
  valuationPrice,
  teaTypeId
}) => {
  const query = `
    INSERT INTO lot (
      lotNumber, manufacturingDate, noOfBags, netWeight, totalNetWeight,
      valuationPrice, teaTypeId, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 'available')
  `;
  await db.query(query, [
    lotNumber,
    manufacturingDate,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice,
    teaTypeId
  ]);
};

// Update an existing lot
const updateLot = async (lotNumber, {
  manufacturingDate,
  noOfBags,
  netWeight,
  totalNetWeight,
  valuationPrice,
  teaTypeId
}) => {
  const query = `
    UPDATE lot SET
      manufacturingDate = ?,
      noOfBags = ?,
      netWeight = ?,
      totalNetWeight = ?,
      valuationPrice = ?,
      teaTypeId = ?
    WHERE lotNumber = ?
  `;
  await db.query(query, [
    manufacturingDate,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice,
    teaTypeId,
    lotNumber
  ]);
};

// Delete a lot
const deleteLot = async (lotNumber) => {
  const [result] = await db.query('DELETE FROM lot WHERE lotNumber = ?', [lotNumber]);
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

module.exports = {
  generateLotNumber,
  getAllLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot,
  getAvailableLotsForBroker,
  getAvailableLots,
  submitBrokerValuation
};
