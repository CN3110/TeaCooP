const db = require("../config/database");

// Fetch all transport requests
exports.getAllTransportRequests = async (req, res) => {
  try {
    const query = `
      SELECT tr.*, dr.delivery_routeName 
      FROM transport_request tr
      LEFT JOIN delivery_route dr ON tr.delivery_routeId = dr.delivery_routeId
    `;
    const [transportRequests] = await db.query(query);
    res.status(200).json(transportRequests);
  } catch (error) {
    console.error("Error fetching transport requests:", error);
    res.status(500).json({ error: "Failed to fetch transport requests" });
  }
};

// Fetch a transport request by ID
exports.getTransportRequestById = async (req, res) => {
  const { requestId } = req.params;
  try {
    const query = "SELECT * FROM transport_request WHERE requestId = ?";
    const [transportRequest] = await db.query(query, [requestId]);
    if (transportRequest.length === 0) {
      return res.status(404).json({ error: "Transport request not found" });
    }
    res.status(200).json(transportRequest[0]);
  } catch (error) {
    console.error("Error fetching transport request:", error);
    res.status(500).json({ error: "Failed to fetch transport request" });
  }
};

// Add a new transport request
exports.addTransportRequest = async (req, res) => {
  const { supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, delivery_routeId } = req.body;

  if (!supplierId || !reqDate || !reqTime || !reqNumberOfSacks || !reqWeight || !reqAddress || !delivery_routeId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const query = `
      INSERT INTO transport_request 
      (supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, delivery_routeId) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [
      supplierId,
      reqDate,
      reqTime,
      reqNumberOfSacks,
      reqWeight,
      reqAddress,
      delivery_routeId,
    ]);

    res.status(201).json({ message: "Transport request added successfully", requestId: result.insertId });
  } catch (error) {
    console.error("Error adding transport request:", error);
    res.status(500).json({ error: "Failed to add transport request" });
  }
};

// Update a transport request
exports.updateTransportRequest = async (req, res) => {
  const { requestId } = req.params;
  const { reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, delivery_routeId } = req.body;

  if (!reqDate || !reqTime || !reqNumberOfSacks || !reqWeight || !reqAddress || !delivery_routeId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const query = `
      UPDATE transport_request 
      SET reqDate = ?, reqTime = ?, reqNumberOfSacks = ?, reqWeight = ?, reqAddress = ?, delivery_routeId = ?
      WHERE requestId = ?
    `;
    await db.query(query, [
      reqDate,
      reqTime,
      reqNumberOfSacks,
      reqWeight,
      reqAddress,
      delivery_routeId,
      requestId,
    ]);

    res.status(200).json({ message: "Transport request updated successfully" });
  } catch (error) {
    console.error("Error updating transport request:", error);
    res.status(500).json({ error: "Failed to update transport request" });
  }
};

// Update transport request status
exports.updateTransportRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status, driverId } = req.body;

  if (!status || !driverId) {
    return res.status(400).json({ error: "Missing status or driverId field" });
  }

  try {
    const query = "UPDATE transport_request SET status = ?, driverId = ? WHERE requestId = ?";
    await db.query(query, [status, driverId, requestId]);

    res.status(200).json({ message: "Status and driverId updated successfully" });
  } catch (error) {
    console.error("Error updating transport request status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};


// Delete a transport request
exports.deleteTransportRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const query = "DELETE FROM transport_request WHERE requestId = ?";
    await db.query(query, [requestId]);
    res.status(200).json({ message: "Transport request deleted successfully" });
  } catch (error) {
    console.error("Error deleting transport request:", error);
    res.status(500).json({ error: "Failed to delete transport request" });
  }
};
