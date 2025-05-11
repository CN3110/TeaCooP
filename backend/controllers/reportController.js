const Report = require('../models/report');

exports.getRawTeaReport = async (req, res) => {
  try {
    const data = await Report.getAllRawTeaRecords();
    res.json(data);
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
