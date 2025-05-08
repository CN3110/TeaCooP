import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import {
  Snackbar, 
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import './NoticeList.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NoticeList = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const showAlert = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedNotice(null);
  };

  const handleDelete = async () => {
    if (!selectedNotice) return;

    try {
      const response = await fetch(`http://localhost:3001/api/notices/${selectedNotice.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notice');
      
      setNotices(notices.filter(notice => notice.id !== selectedNotice.id));  // Remove the deleted notice from the list
      showAlert('Notice deleted successfully', 'success');  // Show success alert
    } catch (err) {
      console.error(err);
      showAlert('Failed to delete notice. Please try again.', 'error');  // Show error alert
    } finally {
      handleCloseConfirm();
    }
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/notices');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const data = await response.json();
      setNotices(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load notices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []); // Fetch notices initially

  // Determine status
  const getStatusDisplay = (notice) => {
    const today = new Date();
    const expiryDate = notice.expiry_date ? new Date(notice.expiry_date) : null;
    if (notice.status === 'draft') return 'Draft';
    if (expiryDate && expiryDate < today) return 'Expired';
    return 'Active';
  };

  // Determine priority badge color
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-default';
    }
  };

  return (
   
    <div className="notice-container">
      
      <div className="notice-header">
  
  
    <button onClick={() => navigate('/admin-dashboard')} className="btn-back">
      Back
    </button>
    <h1>Manage Notices</h1>
    <button onClick={() => navigate('/notice-form')} className="btn-create">
      Create New Notice
    </button>
  
</div>

      {/* Error message */}
      {error && <div className="notice-error">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="notice-loading">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="notice-empty">No notices found.</div>
      ) : (
        <div className="notice-table-wrapper">
          <table className="notice-table">
            <thead>
              <tr>
                <th>Notice</th>
                <th>Recipients</th>
                <th>Priority</th>
                <th>Created At.</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id}>
                  <td>
                    <strong>{notice.title}</strong>
                    <div className="notice-content-preview">
                      {notice.content.length > 60 ? notice.content.substring(0, 60) + '...' : notice.content}
                    </div>
                  </td>
                  <td>{notice.recipient}</td>
                  <td>{notice.priority}</td>

                  <td>{new Date(notice.created_at).toLocaleDateString()}</td>
                  <td>{notice.expiry_date ? new Date(notice.expiry_date).toLocaleDateString() : 'No expiry'}</td>
                  <td>
                    <span className={`status ${getStatusDisplay(notice).toLowerCase()}`}>
                      {getStatusDisplay(notice)}
                    </span>
                  </td>
                  <td>
        
                  <button onClick={() => navigate(`/edit-notice/${notice.id}`)} className="btn-edit">
  Edit
</button>

                    <button
                      onClick={() => {
                        setSelectedNotice(notice); // Set selected notice to delete
                        setOpenConfirm(true); // Show confirmation dialog
                      }}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Snackbar alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm}>
        <DialogTitle>Confirm Delete Notice</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this notice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="outlined" color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NoticeList;
