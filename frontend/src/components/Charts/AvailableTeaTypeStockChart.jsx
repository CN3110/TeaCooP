import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const AvailableTeaTypeStockChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableStock = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3001/api/teaTypeStocks/available');
        if (!response.ok) throw new Error('Failed to fetch available stock');
        const result = await response.json();
        // Transform data for PieChart
        const pieData = result.map(item => ({
          id: item.teaTypeId,
          label: item.teaTypeName,
          value: item.availableWeight,
        }));
        setData(pieData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableStock();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data.length) return <Alert severity="info">No stock data available</Alert>;

  return (
    <Box sx={{ mt: 4, p: 4, bgcolor: 'white', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" gutterBottom>
        Available Tea Type Stock Distribution
      </Typography>
      <PieChart
        series={[
          {
            data: data,
            innerRadius: 40, // for a donut chart look, remove for classic pie
            outerRadius: 120,
            paddingAngle: 4,
            cornerRadius: 4,
          },
        ]}
        height={400}
      />
    </Box>
  );
};

export default AvailableTeaTypeStockChart;
