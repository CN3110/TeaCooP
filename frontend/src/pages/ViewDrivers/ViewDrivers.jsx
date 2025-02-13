import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./ViewDrivers.css";

const ViewDrivers = () => {
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  // Sample driver data (replace with real data from an API or state)
  const [drivers, setDrivers] = useState([
    { id: "D1001", name: "John Doe", contact: "0712345678", vehicleNo: "ABC-123" },
    { id: "D1002", name: "Jane Smith", contact: "0712345679", vehicleNo: "XYZ-456"},
    { id: "D1003", name: "Sam Brown", contact: "0712345680", vehicleNo: "DEF-789" },
  ]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Add logic to filter drivers based on searchId
    console.log("Search for Driver ID:", searchId);
  };

  // Navigate to the "Add New Driver" page
  const handleAddDriver = () => {
    navigate("/add-driver");
  };

  return (
    <EmployeeLayout>
      <div className="view-driver-container">
        <div className="content-header">
          <h3>View Drivers</h3>

          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Driver ID"
                value={searchId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" onClick={handleSearchSubmit} />
            </div>
            <button className="add-driver-btn" onClick={handleAddDriver}>
              + Add New Driver
            </button>
          </div>
        </div>

        <table className="drivers-table">
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Contact Number</th>
              <th>Vehicle No.</th>
              
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.contact}</td>
                <td>{driver.vehicleNo}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewDrivers;