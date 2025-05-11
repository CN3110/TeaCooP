const Report = require('../models/report');

// Get raw tea delivery report (filtered by date and route)
exports.getRawTeaReport = (req, res) => {
  const { fromDate, toDate, route } = req.query;

  if (!fromDate || !toDate || !route) {
    return res.status(400).json({ error: 'fromDate, toDate, and route are required' });
  }

  Report.getRawTeaReport(fromDate, toDate, route, (err, data) => {
    if (err) {
      console.error('Error fetching report:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    res.json(data);
  });
};

