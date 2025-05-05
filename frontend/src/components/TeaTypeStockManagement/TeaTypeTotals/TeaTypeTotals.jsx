import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeaTypeTotals.css';

const TeaTypeTotals = () => {
  const [teaTotals, setTeaTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTeaTotals = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/teaTypeStocks/totals');
        setTeaTotals(response.data);
        setError('');
      } catch (err) {
        console.error('Error fetching tea totals:', err);
        setError('Failed to load tea type totals. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeaTotals();
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="tea-totals-container">
      <div className="tea-totals-header">
        <h2>Current Tea Stock Totals</h2>
        <button onClick={handleRefresh} className="refresh-btn">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading tea stock totals...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : teaTotals.length === 0 ? (
        <p>No tea stock totals available.</p>
      ) : (
        <div className="tea-totals-grid">
          {teaTotals.map((teaTotal) => (
            <div key={teaTotal.teaTypeId} className="tea-total-card">
              <h3>{teaTotal.teaTypeName}</h3>
              <div className="tea-weight">
                <span className="tea-weight-value">{parseFloat(teaTotal.totalWeight).toFixed(2)}</span>
                <span className="tea-weight-unit">kg</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeaTypeTotals;