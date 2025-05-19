import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';

const DashboardSummaryCards = () => {
  const [counts, setCounts] = useState({
    suppliers: 0,
    drivers: 0,
    brokers: 0,
    employees: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:3001/api/charts/counts');
        if (!res.ok) throw new Error('Failed to fetch summary counts');
        const data = await res.json();
        setCounts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const cardData = [
    { label: 'Suppliers', value: counts.suppliers, color: '#1976d2' },
    { label: 'Drivers', value: counts.drivers, color: '#388e3c' },
    { label: 'Brokers', value: counts.brokers, color: '#fbc02d' },
    { label: 'Employees', value: counts.employees, color: '#d32f2f' },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map(card => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center', bgcolor: card.color, color: '#fff' }}>
            <Typography variant="h6">{card.label}</Typography>
            <Typography variant="h3">{card.value}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardSummaryCards;
