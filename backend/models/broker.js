const db = require("../config/database");
const bcrypt = require("bcrypt");

// Generate a new unique broker ID
const generateBrokerId = async () => {
  const query = `
    SELECT MAX(CAST(SUBSTRING(brokerId, 2) AS UNSIGNED)) AS lastId 
    FROM broker
  `;
  const [results] = await db.query(query);
  const lastId = results[0].lastId || 100;
  return `B${lastId + 1}`;
};

// Create a new broker with hashed passcode
const createBroker = async ({
  brokerId,
  brokerName,
  brokerContact,
  brokerEmail,
  brokerCompanyName,
  brokerCompanyContact,
  brokerCompanyEmail,
  brokerCompanyAddress,
  status,
  notes,
  addedByEmployeeId,
  passcode,
}) => {
  const hashedPasscode = await bcrypt.hash(passcode, 10);
  const query = `
    INSERT INTO broker 
    (brokerId, brokerName, brokerContactNumber, brokerEmail, brokerCompanyName, 
     brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress, status, notes, addedByEmployeeId, passcode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await db.query(query, [
    brokerId,
    brokerName,
    brokerContact,
    brokerEmail,
    brokerCompanyName,
    brokerCompanyContact,
    brokerCompanyEmail,
    brokerCompanyAddress,
    status,
    notes,
    addedByEmployeeId,
    hashedPasscode
  ]);
};

// Verify broker credentials (for login)
const verifyBrokerCredentials = async (brokerId, passcode) => {
  const [brokers] = await db.query(
    "SELECT * FROM broker WHERE brokerId = ? AND status = 'active'",
    [brokerId]
  );
  if (brokers.length === 0) return null;

  const broker = brokers[0];
  const isValid = await bcrypt.compare(passcode, broker.passcode);
  return isValid ? broker : null;
};

// Update broker passcode
const updateBrokerPassword = async (brokerId, newPasscode) => {
  const hashed = await bcrypt.hash(newPasscode, 10);
  await db.query("UPDATE broker SET passcode = ? WHERE brokerId = ?", [hashed, brokerId]);
};

// Get all brokers
const getAllBrokers = async () => {
  const [brokers] = await db.query("SELECT * FROM broker");
  return brokers;
};

// Get broker by ID
const getBrokerById = async (brokerId) => {
  const [rows] = await db.query(
    "SELECT * FROM broker WHERE brokerId = ?",
    [brokerId]
  );
  return rows.length ? rows[0] : null;
};

// Update broker details
const updateBroker = async (brokerId, brokerDetails) => {
  const query = `
    UPDATE broker 
    SET brokerName = ?, 
        brokerContactNumber = ?, 
        brokerEmail = ?, 
        brokerCompanyName = ?, 
        brokerCompanyContact = ?, 
        brokerCompanyEmail = ?, 
        brokerCompanyAddress = ?, 
        status = ?, 
        notes = ?
    WHERE brokerId = ?
  `;
  await db.query(query, [
    brokerDetails.brokerName,
    brokerDetails.brokerContact,
    brokerDetails.brokerEmail,
    brokerDetails.brokerCompanyName,
    brokerDetails.brokerCompanyContact,
    brokerDetails.brokerCompanyEmail,
    brokerDetails.brokerCompanyAddress,
    brokerDetails.status,
    brokerDetails.notes,
    brokerId,
  ]);
};

//update broker profile - by the broker
const updateBrokerProfile = async (brokerId, brokerDetails) => {
  const query = `
    UPDATE broker 
    SET brokerName = ?, 
        brokerContactNumber = ?, 
        brokerEmail = ?, 
        brokerCompanyName = ?, 
        brokerCompanyContact = ?, 
        brokerCompanyEmail = ?, 
        brokerCompanyAddress = ?
    WHERE brokerId = ?
  `;
  await db.query(query, [
    brokerDetails.brokerName,
    brokerDetails.brokerContact,
    brokerDetails.brokerEmail,
    brokerDetails.brokerCompanyName,
    brokerDetails.brokerCompanyContact,
    brokerDetails.brokerCompanyEmail,
    brokerDetails.brokerCompanyAddress,
    brokerId
  ]);
};


module.exports = {
  generateBrokerId,
  createBroker,
  verifyBrokerCredentials,
  updateBrokerPassword,
  getAllBrokers,
  getBrokerById,
  updateBroker,
  updateBrokerProfile,
};
