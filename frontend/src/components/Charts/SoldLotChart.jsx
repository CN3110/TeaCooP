import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart } from '@mui/x-charts/BarChart';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, CircularProgress, Alert } from '@mui/material';

const SoldLotChart = () => {
  const [chartData, setChartData] = useState([]);
  const [teaType, setTeaType] = useState('');
  const [teaTypes, setTeaTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeaTypes();
    fetchChartData();
    // eslint-disable-next-line
  }, [teaType]);

  const fetchTeaTypes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/teaTypes');
      setTeaTypes(res.data);
    } catch (err) {
      setError('Failed to load tea types');
    }
  };

  const fetchChartData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3001/api/charts/sold-lot-chart', {
        params: { teaType },
      });
      setChartData(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for MUI BarChart
  const xLabels = chartData.map(item => item.lotNumber);
  const soldPrices = chartData.map(item => item.soldPrice);
  const employeeValuations = chartData.map(item => item.employeeValuationPrice);
  const brokerValuations = chartData.map(item => item.brokerValuationPrice);

  return (
    <Box sx={{ mt: 4, p: 4, bgcolor: 'white', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h4" gutterBottom>Tea Auction Analytics</Typography>
      <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Tea Type</InputLabel>
          <Select
            value={teaType}
            label="Filter by Tea Type"
            onChange={e => setTeaType(e.target.value)}
          >
            <MenuItem value="">All Tea Types</MenuItem>
            {teaTypes.map(type => (
              <MenuItem key={type.teaTypeId} value={type.teaTypeName}>
                {type.teaTypeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#FF69B4', borderRadius: '50%' }} />
          <Typography variant="body2">Sold Price</Typography>
          <Box sx={{ width: 16, height: 16, bgcolor: '#006400', borderRadius: '50%' }} />
          <Typography variant="body2">Employee Valuation</Typography>
          <Box sx={{ width: 16, height: 16, bgcolor: '#90EE90', borderRadius: '50%' }} />
          <Typography variant="body2">Broker Valuation</Typography>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : chartData.length === 0 ? (
        <Alert severity="info">No data available for the selected filters</Alert>
      ) : (
        <Box sx={{ height: 500 }}>
          <BarChart
            xAxis={[{ data: xLabels, label: 'Lot Number' }]}
            series={[
              { data: soldPrices, label: 'Sold Price (Rs)', color: '#FF69B4' }, // Pink
              { data: employeeValuations, label: 'Employee Valuation (Rs)', color: '#006400' }, // Dark Green
              { data: brokerValuations, label: 'Broker Valuation (Rs)', color: '#90EE90' }, // Light Green
            ]}
            height={500}
            margin={{ top: 40, bottom: 80, left: 80, right: 40 }}
            legend={{ position: { vertical: 'top', horizontal: 'center' } }}
            tooltip={{
              trigger: 'item',
              render: ({ series, dataIndex }) => {
                const lot = chartData[dataIndex];
                return (
                  `<div>
                    <strong>${series.label}</strong>: Rs ${series.data[dataIndex].toLocaleString()}<br/>
                    Tea Type: ${lot.teaType}<br/>
                    Date: ${new Date(lot.soldDate).toLocaleDateString()}<br/>
                    Weight: ${lot.weight} kg<br/>
                    Employee Valuation: Rs ${lot.valuationPrice.toLocaleString()}<br/>
                    Broker Valuation: Rs ${lot.brokerValuationPrice.toLocaleString()}
                  </div>`
                );
              }
            }}
          />
        </Box>
      )}

      <Typography variant="body2" sx={{ mt: 3, color: 'gray' }}>
        Tip: Toggle series in the legend. Hover over bars for detailed info.
      </Typography>
    </Box>
  );
};

export default SoldLotChart;