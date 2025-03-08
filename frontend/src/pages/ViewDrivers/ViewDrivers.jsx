import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./ViewDrivers.css";
import EditDriver from "./EditDriver"; // Import the EditDriver component

const ViewDrivers = () => {
  const [searchId, setSearchId] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedDriver, setSelectedDriver] = useState(null); // State for selected driver
  const navigate = useNavigate();

  // Fetch driver data from the backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/drivers");
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
          setFilteredDrivers(data); // Initialize filteredDrivers with all drivers
        } else {
          console.error("Failed to fetch drivers");
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchId(searchTerm);

    // Filter drivers based on search term
    const filtered = drivers.filter((driver) =>
      driver.driverId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDrivers(filtered);
  };

  // Navigate to the "Add New Driver" page
  const handleAddDriver = () => {
    navigate("/add-driver");
  };

  // Handle edit button click
  const handleEdit = (driver) => {
    console.log("Edit button clicked, navigating to edit page"); // Debugging log
    navigate(`/edit-driver/${driver.driverId}`); // Navigate to the edit page
  };

  // Handle delete button click
  const handleDelete = async (driverId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this driver?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:3001/api/drivers/${driverId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Remove the deleted driver from the list of drivers
          setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.driverId !== driverId));
          setFilteredDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.driverId !== driverId));
          alert("Driver deleted successfully");
        } else {
          alert("Failed to delete driver");
        }
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert("An error occurred while deleting the driver");
      }
    }
  };

  // Close the modal
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
            <button className="add-driver-btn" onClick={handleAddDriver}>
              Add New Driver
            </button>
          </div>
        </div>

        <table className="drivers-table">
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Driver Name</th>
              <th>Contact Number</th>
              <th>Vehicle Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver.driverId}>
                <td>{driver.driverId}</td>
                <td>{driver.driverName}</td>
                <td>{driver.driverContactNumber}</td>
                <td>
                  <ul>
                    {driver.vehicleDetails && driver.vehicleDetails.length > 0 ? (
                      driver.vehicleDetails.map((vehicle, index) => (
                        <li key={index}>
                          <strong>Vehicle No:</strong> {index + 1}, {""}
                          <strong>Vehicle Number:</strong> {vehicle.vehicleNumber}, {""}
                          <strong>Vehicle Type:</strong> {vehicle.vehicleType}, {""}
                        </li>
                      ))
                    ) : (
                      <li>No vehicle details available</li>
                    )}
                  </ul>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(driver)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(driver.driverId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Driver Modal */}
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