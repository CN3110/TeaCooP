import React, { useState } from "react";
import { Link } from "react-router-dom";  // Import Link from React Router
import ProfileEM from "../../pages/Employee/ProfileEM/ProfileEM";  // Import ProfileEM
import "./SidebarEM.css";

const SidebarEM = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  // Open profile modal
  const openProfileModal = () => {
    setIsProfileModalOpen(true);
  };

  // Close profile modal
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  // Toggle Dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Handle logout
  const handleLogout = () => {
    alert("You have been logged out.");
    window.location.href = "/"; // Redirect to home page
  };

  return (
    <div className="menu">
      <div className="menu-list">
        <Link to="/employeedashboard" className="item">Dashboard</Link>

        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("deliveries")}>
            Manage Deliveries 
          </button>
          {openDropdown === "deliveries" && (
            <div className="dropdown-content">
              <Link to="#">Add New Delivery Record</Link>
              <Link to="#">View Delivery Records</Link>
             </div>
          )}
        </div>

        {/* Manage Suppliers Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("suppliers")}>
            Manage Suppliers 
          </button>
          {openDropdown === "suppliers" && (
            <div className="dropdown-content">
              <Link to="/add-supplier">Add Supplier</Link>
              <Link to="/view-suppliers">View Suppliers</Link>
             </div>
          )}
        </div>

        {/* Manage Drivers Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("drivers")}>
            Manage Drivers
          </button>
          {openDropdown === "drivers" && (
            <div className="dropdown-content">
              <Link to="#">Add Driver</Link>
              <Link to="#">View Drivers</Link>
            </div>
          )}
        </div>

        {/* Manage Brokers Dropdown */}
        <div className="dropdown">
          <button className="dropdown-btn" onClick={() => toggleDropdown("brokers")}>
            Manage Brokers
          </button>
          {openDropdown === "brokers" && (
            <div className="dropdown-content">
              <Link to="#">Add Broker</Link>
              <Link to="#">View Brokers</Link>
            </div>
          )}
        </div>

        <Link to="#" className="item" onClick={openProfileModal}>Your Profile</Link> 

        {/* Log Out Button */}
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>

      {isProfileModalOpen && <ProfileEM closeModal={closeProfileModal} />}
    </div>
  );
};

export default SidebarEM;
