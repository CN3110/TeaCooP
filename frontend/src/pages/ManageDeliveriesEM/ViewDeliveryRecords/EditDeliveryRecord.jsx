import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditDeliveryRecord.css";

const EditDeliveryRecord = () => {
  const { deliveryId } = useParams(); // Extract deliveryId from URL parameters
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    supplierId: "",
    date: "",
    transport: "",
    route: "",
    totalWeight: "",
    totalSackWeight: "",
    forWater: "",
    forWitheredLeaves: "",
    forRipeLeaves: "",
    greenTeaLeaves: "",
    randalu: "",
  });

  console.log("Delivery ID from URL:", deliveryId);

  // Fetch the delivery record data when the component mounts or when deliveryId changes
  useEffect(() => {
    const fetchDeliveryRecord = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/deliveries/${deliveryId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Delivery Record Data:", data);

          // Format the date to "yyyy-MM-dd"
          const formattedDate = data.date.split("T")[0];

          // Update the formData with the formatted date
          setFormData({
            ...data,
            date: formattedDate,
          });
        } else {
          console.error("Failed to fetch delivery record data");
        }
      } catch (error) {
        console.error("Error fetching delivery record:", error);
      }
    };

    if (deliveryId) {
      fetchDeliveryRecord();
    }
  }, [deliveryId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/deliveries/${deliveryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        alert("Failed to update delivery record");
        navigate("/view-deliveries");
      } else {
        alert("Delivery record updated successfully!");
        navigate("/view-deliveries");
      }
    } catch (error) {
      console.error("Error updating delivery record:", error);
      alert("Failed to update delivery record");
    }
  };

  return (
    <div className="edit-delivery-record-container">
      <h3>Edit Delivery Record</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Supplier ID:</label>
          <input
            type="text"
            name="supplierId"
            value={formData.supplierId}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Transport:</label>
          <input
            type="text"
            name="transport"
            value={formData.transport}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Route:</label>
          <input
            type="text"
            name="route"
            value={formData.route}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Total Weight (kg):</label>
          <input
            type="number"
            name="totalWeight"
            value={formData.totalWeight}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Total Sack Weight (kg):</label>
          <input
            type="number"
            name="totalSackWeight"
            value={formData.totalSackWeight}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>For Water (kg):</label>
          <input
            type="number"
            name="forWater"
            value={formData.forWater}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>For Withered Leaves (kg):</label>
          <input
            type="number"
            name="forWitheredLeaves"
            value={formData.forWitheredLeaves}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>For Ripe Leaves (kg):</label>
          <input
            type="number"
            name="forRipeLeaves"
            value={formData.forRipeLeaves}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Randalu (kg):</label>
          <input
            type="number"
            name="randalu"
            value={formData.randalu}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Green Tea Leaves (kg):</label>
          <input
            type="number"
            name="greenTeaLeaves"
            value={formData.greenTeaLeaves}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" 
          onClick={() => navigate("/view-delivery-records")}>
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/view-delivery-records")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDeliveryRecord;