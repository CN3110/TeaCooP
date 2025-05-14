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

// Updated to use async/await and properly pass date filters to model
exports.getRawTeaRecordsOfDriver = async (req, res) => {
  try {
    const { from, to, driverId } = req.query;
    
    // Call the updated model function with proper parameters
    const data = await Report.getRawTeaRecordsOfDriver(
      from || null, 
      to || null,
      driverId || 'All'
    );
    
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching driver raw tea records:', err);
    res.status(500).json({ error: 'Failed to fetch driver report' });
  }
};