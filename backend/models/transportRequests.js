const db = require("../config/database");

class TransportRequest {
  static async getAll() {
    const query = `
  SELECT tr.*, dr.delivery_routeName 
  FROM transport_request tr
  LEFT JOIN delivery_route dr ON tr.delivery_routeId = dr.delivery_routeId
`;

    const [results] = await db.query(query);
    return results;
  }

  static async getById(requestId) {
    const query = "SELECT * FROM transport_request WHERE requestId = ?";
    const [results] = await db.query(query, [requestId]);
    return results;
  }

  static async add({ supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, delivery_routeId }) {
    const query =
      "INSERT INTO transport_request (supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, delivery_routeId) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [supplierId, reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, delivery_routeId]);
    return result;
  }

  static async update(requestId, { reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, delivery_routeId }) {
    const query =
      "UPDATE transport_request SET reqDate = ?, reqTime = ?, reqNumberOfSacks = ?, reqWeight = ?, reqAddress = ? delivery_routeId = ? WHERE requestId = ?";
    const [result] = await db.query(query, [reqDate, reqTime, reqNumberOfSacks, reqWeight, reqAddress, requestId, delivery_routeId]);
    return result;
  }

  static async delete(requestId) {
    const query = "DELETE FROM transport_request WHERE requestId = ?";
    const [result] = await db.query(query, [requestId]);
    return result;
  }
}

module.exports = TransportRequest;