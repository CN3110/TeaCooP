import React from "react";
import AdminSideBar from "../../../components/AdminSideBar/AdminSideBar";
import "./AdminDashboard.css"; 

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminSideBar />
      <div className="admin-dashboard-content">
        <div className="content-wrapper">
          <h1 className="header-title">Admin Dashboard</h1>
          {/* Add your dashboard content here */}
          <p>Welcome to the Admin Dashboard!</p>
        </div>
      </div>
      </div>
  );
};

export default AdminDashboard

