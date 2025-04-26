//add filters for status
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
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
import "./ViewBrokers.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ViewBrokers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState(null);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  

  // Open confirmation dialog
  const handleOpenDisableConfirm = (brokerId) => {
    setSelectedBrokerId(brokerId);
    setOpenConfirm(true);
  };

  // Close dialog
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/brokers");
        if (response.ok) {
          const data = await response.json();
          setBrokers(data);
          setFilteredBrokers(data);
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || "Failed to fetch brokers", "error");
        }
      } catch (error) {
        console.error("Error fetching brokers:", error);
        showAlert("An error occurred while fetching brokers", "error");
      }
    };

    fetchBrokers();
  }, []);

  useEffect(() => {
    const filtered = brokers.filter((broker) => {
      // Filter by search term
      const matchesSearch =
        broker.brokerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        broker.brokerCompanyName.toLowerCase().includes(searchTerm.toLowerCase());
  
      // Filter by status
      const matchesStatus =
        statusFilter === "all" || broker.status === statusFilter;
  
      return matchesSearch && matchesStatus;
    });
  
    setFilteredBrokers(filtered);
  }, [searchTerm, statusFilter, brokers]);
  
  const handleAddBroker = () => {
    navigate("/add-broker");
  };

  const handleEdit = (brokerId) => {
    navigate(`/edit-broker/${brokerId}`);
  };

  // Handle disable confirmation
  const handleConfirmDisable = async () => {
    handleCloseConfirm();
    if (!selectedBrokerId) return;
    
    try {
      const response = await fetch(
        `http://localhost:3001/api/brokers/${selectedBrokerId}/disable`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to disable broker");
      }

      // Update local state
      setBrokers(prevBrokers => 
        prevBrokers.map(broker => 
          broker.brokerId === selectedBrokerId 
            ? { ...broker, status: "disabled" } 
            : broker
        )
      );
      setFilteredBrokers(prev => 
        prev.map(broker => 
          broker.brokerId === selectedBrokerId 
            ? { ...broker, status: "disabled" } 
            : broker
        )
      );
      
      showAlert("Broker disabled successfully", "success");
    } catch (error) {
      console.error("Error disabling broker:", error);
      showAlert(error.message || "An error occurred while disabling broker", "error");
    }
  };

  return (
    <EmployeeLayout>
      <div className="view-broker-container">
        <div className="content-header">
          <h2>View Brokers</h2>
          <div className="header-actions">
            <div className="search-box">
              <BiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by ID, Name or Company"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="filters">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="status-filter"
  >
    <option value="all">All Statuses</option>
    <option value="pending">Pending</option>
    <option value="active">Active</option>
    <option value="disabled">Disabled</option>
  </select>
</div>

            <button className="add-button" onClick={handleAddBroker}>
              Add New Broker
            </button>
          </div>
        </div>

        <div className="brokers-table-container">
          <table className="brokers-table">
            <thead>
              <tr>
                <th>Broker ID</th>
                <th>Name</th>
                <th>Contact Number</th>
                <th>Email</th>
                <th>Company</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Added by:</th>
              </tr>
            </thead>
            <tbody>
              {filteredBrokers.length > 0 ? (
                filteredBrokers.map((broker) => (
                  <tr key={broker.brokerId}>
                    <td>{broker.brokerId}</td>
                    <td>{broker.brokerName}</td>
                    <td>{broker.brokerContactNumber}</td>
                    <td>{broker.brokerEmail}</td>
                    <td>{broker.brokerCompanyName}</td>
                    <td>
                      <span className={`status-badge ${broker.status}`}>
                        {broker.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => handleEdit(broker.brokerId)}
                        >
                          Edit
                        </button>
                        {broker.status !== 'disabled' && (
                          <button
                            className="disable-button"
                            onClick={() => handleOpenDisableConfirm(broker.brokerId)}
                          >
                            Disable
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
          {broker.addedByEmployeeId} <br />
          {broker.employeeName && (
            <span style={{ marginLeft: 4, color: "#555" }}>
              ({broker.employeeName})
            </span>
          )}
        </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-results">
                    No brokers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
            Confirm Disable Broker
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: '1rem' }}>
              Are you sure you want to disable this broker?
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

export default ViewBrokers;