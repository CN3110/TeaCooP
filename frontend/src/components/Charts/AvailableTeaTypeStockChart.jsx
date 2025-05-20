import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Box, Typography, CircularProgress, Alert, useTheme } from '@mui/material';

const AvailableTeaTypeStockChart = () => {
  const theme = useTheme();
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

  // Tea-inspired color palette
  const teaColors = [
    '#3E2723', // Dark brown (Pu-erh)
    '#4CAF50', // Green (Matcha)
    '#8D6E63', // Light brown (Oolong)
    '#AED581', // Light green (Green tea)
    '#5D4037', // Medium brown (Black tea)
    '#81C784', // Fresh green (Sencha)
    '#6D4C41', // Earthy brown (Rooibos)
    '#689F38', // Deep green (Gyokuro)
  ];

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

  if (!data.length) return (
    <Alert severity="info" sx={{ 
      backgroundColor: '#e8f5e9', 
      color: '#2e7d32',
      '& .MuiAlert-icon': {
        color: '#2e7d32'
      }
    }}>
      No stock data available
    </Alert>
  );

  return (
    <Box sx={{ 
      mt: 4, 
      p: 4, 
      bgcolor: 'background.paper', 
      borderRadius: 3, 
      boxShadow: 3,
      border: `1px solid ${theme.palette.divider}`
    }}>
      <Typography variant="h5" gutterBottom sx={{ 
        color: theme.palette.text.primary,
        fontWeight: 'bold',
        mb: 3
      }}>
        Available Tea Type Stock Distribution (kg)
      </Typography>
      
      <PieChart
        series={[
          {
            data: data.map((item, index) => ({
              ...item,
              color: teaColors[index % teaColors.length]
            })),
            innerRadius: 60, // Donut style
            outerRadius: 120,
            paddingAngle: 2,
            cornerRadius: 5,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
            arcLabel: (item) => `${item.value}kg`,
            arcLabelMinAngle: 15,
          },
        ]}
        height={400}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: { top: 20 },
            labelStyle: {
              fill: theme.palette.text.primary,
              fontSize: theme.typography.body2.fontSize,
            },
          },
        }}
        sx={{
          '& .MuiChartsLegend-root': {
            '& .MuiChartsLegend-series': {
              '& text': {
                fill: theme.palette.text.primary + ' !important'
              }
            }
          },
          '& .MuiChartsLegend-mark': {
            rx: '4px' // Rounded corners for legend markers
          }
        }}
      />
    </Box>
  );
};

export default AvailableTeaTypeStockChart;