const db = require("../config/database");

class TransportRequest {
  static async getAll() {
    const query = "SELECT * FROM transport_request";
    const [results] = await db.query(query);
    return results;
  }

  static async getById(requestId) {
    const query = "SELECT * FROM transport_request WHERE requestId = ?";
    const [results] = await db.query(query, [requestId]);
    return results;
  }

  static async add({ supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress }) {
    const query =
      "INSERT INTO transport_request (supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress]);
    return result;
  }

  static async update(requestId, { reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress }) {
    const query =
      "UPDATE transport_request SET reqDate = ?, reqTime = ?, reqNumberOfSacks = ?, reqWeight = ?, reqAddress = ? WHERE requestId = ?";
    const [result] = await db.query(query, [reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, requestId]);
    return result;
  }

  static async delete(requestId) {
    const query = "DELETE FROM transport_request WHERE requestId = ?";
    const [result] = await db.query(query, [requestId]);
    return result;
  }
}

module.exports = TransportRequest;