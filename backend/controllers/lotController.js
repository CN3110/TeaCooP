const db = require("../config/database");

//Fetch all lots
exports.getAllLots = async (req, res) => {
  try {
    const [lots] = await db.query("SELECT * FROM lot");
    res.status(200).json(lots);
  } catch (error) {
    console.error("Error fetching lot records:", error);
    res.status(500).json({ error: "Failed to fetch lot records" });
  }
};

//add new lot
exports.addLot = async (req, res) => {
  const {
    lotNumber,
    invoiceNumber,
    manufacturingDate,
    teaGrade,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice,
  } = req.body;

  if (
    !lotNumber ||
    !invoiceNumber ||
    !manufacturingDate ||
    !teaGrade ||
    !noOfBags ||
    !netWeight ||
    !totalNetWeight ||
    !valuationPrice
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [lots] = await db.query(
      "INSERT INTO lot (lotNumber, invoiceNumber, manufacturingDate, teaGrade, noOfBags, netWeight, totalNetWeight, valuationPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        lotNumber,
        invoiceNumber,
        manufacturingDate,
        teaGrade,
        noOfBags,
        netWeight,
        totalNetWeight,
        valuationPrice,
      ]
    );
    res.status(201).json({ message: "Lot added successfully" });
  } catch (error) {
    console.error("Error adding Lot record:", error);
    res.status(500).json({ error: "Failed to add Lot" });
  }
};

//fetch a single lot by Lot Number
exports.getLotByLotNumber = async (req, res) => {
  const { lotNumber } = req.params;
  
    try {
      const [lot] = await db.query("SELECT * FROM lot WHERE lotNumber = ?", [lotNumber]);
  
      if (lot.length === 0) {
        return res.status(404).json({ error: "Lot record not found" });
      }
  
      res.status(200).json(lot[0]);
    } catch (error) {
      console.error("Error fetching lot record:", error);
      res.status(500).json({ error: "Failed to fetch lot record" });
    }
  };
  

//update a lot record by Lot number 
exports.updateLot = async (req, res) => {
  const {
    lotNumber,
    invoiceNumber,
    manufacturingDate,
    teaGrade,
    noOfBags,
    netWeight,
    totalNetWeight,
    valuationPrice,
  } = req.body;

  if (
    !lotNumber ||
    !invoiceNumber ||
    !manufacturingDate ||
    !teaGrade ||
    !noOfBags ||
    !netWeight ||
    !totalNetWeight ||
    !valuationPrice
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [lots] = await db.query(
      "UPDATE lot SET lotNumber = ?, invoiceNumber = ?, manufacturingDate = ?, teaGrade = ?, noOfBags = ?, netWeight = ?, totalNetWeight = ?, valuationPrice = ?",
      [ 
        lotNumber,
        invoiceNumber,
        manufacturingDate,
        teaGrade,
        noOfBags,
        netWeight,
        totalNetWeight,
        valuationPrice,
      ]
    );
    res.status(200).json({ message: "Lot record updated successfully" });
  } catch (error) {
    console.error("Error updating Lot record:", error);
    res.status(500).json({ error: "Failed to update Lot record" });
  }
};

// Delete a lot record by lot number
exports.deleteLot = async (req, res) => {
  const {lotNumber} = req.params;

  try {
    await db.query("DELETE FROM lot WHERE lotNumber = ?", [lotNumber]);
    res.status(200).json({ message: "Lot record deleted successfully" });
  } catch (error) {
    console.error("Error deleting lot record:", error);
    res.status(500).json({ error: "Failed to delete lot record" });
  }
};
