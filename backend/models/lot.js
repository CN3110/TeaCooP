const db = require("../config/database");

class Lot {
  static async addLot(lotNumber, invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice) {
    if (!lotNumber || !invoiceNumber || !manufacturingDate || !teaGrade || !noOfBags || !netWeight || !totalNetWeight || !valuationPrice) {
      throw new Error("Missing required fields");
    }

    const query = `
      INSERT INTO lot(lotNumber, invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await db.query(query, [lotNumber, invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice]);
    return result;
  }
}

module.exports = Lot;