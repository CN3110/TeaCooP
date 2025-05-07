import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TeaProductionSummary.css';

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

  // Format date for display
  const formatDate = () => {
    if (!summary.month || !summary.year) return 'All Time';
    
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    
    const month = parseInt(summary.month) - 1; // JS months are 0-indexed
    return `${monthNames[month]} ${summary.year}`;
  };

  // Fetch tea production summary data
  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      let url = 'http://localhost:3001/api/teaSummary/summary';
      
      // Add query parameters if date is selected
      if (selectedDate) {
        const month = selectedDate.getMonth() + 1; // JS months are 0-indexed
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

  // Initial data fetch on component mount
  useEffect(() => {
    fetchSummary();
  }, []);

  // Apply filters when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchSummary();
    }
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Clear date filter
  const clearFilter = () => {
    setSelectedDate(null);
    fetchSummary();
  };

  // Navigate to respective detail pages
  const navigateToRawTeaDetails = () => {
    navigate('/raw-tea-records', { 
      state: { 
        month: selectedDate ? selectedDate.getMonth() + 1 : null,
        year: selectedDate ? selectedDate.getFullYear() : null 
      } 
    });
  };

  const navigateToMadeTeaDetails = () => {
    navigate('/tea-production', { 
      state: { 
        month: selectedDate ? selectedDate.getMonth() + 1 : null,
        year: selectedDate ? selectedDate.getFullYear() : null 
      } 
    });
  };

  const navigateToTeaPacketsDetails = () => {
    navigate('/tea-packet', { 
      state: { 
        month: selectedDate ? selectedDate.getMonth() + 1 : null,
        year: selectedDate ? selectedDate.getFullYear() : null 
      } 
    });
  };

  const navigateToLotDetails = () => {
    navigate('/view-lots', { 
      state: { 
        month: selectedDate ? selectedDate.getMonth() + 1 : null,
        year: selectedDate ? selectedDate.getFullYear() : null 
      } 
    });
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tea-production-summary">
      <div className="summary-header">
        <h1>Tea Production Summary</h1>
        <div className="filter-container">
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              placeholderText="Select month and year"
              className="date-picker-input"
            />
            {selectedDate && (
              <button onClick={clearFilter} className="clear-filter-button">
                Clear Filter
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="summary-date">
        <h2>{formatDate()}</h2>
      </div>



      <div className="summary-cards">
        {/* Raw Tea Total Card */}
        <div className="summary-card">
          <h3>Raw Tea Total</h3>
          <div className="card-data">
            <p>{formatDate()}: {summary.rawTeaWeight}kg</p>
          </div>
          <button onClick={navigateToRawTeaDetails} className="view-more-button">
            View more...
          </button>
        </div>

        {/* Made Tea Total Card */}
        <div className="summary-card">
          <h3>Total Made Tea</h3>
          <div className="card-data">
            <p>{formatDate()}: {summary.madeTeaWeight}kg</p>
          </div>
          <button onClick={navigateToMadeTeaDetails} className="view-more-button">
            View more...
          </button>
        </div>
      </div>

      <div className="summary-cards">
        {/* Tea Categorized by Type - Production */}
        <div className="summary-card wide-card">
          <h3>Tea Categorized by tea type ({formatDate()}) - total production</h3>
          <div className="card-data tea-types">
            {summary.teaProduction.map((type) => (
              <p key={type.teaTypeId}>
                {type.teaTypeName} = {type.totalWeight}kg
              </p>
            ))}
          </div>
        </div>

        {/* Total Packets Card */}
        <div className="summary-card">
          <h3>Total Packets</h3>
          <div className="card-data">
            <p>{summary.totalPackets}</p>
          </div>
          <button onClick={navigateToTeaPacketsDetails} className="view-more-button">
            View more...
          </button>
        </div>
      </div>

      <div className="summary-cards">
        {/* Tea Categorized by Type - Current Stock */}
        <div className="summary-card wide-card">
          <h3>Tea Categorized by tea type ({formatDate()}) - current stock</h3>
          <div className="card-data tea-types">
            {summary.currentStock.map((type) => (
              <p key={type.teaTypeId}>
                {type.teaTypeName} = {type.currentStock}kg
              </p>
            ))}
          </div>
        </div>

        {/* Total Lot Weights */}
        <div className="summary-card">
          <h3>Total Lot weights</h3>
          <div className="card-data">
            <p>{summary.totalLotWeight}kg</p>
          </div>
          <button onClick={navigateToLotDetails} className="view-more-button">
            View more...
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeaProductionSummary;