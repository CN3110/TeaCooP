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
      valuationPrice, teaTypeId
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await db.query(query, [
    lotNumber,         
    manufacturingDate,  // 2
    noOfBags,           // 3
    netWeight,          // 4
    totalNetWeight,     // 5
    valuationPrice,     // 6
    teaTypeId           // 7
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
      valuationPrice = ?
      teaTypeId = ?,
    WHERE lotNumber = ?
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


// Delete a lot
const deleteLot = async (lotNumber) => {
  const [result] = await db.query('DELETE FROM lot WHERE lotNumber = ?', [lotNumber]);
  return result.affectedRows > 0;
};

// Get lots marked as available
const getAvailableLots = async () => {
  const [lots] = await db.query("SELECT * FROM lot WHERE status = 'available'");
  return lots;
};

// Submit a broker valuation
const submitBrokerValuation = async (lotNumber, brokerId, valuationPrice) => {
  await db.query(
    `INSERT INTO broker_valuation (lotNumber, brokerId, valuationPrice) VALUES (?, ?, ?)`,
    [lotNumber, brokerId, valuationPrice]
  );

  await db.query(
    `UPDATE lot SET status = 'valuation_pending' WHERE lotNumber = ?`,
    [lotNumber]
  );
};

module.exports = {
  generateLotNumber,
  getAllLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot,
  getAvailableLots,
  submitBrokerValuation
};
