import React from "react";
import AdminSideBar from "../AdminSideBar/AdminSideBar";
import "./AdminLayout.css";

const EmployeeLayout = ({ children }) => {
  return (
    <div className="employee-layout">
      <AdminSideBar/>
      <div className="employee-layout-content">
        <div className="content-wrapper">
          {children}  {/*use to render the employee page contents*/}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;