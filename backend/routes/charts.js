const express = require('express');
const router = express.Router();
const report = require('../models/report'); 

router.get('/daily-tea-summary', async (req, res) => {
  try {
    const result = await report.getAllDailyTeaDeliverySummaries();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch daily tea summary' });
  }
});

router.get('/driver-performance', async (req, res) => {
  try {
    const { route, startDate, endDate } = req.query;
    const result = await report.getDriverReport(route, startDate, endDate);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch driver performance' });
  }
});

router.get('/supplier-raw-tea', async (req, res) => {
  try {
    const { fromDate, toDate, transport } = req.query;
    const result = await report.getRawTeaRecordsOfSupplier(fromDate, toDate, transport);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch supplier raw tea data' });
  }
});

router.get('/tea-production', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await report.getTeaProductionReport(startDate, endDate);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tea production data' });
  }
});


router.get('/production-vs-raw-tea', async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // If no date range is provided, use the last 30 days
    if (!startDate || !endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      // Format to YYYY-MM-DD
      const formatDate = (date) => date.toISOString().split('T')[0];
      endDate = formatDate(today);
      startDate = formatDate(thirtyDaysAgo);
    }

    // Step 1: Get raw tea data
    const rawTeaQuery = `
      SELECT 
        DATE(date) AS date,
        SUM(randalu + greenTeaLeaves) AS rawTeaWeight
      FROM delivery
      WHERE DATE(date) BETWEEN ? AND ?
      GROUP BY DATE(date)
      ORDER BY DATE(date)
    `;
    const [rawTeaData] = await db.query(rawTeaQuery, [startDate, endDate]);

    // Step 2: Get tea production data
    const teaProductionQuery = `
      SELECT 
        DATE(productionDate) AS date,
        SUM(weightInKg) AS teaProduced
      FROM tea_production
      WHERE productionDate BETWEEN ? AND ?
      GROUP BY DATE(productionDate)
      ORDER BY DATE(productionDate)
    `;
    const [teaProductionData] = await db.query(teaProductionQuery, [startDate, endDate]);

    // Step 3: Merge both datasets by date
    const map = {};

    rawTeaData.forEach(row => {
      const date = row.date;
      map[date] = { date, rawTeaWeight: row.rawTeaWeight, teaProduced: 0 };
    });

    teaProductionData.forEach(row => {
      const date = row.date;
      if (!map[date]) {
        map[date] = { date, rawTeaWeight: 0, teaProduced: row.teaProduced };
      } else {
        map[date].teaProduced = row.teaProduced;
      }
    });

    const result = Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Tea Production vs Raw Tea Over Time data' });
  }
});



module.exports = router;
