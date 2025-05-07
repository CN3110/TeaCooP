import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Format date for display
  const formatDate = () => {
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
      
      // Add query parameters if filters are set
      if (filterMonth && filterYear) {
        url += `?month=${filterMonth}&year=${filterYear}`;
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

  // Apply filters
  const handleFilter = () => {
    fetchSummary();
  };

  // Handle month input change
  const handleMonthChange = (e) => {
    setFilterMonth(e.target.value);
  };

  // Handle year input change
  const handleYearChange = (e) => {
    setFilterYear(e.target.value);
  };

  // Navigate to respective detail pages
  const navigateToRawTeaDetails = () => {
    navigate('/raw-tea-records', { state: { month: summary.month, year: summary.year } });
  };

  const navigateToMadeTeaDetails = () => {
    navigate('/tea-production', { state: { month: summary.month, year: summary.year } });
  };

  const navigateToTeaPacketsDetails = () => {
    navigate('/tea-packet', { state: { month: summary.month, year: summary.year } });
  };

  const navigateToLotDetails = () => {
    navigate('/view-lots', { state: { month: summary.month, year: summary.year } });
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
          <select
            value={filterMonth}
            onChange={handleMonthChange}
            className="filter-select"
          >
            <option value="">Select Month</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
          <select
            value={filterYear}
            onChange={handleYearChange}
            className="filter-select"
          >
            <option value="">Select Year</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
          <button onClick={handleFilter} className="filter-button">
            Filter
          </button>
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
