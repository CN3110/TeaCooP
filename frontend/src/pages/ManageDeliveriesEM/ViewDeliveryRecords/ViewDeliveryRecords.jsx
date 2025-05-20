import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";

// Material UI Components
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

// Material UI Icons
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClearIcon from "@mui/icons-material/Clear";

import "./ViewDeliveryRecords.css";

const ViewDeliveryRecords = () => {
  const [supplierId, setSupplierId] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Dialog States
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    deliveryId: null,
  });

  const showAlert = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryRecords = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveries");
        if (response.ok) {
          const data = await response.json();
          setDeliveries(data);
          setFilteredDeliveries(data);
        } else {
          console.error("Failed to fetch delivery records");
          showAlert("Failed to fetch delivery records", "error");
        }
      } catch (error) {
        console.error("Error fetching delivery records:", error);
        showAlert("Error connecting to the server", "error");
      }
    };

    fetchDeliveryRecords();
  }, []);

  useEffect(() => {
    let filtered = deliveries;

    if (supplierId) {
      filtered = filtered.filter((d) =>
        d.supplierId.toLowerCase().includes(supplierId.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (d) => new Date(d.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter((d) => new Date(d.date) <= new Date(endDate));
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      showAlert("Start date cannot be after end date.", "error");
      return;
    }

    if (selectedRoute) {
      filtered = filtered.filter((d) => d.route === selectedRoute);
    }

    setFilteredDeliveries(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [supplierId, startDate, endDate, selectedRoute, deliveries]);

  const handleClearFilters = () => {
    setSupplierId("");
    setStartDate("");
    setEndDate("");
    setSelectedRoute("");
    setFilteredDeliveries(deliveries);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSupplierId(e.target.value);
  };

  const handleAddDeliveryRecord = () => {
    navigate("/add-new-delivery-record");
  };

  const handleEdit = (deliveryId) => {
    navigate(`/edit-delivery-record/${deliveryId}`);
  };

  const handleDeleteClick = (deliveryId) => {
    setDeleteDialog({
      open: true,
      deliveryId,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/deliveries/${deleteDialog.deliveryId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const updated = deliveries.filter(
          (d) => d.deliveryId !== deleteDialog.deliveryId
        );
        setDeliveries(updated);
        setFilteredDeliveries(updated);
        showAlert("Delivery record deleted successfully!");
      } else {
        showAlert("Failed to delete delivery record", "error");
      }
    } catch (error) {
      console.error("Error deleting delivery record:", error);
      showAlert("Error connecting to the server", "error");
    }

    setDeleteDialog({ open: false, deliveryId: null });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, deliveryId: null });
  };

  // Pagination Logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredDeliveries.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredDeliveries.length / recordsPerPage);

  // Display dates in a more readable format
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <EmployeeLayout>
      <div className="view-delivery-records-container">
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              fontWeight: "bold",
              fontSize: "1rem",
              backgroundColor:
                snackbar.severity === "success"
                  ? "#2e7d32"
                  : snackbar.severity === "error"
                  ? "rgb(211,47,47)"
                  : snackbar.severity === "warning"
                  ? "rgb(237, 201, 72)"
                  : "#1976d2",
              color: "white",
              boxShadow: 3,
            }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            style: {
              borderRadius: "8px",
              padding: "8px",
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" className="dialog-title">
            {"Confirm Deletion"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this delivery record? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleDeleteCancel} 
              className="dialog-cancel-btn"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              className="dialog-confirm-btn"
              variant="contained"
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <div className="content-header">
          <h3>View Delivery Records</h3>
          <button className="add-delivery-btn" onClick={handleAddDeliveryRecord}>
            <AddCircleIcon /> Add New Delivery Record
          </button>
        </div>

        {/* Filters */}
        <div className="filter-section">
          <div className="filter-group search-field">
            <TextField
              variant="outlined"
              placeholder="Search by Supplier ID"
              value={supplierId}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="search-icon" />
                  </InputAdornment>
                ),
                className: "search-input",
              }}
              fullWidth
            />
          </div>
          <div className="filter-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Route:</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
            >
              <option value="">All</option>
              {[...new Set(deliveries.map((d) => d.route))].map((route) => (
                <option key={route} value={route}>
                  {route}
                </option>
              ))}
            </select>
          </div>
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            <ClearIcon /> Clear Filters
          </button>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="deliveries-table">
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Date</th>
                <th>Transport</th>
                <th>Route</th>
                <th>Total Weight (kg)</th>
                <th>Total Sack Weight (kg)</th>
                <th>For Water (kg)</th>
                <th>For Withered Leaves (kg)</th>
                <th>For Ripe Leaves (kg)</th>
                <th>Randalu (kg)</th>
                <th>Green Tea Leaves (kg)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((delivery) => (
                  <tr key={delivery.deliveryId}>
                    <td>{delivery.supplierId}</td>
                    <td>{formatDate(delivery.date)}</td>
                    <td>{delivery.transport}</td>
                    <td>{delivery.route}</td>
                    <td>{delivery.totalWeight}</td>
                    <td>{delivery.totalSackWeight}</td>
                    <td>{delivery.forWater}</td>
                    <td>{delivery.forWitheredLeaves}</td>
                    <td>{delivery.forRipeLeaves}</td>
                    <td>{delivery.randalu}</td>
                    <td>{delivery.greenTeaLeaves}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(delivery.deliveryId)}
                        title="Edit Record"
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteClick(delivery.deliveryId)}
                        title="Delete Record"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="no-records">No delivery records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredDeliveries.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <NavigateBeforeIcon /> Prev
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="pagination-btn"
            >
              Next <NavigateNextIcon />
            </button>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default ViewDeliveryRecords;