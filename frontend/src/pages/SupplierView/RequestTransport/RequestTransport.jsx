import React, { useState } from "react";
import SupplierLayout from "../../../components/Supplier/SupplierLayout/SupplierLayout";
import "./RequestTransport.css";

const RequestTransport = () => {
  const [reqDeliveryData, setReqDeliveryData] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to an API
    console.log("Delivery Data:", reqDeliveryData);
    alert("Transport request submitted successfully!");
  };

  return (
    <SupplierLayout>
      <div className="add-new-delivery-request">
        <h3>Requesting Transport</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date: </label>
            <input
              type="date"
              name="reqDate"
              value={reqDeliveryData.reqDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Time: </label>
            <input
              type="time"
              name="reqTime"
              value={reqDeliveryData.reqTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Sacks: </label>
            <input
              type="number"
              name="reqNumberOfSacks"
              value={reqDeliveryData.reqNumberOfSacks}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Weight: </label>
            <input
              type="number"
              name="reqWeight"
              value={reqDeliveryData.reqWeight}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address/Location: </label>
            <input
              type="text"
              name="reqAddress"
              value={reqDeliveryData.reqAddress}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setReqDeliveryData({
              reqDate: "",
              reqTime: "",
              reqNumberOfSacks: "",
              reqWeight: "",
              reqAddress: ""
            })}>
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