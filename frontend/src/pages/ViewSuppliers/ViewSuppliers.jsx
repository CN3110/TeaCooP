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
import "./ViewSuppliers.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ViewSuppliers = () => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
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

  const handleOpenDisableConfirm = (supplierId) => {
    setSelectedSupplierId(supplierId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
          setFilteredSuppliers(data);
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || "Failed to fetch suppliers", "error");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        showAlert("An error occurred while fetching suppliers", "error");
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    let filtered = [...suppliers];

    if (searchId) {
      filtered = filtered.filter((supplier) =>
        supplier.supplierId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.status === statusFilter);
    }

    setFilteredSuppliers(filtered);
  }, [searchId, statusFilter, suppliers]);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleAddSupplier = () => {
    navigate("/add-supplier");
  };

  const handleEdit = (supplier) => {
    navigate(`/edit-supplier/${supplier.supplierId}`);
  };

  const handleConfirmDisable = async () => {
    handleCloseConfirm();
    if (!selectedSupplierId) return;
    
    try {
      const response = await fetch(
        `http://localhost:3001/api/suppliers/${selectedSupplierId}/disable`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to disable supplier");
      }

      setSuppliers(prevSuppliers => 
        prevSuppliers.map(supplier => 
          supplier.supplierId === selectedSupplierId 
            ? { ...supplier, status: "disabled" } 
            : supplier
        )
      );
      setFilteredSuppliers(prev => 
        prev.map(supplier => 
          supplier.supplierId === selectedSupplierId 
            ? { ...supplier, status: "disabled" } 
            : supplier
        )
      );
      
      showAlert("Supplier disabled successfully", "success");
    } catch (error) {
      console.error("Error disabling supplier:", error);
      showAlert(error.message || "An error occurred while disabling supplier", "error");
    }
  };

  return (
    <EmployeeLayout>
      <div className="view-supplier-container">
        <div className="content-header">
          <h3>View Suppliers</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Supplier ID"
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
              <button className="add-supplier-btn" onClick={handleAddSupplier}>
                Add New Supplier
              </button>
            </div>
          </div>
        </div>

        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Land Details</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.supplierId}>
                  <td>{supplier.supplierId}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.supplierContactNumber}</td>
                  <td>{supplier.supplierEmail}</td>
                  <td className={`status-cell status-${supplier.status}`}>
                    {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                  </td>
                  <td>
                    <ul className="land-details-list">
                      {supplier.landDetails && supplier.landDetails.length > 0 ? (
                        supplier.landDetails.map((land, index) => (
                          <li key={index}>
                            <span className="land-detail-label">Land {index + 1}:</span>
                            <span>Size: {land.landSize} acres</span>
                            <span>Address: {land.landAddress}</span>
                            {land.delivery_routeName && (
                              <span>Route: {land.delivery_routeName}</span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li>No land details available</li>
                      )}
                    </ul>
                  </td>
                  <td className="supplier-notes">
                    {supplier.notes || "No notes available"}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(supplier)}
                    >
                      Edit
                    </button>
                    {supplier.status !== 'disabled' && (
                      <button
                        className="disable-button"
                        onClick={() => handleOpenDisableConfirm(supplier.supplierId)}
                      >
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No suppliers found matching your criteria
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
            Confirm Disable Supplier
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: '1rem' }}>
              Are you sure you want to disable this supplier?
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

export default ViewSuppliers;