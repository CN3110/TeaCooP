import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link from React Router
import "./AdminSideBar.css"; 

const AdminSideBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open
  const navigate = useNavigate();
  // Toggle Dropdown
  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    alert("You have been logged out.");
    navigate("/"); // Redirect to Login page
  };

  return (
    <div className="menu">
      <div className="menu-list">
        <Link to="/admin-dashboard" className="item">
          Dashboard
        </Link>
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
            Manage Sales Records
          </button>
          {openDropdown === "sales" && (
            <div className="dropdown-content">
              <Link to="/employee-dashboard-create-lot">Add New Sale</Link>
              <Link to="/view-lots">View Sales Records</Link>
              <Link to="#">Confirm Sale Orders</Link>
            </div>
          )}
        </div>

        {/* Manage Transport Requests Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("transportRequests")}
          >
            Transport Requests
          </button>
          {openDropdown === "transportRequests" && (
            <div className="dropdown-content">
              <Link to="/employee-view-transport-requests">
                View Transport Requests
              </Link>
            </div>
          )}
        </div>

        {/* Manage Tea types Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("teaTypes")}
          >
            Tea Types
          </button>
          {openDropdown === "teaTypes" && (
            <div className="dropdown-content">
              <Link to="/add-tea-type">Add Tea Type</Link>
              <Link to="/view-tea-types">View Tea Types</Link>
            </div>
          )}
        </div>

        <Link to="/employee-dashboard-manage-delivery-routes" className="item">
          Manage Delivery Routes
        </Link>

        {/* Manage Suppliers Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("suppliers")}
          >
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
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("drivers")}
          >
            Manage Drivers
          </button>
          {openDropdown === "drivers" && (
            <div className="dropdown-content">
              <Link to="/add-driver">Add Driver</Link>
              <Link to="/view-drivers">View Drivers</Link>
            </div>
          )}
        </div>

        {/* Manage Brokers Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("brokers")}
          >
            Manage Brokers
          </button>
          {openDropdown === "brokers" && (
            <div className="dropdown-content">
              <Link to="/add-broker">Add Broker</Link>
              <Link to="/view-brokers">View Brokers</Link>
            </div>
          )}
        </div>
        
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => toggleDropdown("employees")}
          >
            Manage Employees
          </button>
          {openDropdown === "employees" && (
            <div className="dropdown-content">
              <Link to="/add-employee">Add New Employee</Link>
              <Link to="/view-employees">View Employees</Link>
            </div>
          )}
        </div>

        

       

        {/* Log Out Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>

    </div>
  );
};

export default AdminSideBar;
