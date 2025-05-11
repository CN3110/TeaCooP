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

//get supplier wise raw delivery reocrds
exports.getRawTeaRecordsOfSupplier = async (req, res) => {
  try {
    const data = await Report.getRawTeaRecordsOfSupplier();
    res.json(data);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
