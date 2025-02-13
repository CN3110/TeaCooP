import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./AddDelivery.css";

const AddDelivery = () => {
  const [deliveryData, setDeliveryData] = useState({
    supplierId: "",
    transport: "",
    route: "",
    weights: {
      totalWeight: "",
      totalSackWeight: "",
      forWater: "",
      forWitheredLeaves: "",
      forRipeLeaves: "",
      greenTeaLeaves: "",
      randalu: "",
    },
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in deliveryData.weights) {
      setDeliveryData({
        ...deliveryData,
        weights: {
          ...deliveryData.weights,
          [name]: value,
        },
      });
    } else {
      setDeliveryData({
        ...deliveryData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Add today's date to the delivery data
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const dataToSubmit = {
      ...deliveryData,
      date: today, // Automatically add today's date
    };

    console.log("Delivery Data:", dataToSubmit);
    alert("Delivery added successfully!");
    navigate("/manage-deliveries"); // Redirect to the deliveries list page
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/manage-deliveries"); // Redirect to the deliveries list page
  };

  return (
    <EmployeeLayout>
      <div className="add-delivery-container">
        <h2>Add New Delivery</h2>
        <form onSubmit={handleSubmit}>
          {/* Supplier ID */}
          <div className="form-group">
            <label>Supplier ID</label>
            <input
              type="text"
              name="supplierId"
              value={deliveryData.supplierId}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Transport */}
          <div className="form-group">
            <label>Transport</label>
            <input
              type="text"
              name="transport"
              value={deliveryData.transport}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Route */}
          <div className="form-group">
            <label>Route</label>
            <input
              type="text"
              name="route"
              value={deliveryData.route}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Weights Section */}
          <div className="weights-section">
            <h3>Weights</h3>

            {/* Total Weight */}
            <div className="form-group">
              <label>Total Weight</label>
              <input
                type="text"
                name="totalWeight"
                value={deliveryData.weights.totalWeight}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Total Sack Weight */}
            <div className="form-group">
              <label>Total Sack Weight</label>
              <input
                type="text"
                name="totalSackWeight"
                value={deliveryData.weights.totalSackWeight}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* For Water */}
            <div className="form-group">
              <label>For Water</label>
              <input
                type="text"
                name="forWater"
                value={deliveryData.weights.forWater}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* For Withered Leaves */}
            <div className="form-group">
              <label>For Withered Leaves</label>
              <input
                type="text"
                name="forWitheredLeaves"
                value={deliveryData.weights.forWitheredLeaves}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* For Ripe Leaves */}
            <div className="form-group">
              <label>For Ripe Leaves</label>
              <input
                type="text"
                name="forRipeLeaves"
                value={deliveryData.weights.forRipeLeaves}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Green Tea Leaves */}
            <div className="form-group">
              <label>Green Tea Leaves</label>
              <input
                type="text"
                name="greenTeaLeaves"
                value={deliveryData.weights.greenTeaLeaves}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Randalu */}
            <div className="form-group">
              <label>Randalu</label>
              <input
                type="text"
                name="randalu"
                value={deliveryData.weights.randalu}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default AddDelivery;