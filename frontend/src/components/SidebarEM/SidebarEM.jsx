import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileEM from "../../pages/Employee/ProfileEM/EProfile"; 
import "./SidebarEM.css";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

const SidebarEM = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Open confirmation dialog
  const handleLogoutClick = () => setLogoutDialogOpen(true);
  const handleDialogClose = () => setLogoutDialogOpen(false);

  // Confirm logout
  const confirmLogout = () => {
    localStorage.clear();
    setLogoutDialogOpen(false);
    setSnackbarOpen(true); // Show in-app alert
    setTimeout(() => navigate("/"), 1500); // Navigate after a short delay
  };

  return (
    <div className="menu">
      <div className="menu-list">
        <Link to="/employee-dashboard" className="item">Dashboard</Link>
        <Link to="/employee-notices" className="item">Notices</Link>      
          

        {/* Manage Deliveries Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("deliveries")}
          >
            Manage Deliveries
          </button>
          {openDropdown === "deliveries" && (
            <div className="dropdown-content">
              <Link to="/add-new-delivery-record">Add New Delivery Record</Link>
              <Link to="/view-delivery-records">View Delivery Records</Link>
            </div>
          )}
        </div> 

        {/* Manage Sales Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("sales")}
          >
            Manage Lots
          </button>
          {openDropdown === "sales" && (
            <div className="dropdown-content">
              <Link to="/employee-dashboard-create-lot">Add New Lot</Link>
              <Link to="/view-lots">View Lot Records</Link>
              <Link to="/view-confirmed-lots">Confirm Lot Orders</Link>
              <Link to="/view-sold-prices">View Sold Prices</Link>
            </div>
          )}
        </div>

        <Link to="/tea-production-summary" className="item">Tea Production Summary</Link>
        <Link to="/tea-production" className="item">Tea Production Management </Link>
        <Link to="/tea-type-stock-management" className="item">Tea Type Stock Management</Link>
        <Link to="/tea-packet" className="item">Tea Packet Management</Link>
        <Link to="/raw-tea-records" className="item">Raw Tea Records</Link>

        {/* Manage Suppliers Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("suppliers")}>Manage Suppliers</button>
          {openDropdown === "suppliers" && (
            <div className="dropdown-content">
              <Link to="/add-supplier">Add Supplier</Link>
              <Link to="/view-suppliers">View Suppliers</Link>
            </div>
          )}
        </div>

        {/* Manage Drivers Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("drivers")}>Manage Drivers</button>
          {openDropdown === "drivers" && (
            <div className="dropdown-content">
              <Link to="/add-driver">Add Driver</Link>
              <Link to="/view-drivers">View Drivers</Link>
            </div>
          )}
        </div>

        {/* Manage Brokers Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("brokers")}>Manage Brokers</button>
          {openDropdown === "brokers" && (
            <div className="dropdown-content">
              <Link to="/add-broker">Add Broker</Link>
              <Link to="/view-brokers">View Brokers</Link>
            </div>
          )} 
        </div>

        {/* Manage Tea types Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("teaTypes")}>Tea Types Management</button>
          {openDropdown === "teaTypes" && (
            <div className="dropdown-content">
              <Link to="/add-tea-type">Add Tea Type</Link>
              <Link to="/view-tea-types">View Tea Types</Link>
            </div>
          )}
        </div>

        <Link to="/employee-view-transport-requests" className="item">View Transport Requests</Link>
        <Link to="/employee-dashboard-manage-delivery-routes" className="item">Manage Delivery Routes</Link>       
        
        <Link to="/employee-profile" className="item" onClick={openProfileModal}>
          Your Profile
        </Link>
      </div>
      
      
      {/* Profile modal */}
      {isProfileModalOpen && <ProfileEM closeModal={closeProfileModal} />}


{/* Logout button opens confirmation dialog */}
        <button className="logout-btn" onClick={handleLogoutClick}>Log Out</button>
      {/* Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          <Button onClick={confirmLogout} color="error">Log Out</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          You have been logged out.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SidebarEM;