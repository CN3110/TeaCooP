import React, { useState, useEffect } from "react";

const EditDeliveryRecord = ({ closeModal, deliveryId }) => {
  const [deliveryRecord, setDeliveryRecord] = useState({
    supplierId: "",
    date: "",
    transport: "",
    route: "",
    totalWeight: "",
    totalSackWeight: "",
    forWater: "",
    forWitheredLeaves: "",
    forRipeLeaves: "",
    randalu: "",
    greenTeaLeaves: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch the delivery record data when the component mounts or when deliveryId changes
  useEffect(() => {
    if (deliveryId) {
      fetch(`http://localhost:3001/api/deliveries/${deliveryId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch delivery record");
          }
          return response.json();
        })
        .then((data) => {
          setDeliveryRecord(data); // Populate the form with fetched data
        })
        .catch((error) => {
          console.error("Error fetching delivery record:", error);
          alert("Failed to fetch delivery record. Please try again.");
        });
    }
  }, [deliveryId]);

  const handleChange = (e) => {
    setDeliveryRecord({ ...deliveryRecord, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Perform the update operation here
    fetch(`http://localhost:3001/api/deliveries/${deliveryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deliveryRecord),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update delivery record");
        }
        return response.json();
      })
      .then((data) => {
        alert("Delivery record updated successfully!");
        setIsEditing(false);
        closeModal(); // Close the modal after successful update
      })
      .catch((error) => {
        console.error("Error updating delivery record:", error);
        alert("Failed to update delivery record. Please try again.");
      });
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h4>Edit Delivery Record</h4>

        <div className="profile-details">
          <label>Supplier ID:</label>
          <input
            type="text"
            name="supplierId"
            value={deliveryRecord.supplierId}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={deliveryRecord.date}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Transport:</label>
          <input
            type="text"
            name="transport"
            value={deliveryRecord.transport}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Route:</label>
          <input
            type="text"
            name="route"
            value={deliveryRecord.route}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Total Weight:</label>
          <input
            type="number"
            name="totalWeight"
            value={deliveryRecord.totalWeight}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Total Sack Weight:</label>
          <input
            type="number"
            name="totalSackWeight"
            value={deliveryRecord.totalSackWeight}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>For Water:</label>
          <input
            type="number"
            name="forWater"
            value={deliveryRecord.forWater}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>For Withered Leaves:</label>
          <input
            type="number"
            name="forWitheredLeaves"
            value={deliveryRecord.forWitheredLeaves}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>For Ripe Leaves:</label>
          <input
            type="number"
            name="forRipeLeaves"
            value={deliveryRecord.forRipeLeaves}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Randalu:</label>
          <input
            type="number"
            name="randalu"
            value={deliveryRecord.randalu}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Green Tea Leaves:</label>
          <input
            type="number"
            name="greenTeaLeaves"
            value={deliveryRecord.greenTeaLeaves}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="button-group">
          {isEditing ? (
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
          ) : (
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          <button className="close-button" onClick={closeModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryRecord;