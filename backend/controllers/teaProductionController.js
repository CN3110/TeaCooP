const db = require("../config/database");

// Fetch all tea production records with pagination
exports.getAllTeaProductions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = req.query.limit === 'all' ? null : (parseInt(req.query.limit) || 10);
    const offset = (page - 1) * (limit || 0);

    let query = `
      SELECT p.*, e.employeeName as employeeName
      FROM tea_production p
      JOIN employee e ON p.createdBy = e.employeeId
      ORDER BY p.productionDate DESC, p.created_at DESC
    `;

    if (limit !== null) {
      query += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    const [productions] = await db.query(query);

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM tea_production');

    res.status(200).json({
      productions,
      pagination: {
        total: countResult[0].total,
        page,
        limit: limit || countResult[0].total,
        pages: limit ? Math.ceil(countResult[0].total / limit) : 1
      }
    });
  } catch (error) {
    console.error("Error fetching tea productions:", error);
    res.status(500).json({ error: "Failed to fetch tea production records" });
  }
};


// Add a new tea production record
// Add a new tea production record
exports.addTeaProduction = async (req, res) => {
  const { productionDate, weightInKg, createdBy, rawTeaUsed } = req.body;

  // Validate required fields
  if (!productionDate || !weightInKg || !createdBy || !rawTeaUsed) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert production record with all required fields
    const [result] = await db.query(
      "INSERT INTO tea_production (productionDate, weightInKg, createdBy, rawTeaUsed) VALUES (?, ?, ?, ?)",
      [productionDate, weightInKg, createdBy, rawTeaUsed] // Added rawTeaUsed here
    );
    
    res.status(201).json({ 
      message: "Production record added successfully",
      productionId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding tea production:", error);
    res.status(500).json({ 
      error: "Failed to add tea production record",
      details: error.message 
    });
  }
};

// Fetch a single tea production record by ID
exports.getTeaProductionById = async (req, res) => {
  const { productionId } = req.params;

  try {
    const [production] = await db.query(
      `SELECT p.*, e.employeeName as employeeName
       FROM tea_production p
       JOIN employee e ON p.createdBy = e.employeeId
       WHERE p.productionId = ?`,
      [productionId]
    );

    if (production.length === 0) {
      return res.status(404).json({ error: "Production record not found" });
    }

    
    res.status(200).json(production[0]);
  } catch (error) {
    console.error("Error fetching tea production:", error);
    res.status(500).json({ error: "Failed to fetch tea production record" });
  }
};

// Fetch tea production records by date
exports.getTeaProductionByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const [productions] = await db.query(
      `SELECT p.*, e.employeeName as employeeName
       FROM tea_production p
       JOIN employee e ON p.createdBy = e.employeeId
       WHERE p.productionDate = ?
       ORDER BY p.created_at DESC`,
      [date]
    );

   res.status(200).json(productions);
  } catch (error) {
    console.error("Error fetching tea productions by date:", error);
    res.status(500).json({ error: "Failed to fetch tea production records by date" });
  }
};

// Update a tea production record
exports.updateTeaProduction = async (req, res) => {
  const { productionId } = req.params;
  const { productionDate, weightInKg } = req.body;

  // Validate required fields
  if (!productionDate || !weightInKg) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "UPDATE tea_production SET productionDate = ?, weightInKg = ? WHERE productionId = ?",
      [productionDate, weightInKg, productionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Production record not found" });
    }

    res.status(200).json({ 
      message: "Production record updated successfully",
    
    });
  } catch (error) {
    console.error("Error updating tea production:", error);
    res.status(500).json({ error: "Failed to update tea production record" });
  }
};

// Delete a tea production record
exports.deleteTeaProduction = async (req, res) => {
  const { productionId } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM tea_production WHERE productionId = ?",
      [productionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Production record not found" });
    }

    res.status(200).json({ message: "Production record deleted successfully" });
  } catch (error) {
    console.error("Error deleting tea production:", error);
    res.status(500).json({ error: "Failed to delete tea production record" });
  }
};

// Get total tea production with optional date filters
exports.getTotalTeaProduction = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = "SELECT SUM(weightInKg) as totalProduction FROM tea_production";
    const params = [];
    
    // If date filters are provided, add them to the query
    if (startDate || endDate) {
      query += " WHERE ";
      
      if (startDate) {
        query += "productionDate >= ?";
        params.push(startDate);
      }
      
      if (startDate && endDate) {
        query += " AND ";
      }
      
      if (endDate) {
        query += "productionDate <= ?";
        params.push(endDate);
      }
    } else {
      // If no dates provided, default to current month
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      query += " WHERE productionDate >= ? AND productionDate <= ?";
      params.push(
        firstDayOfMonth.toISOString().split('T')[0],
        lastDayOfMonth.toISOString().split('T')[0]
      );
    }
    
    const [result] = await db.query(query, params);
    
    res.status(200).json({
      totalProduction: result[0].totalProduction || 0,
      period: startDate && endDate ? 'filtered' : 'currentMonth'
    });
  } catch (error) {
    console.error("Error fetching total tea production:", error);
    res.status(500).json({ error: "Failed to fetch total tea production" });
  }
};