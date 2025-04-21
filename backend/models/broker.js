const db = require("../config/database");

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

// Create a new broker
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
  notes 
}) => {
  const query = `
    INSERT INTO broker 
    (brokerId, brokerName, brokerContactNumber, brokerEmail, brokerCompanyName, 
     brokerCompanyContact, brokerCompanyEmail, brokerCompanyAddress, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
    notes
  ]);
};

// Get all brokers with their details
const getAllBrokers = async () => {
  const [brokers] = await db.query("SELECT * FROM broker");
  return brokers;
}; 

// Get broker and their details by brokerId
const getBrokerById = async (brokerId) => {
  const [brokerRows] = await db.query(
    "SELECT * FROM broker WHERE brokerId = ?",
    [brokerId]
  );

  if (brokerRows.length === 0) return null;

  return {
    ...brokerRows[0],
  };
};

// Update broker details by brokerId
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

module.exports = {
  generateBrokerId,
  createBroker,
  getAllBrokers,
  getBrokerById,
  updateBroker,
};