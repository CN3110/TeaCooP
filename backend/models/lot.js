const db = require('../config/database');

// Generate a new unique lot number
const generateLotNumber = async () => {
  const query = `
    SELECT MAX(CAST(SUBSTRING(lotNumber, 2) AS UNSIGNED)) AS lastId 
    FROM lot
  `;
  const [results] = await db.query(query);
  const lastId = results[0]?.lastId || 1000;
  const newId = lastId + 1;
  return `L${newId}`;
};

// Get all lots
const getAllLots = async () => {
  const [lots] = await db.query('SELECT * FROM lot');
  return lots;
};

// Get a lot by lotNumber
const getLotById = async (lotNumber) => {
  const [lots] = await db.query('SELECT * FROM lot WHERE lotNumber = ?', [lotNumber]);
  if (lots.length === 0) return null;
  return lots[0];
};

// Create a new lot
const createLot = async ({
  lotNumber,
  invoiceNumber,
  manufacturingDate,
  teaGrade,
  noOfBags,
  netWeight,
  totalNetWeight,
  valuationPrice
}) => {
  const query = `
    INSERT INTO lot (
      lotNumber, invoiceNumber, manufacturingDate, teaGrade,
      noOfBags, netWeight, totalNetWeight, valuationPrice, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'available')
  `;
  await db.query(query, [
    lotNumber,
    invoiceNumber,
    manufacturingDate,
    teaGrade,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice
  ]);
};

// Update lot
const updateLot = async (lotNumber, lotDetails) => {
  const query = `
    UPDATE lot 
    SET invoiceNumber=?, 
        manufacturingDate=?, 
        teaGrade=?, 
        noOfBags=?, 
        netWeight=?, 
        totalNetWeight=?, 
        valuationPrice=?
    WHERE lotNumber=?
  `;

  await db.query(query, [
    lotDetails.invoiceNumber,
    lotDetails.manufacturingDate,
    lotDetails.teaGrade,
    lotDetails.noOfBags,
    lotDetails.netWeight,
    lotDetails.totalNetWeight,
    lotDetails.valuationPrice,
    lotNumber
  ]);
};

// Delete lot
const deleteLot = async (id) => {
  const [result] = await db.query('DELETE FROM lot WHERE lotNumber = ?', [id]);
  return result.affectedRows;
};

// Get only available lots
const getAvailableLots = async () => {
  const [rows] = await db.query("SELECT * FROM lot WHERE status = 'available'");
  return rows;
};

// Submit broker valuation
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
  getAllLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot,
  getAvailableLots,
  submitBrokerValuation,
  generateLotNumber,
};
