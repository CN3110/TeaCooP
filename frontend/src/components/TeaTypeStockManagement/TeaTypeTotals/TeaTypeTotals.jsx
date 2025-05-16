import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeaTypeTotals.css';

const TeaTypeTotals = () => {
  const [teaStock, setTeaStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [allocatedForTeaType, setAllocatedForTeaType] = useState(null); // New state

  useEffect(() => {
    const fetchTeaStock = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/teaTypeStocks/available');
        setTeaStock(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching tea stock:', err);
        setError('Failed to load tea stock. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchAllocatedForTeaType = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/lots/made-tea-available-for-teaType-creation');
        const data = await res.json();
        setAllocatedForTeaType(data.availableWeight);
      } catch (err) {
        console.error('Error fetching categorization data:', err);
      }
    };

    fetchTeaStock();
    fetchAllocatedForTeaType();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="tea-totals-container">
      <div className="tea-totals-header" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <h2>Tea Type Stock Availability</h2>
       
        {allocatedForTeaType !== null && (
          <h6 className="allocated-label">
            Allocated Made Tea Weight for Tea Type Categorizing: {parseFloat(allocatedForTeaType).toFixed(2)} kg
          </h6>
        )}

         <button onClick={handleRefresh} className="refresh-btn">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading tea stock...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : teaStock.length === 0 ? (
        <p>No tea stock data available.</p>
      ) : (
        <div className="tea-totals-grid">
          {teaStock.map((tea) => (
            <div key={tea.teaTypeId} className="tea-total-card">
              <h3>{tea.teaTypeName}</h3>
              
              <div className="stock-info">
                <div className="stock-row">
                  <span>Total Stock:</span>
                  <span>{parseFloat(tea.totalStockWeight).toFixed(2)} kg</span>
                </div>
                
                <div className="stock-row">
                  <span>Allocated to Lots:</span>
                  <span>{parseFloat(tea.allocatedWeight).toFixed(2)} kg</span>
                </div>
                
                <div className="stock-row highlight">
                  <span>Available:</span>
                  <span>{parseFloat(tea.availableWeight).toFixed(2)} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeaTypeTotals;
