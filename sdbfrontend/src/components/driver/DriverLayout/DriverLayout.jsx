import React from "react";
import SidebarDriver from "../SidebarDriver/SidebarDriver";

const DriverLayout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar stays fixed */}
      <SidebarDriver />

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        {children} {/* This will render the page content dynamically */}
      </div>
    </div>
  );
};

export default DriverLayout;
