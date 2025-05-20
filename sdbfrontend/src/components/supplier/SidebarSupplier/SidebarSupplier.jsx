import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SidebarSupplier.css";
import {
  MdDashboard as DashboardIcon,
  MdLocalShipping as DeliveryIcon,
  MdAssignment as TransportIcon,
  MdPerson as ProfileIcon,
  MdNotifications as NotificationsIcon,
} from "react-icons/md";

// Bootstrap components
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// Material-UI components
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const SidebarSupplier = () => {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Handle logout confirmation dialog
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleCloseLogoutConfirm = () => {
    setShowLogoutConfirm(false);
  };

  // Actual logout function
  const handleLogout = () => {
    localStorage.clear();
    setShowLogoutConfirm(false);
    setShowAlert(true);
    setTimeout(() => {
      navigate("/");
    }, 1500); // Give time for the alert to show before redirecting
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  return (
    <div className="sidebar-container">
      <h2>Supplier Panel</h2>
      <ul className="nav flex-column">
        
        <li className="nav-item">
                  <Link to="/supplier-notices" className="nav-link">
                  <NotificationsIcon /> Notices
                  </Link>
                </li>
        
        
        <li className="nav-item">
          <Link to="/supplier-delivery-history" className="nav-link">
            <DeliveryIcon /> Delivery History
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/request-transport" className="nav-link">
            <TransportIcon /> Transport Request
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/supplier-profile" className="nav-link">
            <ProfileIcon /> Profile
          </Link>
        </li>
        <li className="nav-item">
          {/* Enhanced Log Out Button */}
          <Button 
            variant="outline-danger" 
            className="logout-btn mt-3" 
            onClick={handleLogoutClick}
            style={{ width: '100%' }}
          >
            Log Out
          </Button>
        </li>
      </ul>

      {/* Bootstrap Logout Confirmation Modal */}
      <Modal show={showLogoutConfirm} onHide={handleCloseLogoutConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out of your supplier account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogoutConfirm}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Log Out
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Material-UI Success Alert */}
      <Snackbar
        open={showAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          You have been successfully logged out.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SidebarSupplier;