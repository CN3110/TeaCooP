import React from "react";
import SidebarSupplier from "../SidebarSupplier/SidebarSupplier";

const SupplierLayout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar stays fixed */}
      <SidebarSupplier />

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        {children} {/* This will render the page content dynamically */}
      </div>
    </div>
  );
};

export default SupplierLayout;
