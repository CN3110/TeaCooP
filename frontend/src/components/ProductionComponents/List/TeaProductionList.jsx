import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import './TeaProductionList.css';

const TeaProductionList = () => {
  const [productions, setProductions] = useState([]);
  const [allProductions, setAllProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [filters, setFilters] = useState({
    teaTypeId: '',
    startDate: '',
    endDate: ''
  });
  const [teaTypes, setTeaTypes] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const typesResponse = await axios.get('http://localhost:3001/api/teaTypes');
        setTeaTypes(typesResponse.data || []);
        const productionsResponse = await axios.get('http://localhost:3001/api/teaProductions?limit=1000&page=1');
        setAllProductions(productionsResponse.data.productions || []);
        setProductions(productionsResponse.data.productions || []);
        updatePagination(productionsResponse.data.productions || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
        showSnackbar('Failed to load production records', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updatePagination = (data) => {
    setPagination({
      total: data.length,
      page: 1,
      limit: 10,
      pages: Math.ceil(data.length / 10)
    });
  };

  useEffect(() => {
    if (allProductions.length === 0) return;
    let filtered = [...allProductions];

    if (filters.teaTypeId) {
      filtered = filtered.filter(p => p.teaTypeId == filters.teaTypeId);
    }
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      filtered = filtered.filter(p => new Date(p.productionDate) >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => new Date(p.productionDate) <= end);
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      if (start > end) {
        showSnackbar('End date cannot be before start date', 'error');
        return;
      }
      if (end > new Date()) {
        showSnackbar('Future dates are not allowed', 'error');
        return;
      }
    }

    setProductions(filtered);
    updatePagination(filtered);
  }, [filters, allProductions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleDeleteClick = (productionId) => {
    setSelectedProductionId(productionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/teaProductions/${selectedProductionId}`);
      const updatedProductions = allProductions.filter(p => p.productionId !== selectedProductionId);
      setAllProductions(updatedProductions);
      setProductions(updatedProductions);
      updatePagination(updatedProductions);
      showSnackbar('Production record deleted successfully', 'success');
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to delete record', 'error');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      teaTypeId: '',
      startDate: '',
      endDate: ''
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const paginatedData = productions.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  if (loading && productions.length === 0) {
    return <div className="loading">Loading production records...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tea-production-list">
      <h2>Tea Production Records</h2>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Tea Type:</label>
          <select
            name="teaTypeId"
            value={filters.teaTypeId}
            onChange={handleFilterChange}
          >
            <option value="">All Tea Types</option>
            {teaTypes.map(type => (
              <option key={type.teaTypeId} value={type.teaTypeId}>
                {type.teaTypeName}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>From Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        <div className="filter-group">
          <label>To Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            min={filters.startDate}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        <button onClick={resetFilters} className="reset-btn">
          Reset Filters
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="production-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Tea Type</th>
              <th>Weight (kg)</th>
              <th>Recorded By</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((production) => {
                const productionDate = production.productionDate 
                  ? format(parseISO(production.productionDate), 'dd/MM/yyyy')
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
                    
                    
                    <td>
                      <button 
                        onClick={() => handleDeleteClick(production.productionId)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="no-records">
                <td colSpan={productions.some(p => p?.teaTypeName?.toLowerCase().includes('dust')) ? 6 : 5}>
                  No production records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — always visible now */}
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

      {/* Delete Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '20px',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '1rem' }}>
            Are you sure you want to delete this production record?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: '8px'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
            sx={{
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: '8px'
            }}
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TeaProductionList;
