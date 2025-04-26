import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const TeaProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  const fetchProductions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/teaProductions`, {
        params: {
          page,
          limit: pagination.limit
        }
      });

      if (!response.data) {
        throw new Error('No data received');
      }

      setProductions(response.data.productions  || []);
      setPagination(response.data.pagination || {
        total: response.data.productions?.length || 0,
        page,
        limit: pagination.limit,
        pages: 1
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load production records');
      console.error('API Error:', {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      fetchProductions(newPage);
    }
  };

  if (loading && productions.length === 0) {
    return <div className="loading">Loading production records...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!loading && productions.length === 0) {
    return <div className="empty">No production records found</div>;
  }

  return (
    <div className="tea-production-list">
      <h2>Tea Production Records</h2>
      
      <table className="production-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Tea Type</th>
            <th>Weight (kg)</th>
            <th>Recorded By</th>
            {productions.some(p => p?.teaTypeName?.toLowerCase() === 'dust tea') && (
              <th>400g Packets</th>
            )}
          </tr>
        </thead>
        <tbody>
  {productions.map((production) => {
    const productionDate = production.productionDate 
      ? format(new Date(production.productionDate), 'dd/MM/yyyy')
      : 'N/A';
      
    const weight = production.weightInKg 
      ? parseFloat(production.weightInKg).toFixed(2)
      : '0.00';
      
    return (
      <tr key={production.productionId}>
        <td>{productionDate}</td>
        <td>{production.teaTypeName || 'Unknown'}</td>
        <td>{weight}</td>
        <td>{production.employeeName || production.createdBy}</td>
        {/* Only show packets column if there are dust tea records */}
        {productions.some(p => p?.teaTypeName?.toLowerCase().includes('dust')) && (
          <td>
            {production?.teaTypeName?.toLowerCase().includes('dust') 
              ? Math.floor((production.weightInKg * 1000) / 400)
              : '-'}
          </td>
        )}
      </tr>
    );
  })}
</tbody>
      </table>
      
      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.pages}</span>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeaProductionList;