// Updated Report Controller with fixed implementation
const Report = require('../models/report');


//get all the raw tea records
exports.getRawTeaReport = async (req, res) => {
  try {
    const data = await Report.getAllRawTeaRecords();
    res.json(data);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all daily tea delivery summaries
exports.getAllDailyTeaDeliverySummaries = async (req, res) => {
  try {
    const data = await Report.getAllDailyTeaDeliverySummaries();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching daily tea delivery summaries:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};


// Get supplier-wise raw tea delivery records
exports.getRawTeaRecordsOfSupplier = async (req, res) => {
  try {
    const { from, to, transport } = req.query;

    // Call the updated model function with proper defaults
    const data = await Report.getRawTeaRecordsOfSupplier(
      from || null,
      to || null,
      transport || 'All'
    );

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching supplier raw tea records:', err);
    res.status(500).json({ error: 'Failed to fetch supplier report' });
  }
};

exports.getDriverReport = async (req, res) => {
  const { route, startDate, endDate } = req.query;

  try {
    const result = await Report.getDriverReport(route, startDate, endDate);
    res.json(result); // Returns both tables
  } catch (error) {
    console.error("Error generating driver report:", error);
    res.status(500).json({ error: "Failed to fetch driver report." });
  }
};

exports.getTeaProductionReport = async (req, res) => {
  try {
    // Destructure query parameters first
    const { startDate, endDate } = req.query;
    
    // Get report data with the dates (they might be undefined)
    const reportData = await Report.getTeaProductionReport(startDate, endDate);
    
    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Error fetching tea production report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tea production report',
      error: error.message,
    });
  }
};

exports.getLotSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;
    const lots = await Report.getLotSummaryReport(startDate, endDate, status);
    res.status(200).json(lots);
  } catch (error) {
    console.error('Error fetching lot summary report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSoldLotsReport = async (req, res) => {
  try {
    const { startDate, endDate, brokerId } = req.query;
    const results = await Report.getSoldLotsReport(startDate, endDate, brokerId);
    res.json(results);
  } catch (error) {
    console.error("Error fetching sold lots report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};