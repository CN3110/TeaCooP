import React from "react";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout"; // Import EmployeeLayout
import ContentEM from "../../components/ContentEM/ContentEM";
import "./EmployeeDashboard.css"; // Import your CSS file

const EmployeeDashboard = () => {
  return (
    <EmployeeLayout> {/* Use EmployeeLayout as the wrapper */}
      <ContentEM /> {/* ContentEM will be rendered inside EmployeeLayout */}
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;