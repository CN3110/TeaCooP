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

exports.getRawTeaRecordsOfDriver = (req, res) => {
  const { driverId } = req.query;

  // Default to null if not provided
  
  const driver = driverId || 'All';

  Report.getRawTeaRecordsOfDriver(driver, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err });
    }

    res.status(200).json(results);
  });
};
