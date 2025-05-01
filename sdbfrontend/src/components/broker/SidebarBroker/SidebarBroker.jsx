import React from "react";
import { Link } from "react-router-dom";
//import "./SidebarBroker.css";
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
    navigate("/login"); // Redirect to home page
  };

  const SidebarBroker = () => {
    return (
        <div className="sidebar-container">
              <h2>Broker Panel</h2>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link to="/broker-dashboard" className="nav-link">
                    <DashboardIcon /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/broker-view-new-lots" className="nav-link">
                    <DeliveryIcon /> View New Lots
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/broker-confirmed-lots" className="nav-link">
                    <PaymentIcon /> My Confirmed Lots
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/broker-add-sold-prices" className="nav-link">
                    <TransportIcon /> Add Sold Prices
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/broker-profile" className="nav-link">
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

export default SidebarBroker;
  