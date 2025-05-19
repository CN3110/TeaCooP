import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TeaProductionSummary.css';
import ArrowBack from '@mui/icons-material/ArrowBack';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  IconButton,
  Box as MuiBox
} from '@mui/material';

import { CalendarMonth, Coffee, LocalShipping, Inventory, ArrowForward, BarChart } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';

const TeaProductionSummary = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    rawTeaWeight: 0,
    madeTeaWeight: 0,
    totalPackets: 0,
    teaProduction: [],
    currentStock: [],
    totalLotWeight: 0,
    month: '',
    year: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const formatDate = () => {
    if (!summary.month || !summary.year) return 'All Time';
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const month = parseInt(summary.month) - 1;
    return `${monthNames[month]} ${summary.year}`;
  };

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      let url = 'http://localhost:3001/api/teaSummary/summary';
      if (selectedDate) {
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();
        url += `?month=${month}&year=${year}`;
      }
      const response = await axios.get(url);
      if (response.data.success) {
        setSummary(response.data.data);
      } else {
        setError('Failed to fetch summary data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching the summary');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSummary(); }, []);
  useEffect(() => { if (selectedDate) fetchSummary(); }, [selectedDate]);

  const handleDateChange = (date) => setSelectedDate(date);
  const clearFilter = () => { setSelectedDate(null); fetchSummary(); };

  const navigateTo = (path) => {
    navigate(path, {
      state: {
        month: selectedDate ? selectedDate.getMonth() + 1 : null,
        year: selectedDate ? selectedDate.getFullYear() : null
      }
    });
  };

  if (isLoading) {
    return (
      <div className="centered-container">
        <CircularProgress color="success" />
        <Typography variant="subtitle1" mt={2}>Loading data...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="centered-container">
        <Card className="error-card">
          <CardContent>
            <Typography variant="h6" color="error">Error</Typography>
            <Typography variant="body2">{error}</Typography>
            <Button variant="contained" color="success" onClick={fetchSummary} fullWidth sx={{ mt: 2 }}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <EmployeeLayout>
    <div className="page-wrapper">
        <div className="back-button">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/employee-dashboard')}
        variant="outlined"
        color="success"
      >
        Back
      </Button>
    </div>
      <div className="header">
        <div>
          <Typography variant="h4" className="header-title">
            <BarChart fontSize="large" color="success" /> Tea Production Summary
          </Typography>
          <Typography variant="subtitle1">{formatDate()}</Typography>
        </div>
        <div className="filter-box">
          <CalendarMonth color="action" />
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            placeholderText="Filter by month"
            className="datepicker"
          />
          {selectedDate && (
            <IconButton onClick={clearFilter} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>

      <Grid container spacing={3} className="section">
        {[
          {
            title: 'Raw Tea Total',
            value: `${summary.rawTeaWeight} kg`,
            icon: <Coffee color="primary" />,
            onClick: () => navigateTo('/raw-tea-records')
          },
          {
            title: 'Made Tea Total',
            value: `${summary.madeTeaWeight} kg`,
            icon: <Coffee color="success" />,
            onClick: () => navigateTo('/tea-production')
          },
          {
            title: 'Total Lot Weights',
            value: `${summary.totalLotWeight} kg`,
            icon: <Inventory color="secondary" />,
            onClick: () => navigateTo('/view-lots')
          },
          {
            title: 'Total Packets',
            value: summary.totalPackets,
            icon: <LocalShipping color="warning" />,
            onClick: () => navigateTo('/tea-packet')
          }
          
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="summary-card" onClick={card.onClick}>
              <CardContent>
                <div className="card-header">
                  {card.icon}
                  <ArrowForward fontSize="small" />
                </div>
                <Typography variant="subtitle1">{card.title}</Typography>
                <Typography variant="h5" mt={1}>{card.value}</Typography>
                <Typography variant="caption">{formatDate()}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tea Production by Type Section */}
<Card className="section-box" onClick={() => navigateTo('/tea-type-stock-management')}>
  <CardContent>
    <div className="section-header">
      <Typography variant="h6" className="section-title">
        Tea Production by Type - {formatDate()}
      </Typography>
      <ArrowForward className="arrow-icon" />
    </div>
    <Grid container spacing={3} className="section">
      {summary.teaProduction.map(type => (
        <Grid item xs={12} sm={6} md={3} key={type.teaTypeId}>
          <Card className="info-card">
            <CardContent>
              <Typography variant="subtitle2">{type.teaTypeName}</Typography>
              <Typography variant="h6">{type.totalWeight} kg</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </CardContent>
</Card>

{/* Current Stock by Type Section */}
<Card className="section-box" onClick={() => navigateTo('/tea-type-stock-management')}>
  <CardContent>
    <div className="section-header">
      <Typography variant="h6" className="section-title">
        Current Stock by Type - {formatDate()}
      </Typography>
      <ArrowForward className="arrow-icon" />
    </div>
    <Grid container spacing={3} className="section">
      {summary.currentStock.map(type => (
        <Grid item xs={12} sm={6} md={3} key={type.teaTypeId}>
          <Card className="info-card">
            <CardContent>
              <Typography variant="subtitle2">{type.teaTypeName}</Typography>
              <Typography variant="h6">{type.currentStock} kg</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </CardContent>
</Card>
    
        </div>
            </EmployeeLayout>

  );
};

export default TeaProductionSummary;
