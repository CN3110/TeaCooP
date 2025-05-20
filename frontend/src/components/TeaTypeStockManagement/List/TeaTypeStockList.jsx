import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button, Snackbar, Alert, TablePagination, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './TeaTypeStockList.css';

const TeaTypeStockList = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    weightInKg: '',
    productionDate: '',
    teaTypeId: ''
  });
  const [teaTypes, setTeaTypes] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const [deleteId, setDeleteId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchStocks();
    fetchTeaTypes();
  }, [page, rowsPerPage]);

  
  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/teaTypeStocks', {
        params: {
          page: page + 1,
          limit: rowsPerPage
        }
      });
      setStocks(response.data.stocks || []);
      setTotalRows(response.data.total || 0);
    } catch (err) {
      setError('Failed to load records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  
  const fetchTeaTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/teaTypes');
      console.log('Tea types fetched:', response.data); // <-- Debug
      setTeaTypes(response.data || []);
    } catch (err) {
      console.error('Failed to load tea types', err); // <-- Add error details
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/teaTypeStocks/${deleteId}`);
      setSnack({ open: true, message: 'Record deleted successfully!', severity: 'success' });
      fetchStocks();
    } catch (err) {
      setSnack({ open: true, message: 'Failed to delete record.', severity: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEdit = (stock) => {
    fetchTeaTypes();
    setEditing(stock.stockId);
    setFormData({
      weightInKg: stock.weightInKg,
      productionDate: format(new Date(stock.productionDate), 'yyyy-MM-dd'),
      teaTypeId: stock.teaTypeId
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/teaTypeStocks/${editing}`, {
        ...formData,
        teaTypeId: parseInt(formData.teaTypeId, 10),
      });
      setSnack({ open: true, message: 'Record updated successfully!', severity: 'success' });
      setEditing(null);
      fetchStocks();
    } catch (err) {
      setSnack({ open: true, message: 'Failed to update record.', severity: 'error' });
    }
  };
  

  return (
    <div className="tea-stock-list">
      <h2>Tea Stock Records</h2>

      {loading ? (
        <p>Loading records...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : stocks.length === 0 ? (
        <p>No stock records found.</p>
      ) : (
        <>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Tea Type</th>
                <th>Weight (kg)</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.stockId}>
                  <td>{format(new Date(stock.productionDate), 'yyyy-MM-dd')}</td>
                  <td>{stock.teaTypeName}</td>
                  <td>{parseFloat(stock.weightInKg).toFixed(2)}</td>
                  <td>{stock.employeeName}</td>
                  <td>
  <IconButton 
    onClick={() => handleEdit(stock)} 
    color="primary"
    aria-label="edit"
    size="small"
  >
    <EditIcon fontSize="small" style={{ color: 'rgb(33, 101, 33)' }} />
  </IconButton>
  <IconButton 
    onClick={() => setDeleteId(stock.stockId)} 
    color="error"
    aria-label="delete"
    size="small"
  >
    <DeleteIcon fontSize="small" />
  </IconButton>
</td>
                </tr>
              ))}
            </tbody>
          </table>

          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            className="pagination"
          />
        </>
      )}

      {editing && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Stock Record</h3>
            <form onSubmit={handleUpdate}>
              <label>
                Production Date:
                <input
                  type="date"
                  value={formData.productionDate}
                  onChange={(e) => setFormData({ ...formData, productionDate: e.target.value })}
                  required
                />
              </label>
              <label>
                Weight (kg):
                <input
                  type="number"
                  step="0.01"
                  value={formData.weightInKg}
                  onChange={(e) => setFormData({ ...formData, weightInKg: e.target.value })}
                  required
                />
              </label>
              <label>
                Tea Type:
                <select
                  value={formData.teaTypeId}
                  onChange={(e) => setFormData({ ...formData, teaTypeId: e.target.value })}
                  required
                >
                  <option value="">Select Tea Type</option>
                  {teaTypes.map((type) => (
                    <option key={type.teaTypeId} value={type.teaTypeId}>
                      {type.teaTypeName}
                    </option>
                  ))}
                </select>
              </label>
              <div className="modal-actions">
                <button type="submit" className="action-btn save-btn">Save</button>
                <button type="button" onClick={() => setEditing(null)} className="action-btn cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this stock record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TeaTypeStockList;
