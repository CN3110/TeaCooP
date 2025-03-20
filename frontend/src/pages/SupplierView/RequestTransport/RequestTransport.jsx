import React, { useState } from "react";
import SupplierLayout from "../../../components/Supplier/SupplierLayout/SupplierLayout";
import "./RequestTransport.css";

const RequestTransport = () => {
  const [reqDeliveryData, setReqDeliveryData] = useState({
    supplierId: "",  // Add supplierId field for now
    reqDate: "",
    reqTime: "",
    reqNumberOfSacks: "",
    reqWeight: "",
    reqAddress: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReqDeliveryData({
      ...reqDeliveryData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert date to YYYY-MM-DD format (if needed)
    const formattedDate = new Date(reqDeliveryData.reqDate)
      .toISOString()
      .split("T")[0]; // Extracts only YYYY-MM-DD part
  
    // Ensure time is in HH:MM:SS format
    const formattedTime = reqDeliveryData.reqTime + ":00"; // Adds seconds if missing
  
    const requestData = {
      ...reqDeliveryData,
      reqDate: formattedDate,
      reqTime: formattedTime,
    };
  
    try {
      const response = await fetch("http://localhost:3001/api/transportRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        alert("Transport request submitted successfully!");
        setReqDeliveryData({
          supplierId: "",
          reqDate: "",
          reqTime: "",
          reqNumberOfSacks: "",
          reqWeight: "",
          reqAddress: "",
        });
      } else {
        alert("Failed to submit transport request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("An error occurred while submitting the request");
    }
  };
  

  return (
    <SupplierLayout>
      <div className="add-new-delivery-request">
        <h3>Requesting Transport</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Supplier ID:</label>
            <input
              type="text"
              name="supplierId"
              value={reqDeliveryData.supplierId}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="reqDate"
              value={reqDeliveryData.reqDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="reqTime"
              value={reqDeliveryData.reqTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Sacks:</label>
            <input
              type="number"
              name="reqNumberOfSacks"
              value={reqDeliveryData.reqNumberOfSacks}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Weight:</label>
            <input
              type="number"
              name="reqWeight"
              value={reqDeliveryData.reqWeight}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address/Location:</label>
            <input
              type="text"
              name="reqAddress"
              value={reqDeliveryData.reqAddress}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={() =>
                setReqDeliveryData({
                  supplierId: "",
                  reqDate: "",
                  reqTime: "",
                  reqNumberOfSacks: "",
                  reqWeight: "",
                  reqAddress: ""
                })
              }
            >
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </SupplierLayout>
  );
};

export default RequestTransport;
