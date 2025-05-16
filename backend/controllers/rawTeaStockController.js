const db = require("../config/database");

// In rawTeaStockController.js

// Calculate initial raw tea stock from deliveries
exports.calculateInitialRawTeaStock = async () => {
  try {
    const [deliveries] = await db.query(`
      SELECT COALESCE(SUM(greenTeaLeaves), 0) as totalGreenTea, 
             COALESCE(SUM(randalu), 0) as totalRandalu 
      FROM delivery
    `);

    const totalRawTea = parseFloat(deliveries[0].totalGreenTea) + parseFloat(deliveries[0].totalRandalu);

    await db.query(`UPDATE raw_tea_stock SET stockLevel = ?`, [totalRawTea]);

    return {
      success: true,
      stockLevel: totalRawTea
    };
  } catch (error) {
    console.error("Error calculating raw tea stock:", error);
    return {
      success: false,
      error: "Failed to calculate raw tea stock"
    };
  }
};

// Get current raw tea stock
// In rawTeaStockController.js
exports.calculateInitialRawTeaStock = async () => {
  try {
    console.log("Starting stock calculation...");
    
    // First log the query we're about to run
    const query = `
      SELECT COALESCE(SUM(greenTeaLeaves), 0) as totalGreenTea, 
             COALESCE(SUM(randalu), 0) as totalRandalu 
      FROM delivery
    `;
    console.log("Running query:", query);

    const [deliveries] = await db.query(query);
    console.log("Query results:", deliveries);

    const totalRawTea = parseFloat(deliveries[0].totalGreenTea) + parseFloat(deliveries[0].totalRandalu);
    console.log("Calculated total raw tea:", totalRawTea);

    await db.query(`UPDATE raw_tea_stock SET stockLevel = ?`, [totalRawTea]);
    console.log("Stock updated successfully");

    return {
      success: true,
      stockLevel: totalRawTea
    };
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      sql: error.sql
    });
    return {
      success: false,
      error: "Failed to calculate raw tea stock"
    };
  }
};

exports.calculateInitialRawTeaStockEndpoint = async (req, res) => {
    const result = await exports.calculateInitialRawTeaStock();
    if (result.success) {
        return res.status(200).json({
            message: "Raw tea stock calculated successfully",
            stockLevel: result.stockLevel
        });
    } else {
        return res.status(500).json({ error: result.error });
    }
};