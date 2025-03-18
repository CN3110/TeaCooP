import React from "react";
import { Link } from "react-router-dom";
import "./SidebarDriver.css";

import {
  MdDashboard as DashboardIcon,
  MdLocalShipping as DeliveryIcon,
  MdPayment as PaymentIcon,
  MdAssignment as TransportIcon,
  MdPerson as ProfileIcon,
} from "react-icons/md";

const SidebarDriver = () => {
  return (
    <div className="sidebar-container">
      <h2>Driver Panel</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/driverdashboard" className="nav-link">
            <DashboardIcon /> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/driver-requested-tranport" className="nav-link">
            <TransportIcon /> Requested Transport
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/driver-delivery-history" className="nav-link">
            <DeliveryIcon /> Delivery History
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/driver-payment-records" className="nav-link">
            <PaymentIcon /> Payment Records
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/driver-profile" className="nav-link">
            <ProfileIcon /> Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link text-danger">
            <i className="bi bi-box-arrow-right"></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SidebarDriver;
