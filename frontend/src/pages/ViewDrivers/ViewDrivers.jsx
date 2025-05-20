import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import "./ViewDrivers.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ViewDrivers = () => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

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

  const handleOpenDisableConfirm = (driverId) => {
    setSelectedDriverId(driverId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/drivers");
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
          setFilteredDrivers(data);
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || "Failed to fetch drivers", "error");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        showAlert("An error occurred while fetching drivers", "error");
      }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    let filtered = [...drivers];

    if (searchId) {
      filtered = filtered.filter((driver) =>
        driver.driverId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((driver) => driver.status === statusFilter);
    }

    setFilteredDrivers(filtered);
    setCurrentPage(1); // reset to page 1 on filter change
  }, [searchId, statusFilter, drivers]);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleAddDriver = () => {
    navigate("/add-driver");
  };

  const handleEdit = (driver) => {
    navigate(`/edit-driver/${driver.driverId}`);
  };

  const handleConfirmDisable = async () => {
    handleCloseConfirm();
    if (!selectedDriverId) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/drivers/${selectedDriverId}/disable`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to disable driver");
      }

      setDrivers(prevDrivers =>
        prevDrivers.map(driver =>
          driver.driverId === selectedDriverId
            ? { ...driver, status: "disabled" }
            : driver
        )
      );

      showAlert("Driver disabled successfully", "success");
    } catch (error) {
      console.error("Error disabling driver:", error);
      showAlert(error.message || "An error occurred while disabling driver", "error");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;
  
  return (
    <Layout>
      <div className="view-driver-container">
        <div className="content-header">
          <h3>View Drivers</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Driver ID"
                value={searchId}
                onChange={handleSearchChange}
              />
              <SearchIcon className="search-icon" />
            </div>

            <div className="filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
              <button className="add-driver-btn" onClick={handleAddDriver}>
                <AddCircleIcon className="add-icon" />
                Add New Driver
              </button>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="drivers-table">
            <thead>
              <tr>
                <th>Driver ID</th>
                <th>Driver Name</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Status</th>
                <th>Vehicle Details</th>
                <th>Notes</th>
                <th>Actions</th>
                <th>Added by</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDrivers.length > 0 ? (
                paginatedDrivers.map((driver) => (
                  <tr key={driver.driverId}>
                    <td>{driver.driverId}</td>
                    <td>{driver.driverName}</td>
                    <td>{driver.driverContactNumber}</td>
                    <td>{driver.driverEmail}</td>
                    <td>
                      <span className={`status-badge status-${driver.status}`}>
                        {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <ul className="vehicle-details-list">
                        {driver.vehicleDetails?.length > 0 ? (
                          driver.vehicleDetails.map((vehicle, index) => (
                            <li key={index}>
                              Vehicle {index + 1}: {vehicle.vehicleNumber} ({vehicle.vehicleType})
                            </li>
                          ))
                        ) : (
                          <li>No vehicle details available</li>
                        )}
                      </ul>
                    </td>
                    <td>{driver.notes || "No notes available"}</td>
                    <td className="action-buttons">
                      <Tooltip title="Edit Driver">
                        <IconButton 
                          className="edit-button" 
                          onClick={() => handleEdit(driver)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      
                      {driver.status !== 'disabled' && (
                        <Tooltip title="Disable Driver">
                          <IconButton
                            className="disable-button"
                            onClick={() => handleOpenDisableConfirm(driver.driverId)}
                            color="error"
                            size="small"
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </td>
                    <td>
                      {driver.addedByEmployeeId}<br />
                      {driver.employeeName && (
                        <span className="employee-name">({driver.employeeName})</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-results">
                    No drivers found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={currentPage === index + 1 ? "pagination-button active-page" : "pagination-button"}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
          <DialogTitle>Confirm Disable Driver</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to disable this driver?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} variant="outlined">Cancel</Button>
            <Button onClick={handleConfirmDisable} color="error" variant="contained">Confirm</Button>
          </DialogActions>
        </Dialog>

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
    </Layout>
  );
};

export default ViewDrivers;