import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import EditDriver from "./EditDriver";
import "./ViewDrivers.css";

const ViewDrivers = () => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const navigate = useNavigate();

  // Fetch all drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/drivers");
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
          setFilteredDrivers(data);
        } else {
          console.error("Failed to fetch drivers");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...drivers];

    if (searchId) {
      filtered = filtered.filter((driver) =>
        driver.driverId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((driver) => driver.status === statusFilter);
    }

    setFilteredDrivers(filtered);
  }, [searchId, statusFilter, drivers]);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleAddDriver = () => {
    navigate("/add-driver");
  };

  const handleEdit = (driver) => {
    navigate(`/edit-driver/${driver.driverId}`);
  };

  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
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
              <BiSearch className="icon" />
            </div>

            <div className="filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
              <button className="add-driver-btn" onClick={handleAddDriver}>
                Add New Driver
              </button>
            </div>
          </div>
        </div>

        <table className="drivers-table">
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Vehicle Details</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((driver) => (
                <tr key={driver.driverId}>
                  <td>{driver.driverId}</td>
                  <td>{driver.driverName}</td>
                  <td>{driver.driverContactNumber}</td>
                  <td>{driver.driverEmail}</td>
                  <td className={`status-cell status-${driver.status}`}>
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </td>
                  <td>
                    <ul className="vehicle-details-list">
                      {driver.vehicleDetails && driver.vehicleDetails.length > 0 ? (
                        driver.vehicleDetails.map((vehicle, index) => (
                          <li key={index}>
                            <span>Vehicle {index + 1}: </span>
                            <span>{vehicle.vehicleNumber} ({vehicle.vehicleType})</span>
                          </li>
                        ))
                      ) : (
                        <li>No vehicle details available</li>
                      )}
                    </ul>
                  </td>
                  <td className="driver-notes">
                    {driver.notes || "No notes available"}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(driver)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No drivers found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <EditDriver driver={selectedDriver} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default ViewDrivers;
