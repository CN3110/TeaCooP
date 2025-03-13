import React from "react";
import SidebarEM from "../SidebarEM/SidebarEM";
import "./EmployeeLayout.css";

const EmployeeLayout = ({ children }) => {
  return (
    <div className="employee-layout">
      <SidebarEM />
      <div className="employee-layout-content">
        <div className="content-wrapper">
          {children}  {/*use to render the employee page contents*/}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLayout;