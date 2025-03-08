import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./AddBroker.css";

const AddBroker = () => {
  const [brokerData, setBrokerData] = useState({
    brokerId: "",
    brokerName: "",
    brokerContact: "",
    brokerEmail: "",
    brokerCompanyName: "",
    brokerCompanyContact: "",
    brokerCompanyEmail: "",
    brokerCompanyAddress: "",
  });

  const navigate = useNavigate();

  // Handle input changes for broker details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrokerData({ ...brokerData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Fixed typo
  
    if (
      !brokerData.brokerId ||
      !brokerData.brokerName ||
      !brokerData.brokerContact ||
      !brokerData.brokerEmail ||
      !brokerData.brokerCompanyName ||
      !brokerData.brokerCompanyContact ||
      !brokerData.brokerCompanyEmail ||
      !brokerData.brokerCompanyAddress
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const requestBody = {
      brokerId: brokerData.brokerId,
      brokerName: brokerData.brokerName,
      brokerContact: brokerData.brokerContact,
      brokerEmail: brokerData.brokerEmail,
      brokerCompanyName: brokerData.brokerCompanyName,
      brokerCompanyContact: brokerData.brokerCompanyContact,
      brokerCompanyEmail: brokerData.brokerCompanyEmail,
      brokerCompanyAddress: brokerData.brokerCompanyAddress,
    };
  
    try {
      const response = await fetch("http://localhost:3001/api/brokers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        alert("Broker added successfully!");
        navigate("/view-brokers");
      } else {
        const errorData = await response.json();
        alert(`Error adding broker: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding broker:", error);
      alert("An error occurred while adding the broker.");
    }
  };

  return (
    <EmployeeLayout>
      <div className="add-broker-container">
        <h2>Add Broker</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="brokerId">Broker ID</label>
            <input
              type="text"
              id="brokerId"
              name="brokerId"
              value={brokerData.brokerId}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brokerName">Broker Name</label>
            <input
              type="text"
              id="brokerName"
              name="brokerName"
              value={brokerData.brokerName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brokerContact">Broker Contact Number</label>
            <input
              type="number"
              id="brokerContact"
              name="brokerContact"
              value={brokerData.brokerContact}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brokerEmail">Broker Email Address</label>
            <input
              type="text"
              id="brokerEmail"
              name="brokerEmail"
              value={brokerData.brokerEmail}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brokerCompanyName">Company Name</label>
            <input
              type="text"
              id="brokerCompanyName"
              name="brokerCompanyName"
              value={brokerData.brokerCompanyName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brokerCompanyContact">Company Contact Number</label>
            <input
              type="number"
              id="brokerCompanyContact"
              name="brokerCompanyContact"
              value={brokerData.brokerCompanyContact}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brokerCompanyEmail">Company Email Address</label>
            <input
              type="text"
              id="brokerCompanyEmail"
              name="brokerCompanyEmail"
              value={brokerData.brokerCompanyEmail}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="brokerCompanyAddress">Company Address</label>
            <input
              type="text"
              id="brokerCompanyAddress"
              name="brokerCompanyAddress"
              value={brokerData.brokerCompanyAddress}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/view-brokers")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default AddBroker;
