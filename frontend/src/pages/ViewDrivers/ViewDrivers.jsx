import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
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
      setFilteredDrivers(prev => 
        prev.map(driver => 
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

  return (
    <EmployeeLayout>
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
              <BiSearch className="icon" />
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
                Add New Driver
              </button>
            </div>
          </div>
        </div>

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
              <th>Added by:</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <tr key={driver.driverId}>
                  <td>{driver.driverId}</td>
                  <td>{driver.driverName}</td>
                  <td>{driver.driverContactNumber}</td>
                  <td>{driver.driverEmail}</td>
                  <td className={`status-cell status-${driver.status}`}>
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </td>
                  <td>
                    <ul className="vehicle-details-list">
                      {driver.vehicleDetails && driver.vehicleDetails.length > 0 ? (
                        driver.vehicleDetails.map((vehicle, index) => (
                          <li key={index}>
                            <span>Vehicle {index + 1}: </span>
                            <span>{vehicle.vehicleNumber} ({vehicle.vehicleType})</span>
                          </li>
                        ))
                      ) : (
                        <li>No vehicle details available</li>
                      )}
                    </ul>
                  </td>
                  <td className="driver-notes">
                    {driver.notes || "No notes available"}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(driver)}>Edit</button>
                    {driver.status !== 'disabled' && (
                      <button
                        className="disable-button"
                        onClick={() => handleOpenDisableConfirm(driver.driverId)}
                      >
                        Disable
                      </button>
                    )}
                  </td>
                  <td>
          {driver.addedByEmployeeId} <br />
          {driver.employeeName && (
            <span style={{ marginLeft: 4, color: "#555" }}>
              ({driver.employeeName})
            </span>
          )}
        </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No drivers found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Confirmation Dialog */}
        <Dialog 
          open={openConfirm} 
          onClose={handleCloseConfirm}
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '20px',
              minWidth: '400px'
            }
          }}
        >
          <DialogTitle sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Confirm Disable Driver
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: '1rem' }}>
              Are you sure you want to disable this driver?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: '16px 24px' }}>
            <Button 
              onClick={handleCloseConfirm}
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
              onClick={handleConfirmDisable} 
              color="error"
              variant="contained"
              sx={{
                textTransform: 'none',
                padding: '6px 16px',
                borderRadius: '8px'
              }}
            >
              Confirm Disable
            </Button>
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
    </EmployeeLayout>
  );
};

export default ViewDrivers;