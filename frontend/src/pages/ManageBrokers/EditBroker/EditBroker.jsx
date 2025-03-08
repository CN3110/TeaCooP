import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditBroker.css";

const EditBroker = () => {
  const { brokerId } = useParams(); // Extract brokerId from URL parameters
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    brokerId: "",
    brokerName: "",
    brokerContactNumber: "",
    brokerEmail: "",
    brokerCompanyName: "",
    brokerCompanyContact: "",
    brokerCompanyEmail: "",
    brokerCompanyAddress: "",
  });

  // Debugging log
  console.log("Broker ID from URL:", brokerId);

  // Fetch the selected broker's data
  useEffect(() => {
    const fetchBroker = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/brokers/${brokerId}` // Use brokerId from URL
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Broker Data:", data); // Debugging log
          setFormData(data);
        } else {
          console.error("Failed to fetch broker data");
        }
      } catch (error) {
        console.error("Error fetching broker:", error);
      }
    };

    if (brokerId) {
      fetchBroker(); // Fetch broker data only if brokerId is defined
    }
  }, [brokerId]); // Add brokerId as a dependency

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/brokers/${brokerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (response.ok) {
        alert("Broker details updated successfully!");
        navigate("/view-brokers");
      } else {
        const errorData = await response.json();
        alert(`Error updating broker details: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating broker details:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="edit-broker-container">
      <h3>Edit Broker</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Broker ID</label>
          <input
            type="text"
            name="brokerId"
            value={formData.brokerId || ""}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Broker Name</label>
          <input
            type="text"
            name="brokerName"
            value={formData.brokerName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Broker Contact Number</label>
          <input
            type="text"
            name="brokerContactNumber"
            value={formData.brokerContactNumber || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Broker Email</label>
          <input
            type="email"
            name="brokerEmail"
            value={formData.brokerEmail || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Broker Company Name</label>
          <input
            type="text"
            name="brokerCompanyName"
            value={formData.brokerCompanyName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Broker Company Contact Number</label>
          <input
            type="text"
            name="brokerCompanyContact"
            value={formData.brokerCompanyContact || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Broker Company Email</label>
          <input
            type="email"
            name="brokerCompanyEmail"
            value={formData.brokerCompanyEmail || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Broker Company Address</label>
          <input
            type="text"
            name="brokerCompanyAddress"
            value={formData.brokerCompanyAddress || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/view-brokers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBroker;
