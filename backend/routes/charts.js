const express = require('express');
const router = express.Router();
const report = require('../models/report');
const db = require('../config/database'); // Add this line to import db

router.get('/daily-tea-summary', async (req, res) => {
  try {
    const result = await report.getAllDailyTeaDeliverySummaries();
    res.json(result);
  } catch (err) {
    console.error('Error in daily-tea-summary:', err);
    res.status(500).json({ error: 'Failed to fetch daily tea summary', details: err.message });
  }
});

router.get('/driver-performance', async (req, res) => {
  try {
    const { route, startDate, endDate } = req.query;
    const result = await report.getDriverReport(route, startDate, endDate);
    res.json(result);
  } catch (err) {
    console.error('Error in driver-performance:', err);
    res.status(500).json({ error: 'Failed to fetch driver performance', details: err.message });
  }
});

router.get('/supplier-raw-tea', async (req, res) => {
  try {
    const { fromDate, toDate, transport } = req.query;
    const result = await report.getRawTeaRecordsOfSupplier(fromDate, toDate, transport);
    res.json(result);
  } catch (err) {
    console.error('Error in supplier-raw-tea:', err);
    res.status(500).json({ error: 'Failed to fetch supplier raw tea data', details: err.message });
  }
});

router.get('/tea-production', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await report.getTeaProductionReport(startDate, endDate);
    res.json(result);
  } catch (err) {
    console.error('Error in tea-production:', err);
    res.status(500).json({ error: 'Failed to fetch tea production data', details: err.message });
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
      map[date] = { date, rawTeaWeight: row.rawTeaWeight || 0, teaProduced: 0 };
    });

    teaProductionData.forEach(row => {
      const date = row.date;
      if (!map[date]) {
        map[date] = { date, rawTeaWeight: 0, teaProduced: row.teaProduced || 0 };
      } else {
        map[date].teaProduced = row.teaProduced || 0;
      }
    });

    const result = Object.values(map).sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(result);

  } catch (err) {
    console.error('Error in production-vs-raw-tea:', err);
    res.status(500).json({ 
      error: 'Failed to fetch Tea Production vs Raw Tea Over Time data',
      details: err.message 
    });
  }
});

router.get('/sold-lot-chart', async (req, res) => {
  try {
    const { startDate, endDate, brokerId, teaType } = req.query;
    // Note: The model function only accepts startDate, endDate, and brokerId
    const soldLots = await report.getSoldLotsReport(startDate, endDate, brokerId);

    // Filter by teaType on the API side if needed
    const chartData = soldLots
      .filter(lot => !teaType || lot.teaTypeName === teaType)
      .map(lot => ({
        lotNumber: lot.lotNumber,
        soldPrice: lot.soldPrice,
        teaType: lot.teaTypeName,
        employeeValuationPrice: lot.employeeValuationPrice,
        brokerValuationPrice: lot.brokerValuationPrice || null // Handle potential undefined
      }));

    res.json(chartData);
  } catch (err) {
    console.error('Error in sold-lot-chart:', err);
    res.status(500).json({ 
      error: 'Failed to fetch sold lot chart data',
      details: err.message 
    });
  }
});

module.exports = router;