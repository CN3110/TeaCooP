import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewDeliveryRecords.css"; // Ensure this file exists

const ViewDeliveryRecords = () => {
  const [supplierId, setSupplierId] = useState(""); // State for search input
  const [deliveries, setDeliveries] = useState([]); // State for all delivery records
  const [filteredDeliveries, setFilteredDeliveries] = useState([]); // State for filtered delivery records
  const navigate = useNavigate();

  // Fetch delivery records when the component mounts
  useEffect(() => {
    const fetchDeliveryRecords = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveries");
        if (response.ok) {
          const data = await response.json();
          setDeliveries(data); // Set all delivery records
          setFilteredDeliveries(data); // Set filtered delivery records
        } else {
          console.error("Failed to fetch delivery records");
        }
      } catch (error) {
        console.error("Error fetching delivery records:", error);
      }
    };

    fetchDeliveryRecords();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSupplierId(searchTerm);

    // Filter deliveries based on supplierId
    const filtered = deliveries.filter((delivery) =>
      delivery.supplierId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDeliveries(filtered);
  };

  // Handle "Add New Delivery Record" button click
  const handleAddDeliveryRecord = () => {
    navigate("/add-delivery-record");
  };

  // Handle "Edit" button click
  const handleEdit = (deliveryId) => {
    navigate(`/edit-delivery-record/${deliveryId}`);
  };

  // Handle "Delete" button click
  const handleDelete = async (deliveryId) => {
    if (window.confirm("Are you sure you want to delete this delivery record?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/deliveries/${deliveryId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Remove the deleted record from the state
          const updatedDeliveries = deliveries.filter(
            (delivery) => delivery.deliveryId !== deliveryId
          );
          setDeliveries(updatedDeliveries);
          setFilteredDeliveries(updatedDeliveries);
          alert("Delivery record deleted successfully!");
        } else {
          console.error("Failed to delete delivery record");
        }
      } catch (error) {
        console.error("Error deleting delivery record:", error);
      }
    }
  };

  return (
    <EmployeeLayout>
      <div className="view-delivery-records-container">
        <div className="content-header">
          <h3>View Delivery Records</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Supplier ID"
                value={supplierId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            <button
              className="add-delivery-btn"
              onClick={() => navigate("/add-new-delivery-record")}
            >
              Add New Delivery Record
            </button>
          </div>
        </div>

        <table className="deliveries-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Date</th>
              <th>Transport</th>
              <th>Route</th>
              <th>Total Weight (kg)</th>
              <th>Total Sack Weight (kg)</th>
              <th>For Water (kg)</th>
              <th>For Withered Leaves (kg)</th>
              <th>For Ripe Leaves (kg)</th>
              <th>Randalu (kg)</th>
              <th>Green Tea Leaves (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery.deliveryId}>
                  <td>{delivery.supplierId}</td>
                  <td>{delivery.date}</td>
                  <td>{delivery.transport}</td>
                  <td>{delivery.route}</td>
                  <td>{delivery.totalWeight}</td>
                  <td>{delivery.totalSackWeight}</td>
                  <td>{delivery.forWater}</td>
                  <td>{delivery.forWitheredLeaves}</td>
                  <td>{delivery.forRipeLeaves}</td>
                  <td>{delivery.randalu}</td>
                  <td>{delivery.greenTeaLeaves}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(delivery.deliveryId)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(delivery.deliveryId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No delivery records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewDeliveryRecords;