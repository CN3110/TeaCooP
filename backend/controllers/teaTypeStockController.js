const TeaTypeStock = require("../models/teaTypeStock");

exports.getAllTeaTypeStocks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit === 'all' ? null : (parseInt(req.query.limit) || 10);
    const offset = (page - 1) * (limit || 0);

    const { stocks, total } = await TeaTypeStock.getAllTeaTypeStocks(limit, offset);

    res.status(200).json({
      stocks,
      pagination: {
        total,
        page,
        limit: limit || total,
        pages: limit ? Math.ceil(total / limit) : 1
      }
    });
  } catch (error) {
    console.error("Error fetching tea type stocks:", error);
    res.status(500).json({ error: "Failed to fetch tea type stock records" });
  }
};

exports.createTeaTypeStock = async (req, res) => {
  const { teaTypeId, weightInKg, productionDate, createdBy } = req.body;

  if (!teaTypeId || !productionDate || !weightInKg) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await TeaTypeStock.createTeaTypeStock(
      Number(teaTypeId),
      Number(weightInKg),
      productionDate,
      createdBy
    );
    res.status(201).json({ message: "Tea type stock created successfully" });
  } catch (error) {
    console.error("Error creating tea type stock:", error);
    res.status(500).json({ error: "Failed to create tea type stock" });
  }
};

exports.getTeaTypeStockById = async (req, res) => {
  const { stockId } = req.params;

  try {
    const stock = await TeaTypeStock.getTeaTypeStockById(stockId);

    if (stock.length === 0) {
      return res.status(404).json({ error: "Tea type stock not found" });
    }

    res.status(200).json(stock[0]);
  } catch (error) {
    console.error("Error fetching tea type stock:", error);
    res.status(500).json({ error: "Failed to fetch tea type stock" });
  }
};

exports.updateTeaTypeStock = async (req, res) => {
  const { stockId } = req.params;
  const { weightInKg, productionDate } = req.body;

  if (!weightInKg || !productionDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await TeaTypeStock.updateTeaTypeStock(stockId, Number(weightInKg), productionDate);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "Tea type stock not found" });
    }

    res.status(200).json({ message: "Tea type stock updated successfully" });
  } catch (error) {
    console.error("Error updating tea type stock:", error);
    res.status(500).json({ error: "Failed to update tea type stock" });
  }
};

exports.adjustTeaTypeStock = async (req, res) => {
  const { stockId } = req.params;
  const { adjustment } = req.body;

  if (adjustment === undefined) {
    return res.status(400).json({ error: "Adjustment value is required" });
  }

  try {
    const result = await TeaTypeStock.adjustTeaTypeStock(stockId, Number(adjustment));

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "Tea type stock not found" });
    }

    res.status(200).json({ message: "Tea type stock adjusted successfully" });
  } catch (error) {
    console.error("Error adjusting tea type stock:", error);
    res.status(500).json({ error: "Failed to adjust tea type stock" });
  }
};

exports.deleteTeaTypeStock = async (req, res) => {
  const { stockId } = req.params;

  try {
    const result = await TeaTypeStock.deleteTeaTypeStock(stockId);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ error: "Tea type stock not found" });
    }

    res.status(200).json({ message: "Tea type stock deleted successfully" });
  } catch (error) {
    console.error("Error deleting tea type stock:", error);
    res.status(500).json({ error: "Failed to delete tea type stock" });
  }
};