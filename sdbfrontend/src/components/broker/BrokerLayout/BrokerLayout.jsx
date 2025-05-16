import React from "react";
import SidebarBroker from "../SidebarBroker/SidebarBroker";


const BrokerLayout = ({ children }) => {
  return (
    <div className="d-flex">
      
      {/* Sidebar stays fixed */}
      <SidebarBroker />

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        {children} {/* This will render the page content dynamically */}
      </div>
    </div>
  );
};

export default BrokerLayout;
