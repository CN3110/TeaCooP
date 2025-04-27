const db = require("../config/database");

// Fetch all tea production records with pagination
exports.getAllTeaProductions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = req.query.limit === 'all' ? null : (parseInt(req.query.limit) || 10);
    const offset = (page - 1) * (limit || 0);

    let query = `
      SELECT p.*, t.teaTypeName, e.employeeName as employeeName
      FROM tea_production p
      JOIN teatype t ON p.teaTypeId = t.teaTypeId
      JOIN employee e ON p.createdBy = e.employeeId
      ORDER BY p.productionDate DESC, p.created_at DESC
    `;

    if (limit !== null) {
      query += ` LIMIT ${limit} OFFSET ${offset}`;
    }

    const [productions] = await db.query(query);

    // Calculate packet count for dust tea
    productions.forEach(record => {
      if (record.teaTypeName.toLowerCase() === 'dust tea') {
        record.packetCount = Math.floor(record.weightInKg * 1000 / 400);
      } else {
        record.packetCount = null;
      }
    });

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
exports.addTeaProduction = async (req, res) => {
  const { teaTypeId, productionDate, weightInKg, createdBy } = req.body;

  // Validate required fields
  if (!teaTypeId || !productionDate || !weightInKg || !createdBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert production record
    const [result] = await db.query(
      "INSERT INTO tea_production (teaTypeId, productionDate, weightInKg, createdBy) VALUES (?, ?, ?, ?)",
      [teaTypeId, productionDate, weightInKg, createdBy]
    );
    
    // Get the tea type name to determine if it's dust tea
    const [teaType] = await db.query("SELECT teaTypeName FROM teatype WHERE teaTypeId = ?", [teaTypeId]);
    
    // Calculate packet count for dust tea
    let packetCount = null;
    if (teaType.length > 0 && teaType[0].teaTypeName.toLowerCase() === 'dust tea') {
      packetCount = Math.floor(weightInKg * 1000 / 400); // Convert kg to g and divide by 400g
    }
    
    res.status(201).json({ 
      message: "Production record added successfully",
      productionId: result.insertId,
      packetCount
    });
  } catch (error) {
    console.error("Error adding tea production:", error);
    res.status(500).json({ error: "Failed to add tea production record" });
  }
};

// Fetch a single tea production record by ID
exports.getTeaProductionById = async (req, res) => {
  const { productionId } = req.params;

  try {
    const [production] = await db.query(
      `SELECT p.*, t.teaTypeName, e.employeeName as employeeName
       FROM tea_production p
       JOIN teatype t ON p.teaTypeId = t.teaTypeId
       JOIN employee e ON p.createdBy = e.employeeId
       WHERE p.productionId = ?`,
      [productionId]
    );

    if (production.length === 0) {
      return res.status(404).json({ error: "Production record not found" });
    }

    // Calculate packet count for dust tea
    if (production[0].teaTypeName.toLowerCase() === 'dust tea') {
      production[0].packetCount = Math.floor(production[0].weightInKg * 1000 / 400);
    } else {
      production[0].packetCount = null;
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
      `SELECT p.*, t.teaTypeName, e.employeeName as employeeName
       FROM tea_production p
       JOIN teatype t ON p.teaTypeId = t.teaTypeId
       JOIN employee e ON p.createdBy = e.employeeId
       WHERE p.productionDate = ?
       ORDER BY p.created_at DESC`,
      [date]
    );

    // Calculate packet count for dust tea
    productions.forEach(record => {
      if (record.teaTypeName.toLowerCase() === 'dust tea') {
        record.packetCount = Math.floor(record.weightInKg * 1000 / 400);
      } else {
        record.packetCount = null;
      }
    });

    res.status(200).json(productions);
  } catch (error) {
    console.error("Error fetching tea productions by date:", error);
    res.status(500).json({ error: "Failed to fetch tea production records by date" });
  }
};

// Update a tea production record
exports.updateTeaProduction = async (req, res) => {
  const { productionId } = req.params;
  const { teaTypeId, productionDate, weightInKg } = req.body;

  // Validate required fields
  if (!teaTypeId || !productionDate || !weightInKg) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "UPDATE tea_production SET teaTypeId = ?, productionDate = ?, weightInKg = ? WHERE productionId = ?",
      [teaTypeId, productionDate, weightInKg, productionId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Production record not found" });
    }

    // Get the tea type name to determine if it's dust tea
    const [teaType] = await db.query("SELECT teaTypeName FROM teatype WHERE teaTypeId = ?", [teaTypeId]);
    
    // Calculate packet count for dust tea
    let packetCount = null;
    if (teaType.length > 0 && teaType[0].teaTypeName.toLowerCase() === 'dust tea') {
      packetCount = Math.floor(weightInKg * 1000 / 400);
    }

    res.status(200).json({ 
      message: "Production record updated successfully",
      packetCount
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