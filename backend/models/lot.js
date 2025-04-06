const db = require('../config/database');

// Get all lots
async function getAllLots() {
  const [rows] = await db.query('SELECT * FROM lot');
  return rows;
}

// Get a lot by lotNumber
async function getLotById(id) {
  const [rows] = await db.query('SELECT * FROM lot WHERE lotNumber = ?', [id]);
  return rows[0];
}

// Create a new lot
async function createLot(data) {
  const {
    lotNumber, invoiceNumber, manufacturingDate, teaGrade,
    noOfBags, netWeight, totalNetWeight, valuationPrice
  } = data;

  await db.query(`
    INSERT INTO lot (lotNumber, invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [lotNumber, invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice]
  );
}

// Update lot
async function updateLot(id, data) {
  const {
    invoiceNumber, manufacturingDate, teaGrade,
    noOfBags, netWeight, totalNetWeight, valuationPrice
  } = data;

  const [result] = await db.query(`
    UPDATE lot SET invoiceNumber=?, manufacturingDate=?, teaGrade=?, noOfBags=?, netWeight=?, totalNetWeight=?, valuationPrice=?
    WHERE lotNumber=?`, 
    [invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice, id]
  );

  return result.affectedRows;
}

// Delete lot
async function deleteLot(id) {
  const [result] = await db.query('DELETE FROM lot WHERE lotNumber = ?', [id]);
  return result.affectedRows;
}

// Get only available lots
async function getAvailableLots() {
  const [rows] = await db.query("SELECT * FROM lot WHERE status = 'available'");
  return rows;
}

// Submit broker valuation
async function submitBrokerValuation(lotNumber, brokerId, valuationPrice) {
  await db.query(
    `INSERT INTO broker_valuation (lotNumber, brokerId, valuationPrice) VALUES (?, ?, ?)`,
    [lotNumber, brokerId, valuationPrice]
  );

  await db.query(
    `UPDATE lot SET status = 'valuation_pending' WHERE lotNumber = ?`,
    [lotNumber]
  );
}

module.exports = {
  getAllLots,
  getLotById,
  createLot,
  updateLot,
  deleteLot,
  getAvailableLots,
  submitBrokerValuation,
};
