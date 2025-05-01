import React from "react";
import { Link } from "react-router-dom";
import "./SidebarSupplier.css"; 
import {
  MdDashboard as DashboardIcon,
  MdLocalShipping as DeliveryIcon,
  MdPayment as PaymentIcon,
  MdAssignment as TransportIcon,
  MdPerson as ProfileIcon,
} from "react-icons/md";

// Handle logout
const handleLogout = () => {
  localStorage.clear(); // Clear local storage
  alert("You have been logged out.");
  navigate("/login"); // Redirect to Login page
};


const SidebarSupplier = () => {
  return (
    <div className="sidebar-container">
      <h2>Supplier Panel</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/supplier-dashboard" className="nav-link">
            <DashboardIcon /> Dashboard
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
          {/* Log Out Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarSupplier;
