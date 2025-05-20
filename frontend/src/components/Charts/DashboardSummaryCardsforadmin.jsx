import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';

const DashboardSummaryCardsforadmin = () => {
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

  if (loading) return (
    <Box display="flex" justifyContent="center" p={4}>
      <CircularProgress sx={{ color: '#4caf50' }} />
    </Box>
  );
  
  if (error) return (
    <Alert severity="error" sx={{ 
      backgroundColor: '#ffebee', 
      color: '#c62828',
      '& .MuiAlert-icon': {
        color: '#c62828'
      }
    }}>
      {error}
    </Alert>
  );

  const cardData = [
     { label: 'Employees', value: counts.employees, color: 'rgb(22, 59, 24)' }, 
    { label: 'Suppliers', value: counts.suppliers, color: ' #2e7d32' }, // Dark green
    { label: 'Drivers', value: counts.drivers, color: ' #43a047' }, // Medium green
    { label: 'Brokers', value: counts.brokers, color: ' #66bb6a' }, // Light green
   
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cardData.map(card => (
        <Grid item xs={12} sm={6} md={3} key={card.label}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            textAlign: 'center', 
            bgcolor: card.color, 
            color: '#fff',
            borderRadius: 2,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6,
              bgcolor: `${card.color}CC` // Slightly transparent on hover
            }
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {card.label}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardSummaryCardsforadmin;