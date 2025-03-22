import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditDriver.css";

const EditDriver = () => {
  const { driverId } = useParams(); // Extract driverId from URL parameters
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    driverId: "",
    driverName: "",
    driverContactNumber: "",
    email: "", // Added email field
    vehicleDetails: [],
  });

  // Debugging log
  console.log("Driver ID from URL:", driverId);

  // Fetch the selected driver's data
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/drivers/${driverId}` // Use driverId from URL
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Driver Data:", data); // Debugging log
          setFormData(data);
        } else {
          console.error("Failed to fetch driver data");
        }
      } catch (error) {
        console.error("Error fetching driver:", error);
      }
    };

    if (driverId) {
      fetchDriver(); // Fetch driver data only if driverId is defined
    }
  }, [driverId]); // Add driverId as a dependency

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle vehicle details changes
  const handleVehicleDetailsChange = (index, field, value) => {
    const updatedVehicleDetails = [...formData.vehicleDetails];
    updatedVehicleDetails[index][field] = value;
    setFormData({
      ...formData,
      vehicleDetails: updatedVehicleDetails,
    });
  };

  // Handle adding a new vehicle detail
  const handleAddVehicleDetail = () => {
    setFormData({
      ...formData,
      vehicleDetails: [
        ...formData.vehicleDetails,
        { vehicleNumber: "", vehicleType: "" }, // Add a new empty vehicle detail
      ],
    });
  };

  // Handle removing a vehicle detail
  const handleRemoveVehicleDetail = (index) => {
    const updatedVehicleDetails = formData.vehicleDetails.filter(
      (vehicle, i) => i !== index
    );
    setFormData({
      ...formData,
      vehicleDetails: updatedVehicleDetails,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/drivers/${driverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Driver updated successfully!");
        navigate("/view-drivers");
      } else {
        const errorData = await response.json();
        alert(`Error updating driver: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      alert("An error occurred while updating the driver");
    }
  };

  return (
    <div className="edit-driver-container">
      <h2>Edit Driver</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Driver ID</label>
          <input
            type="text"
            name="driverId"
            value={formData.driverId || ""}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Driver Name</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            name="driverContactNumber"
            value={formData.driverContactNumber || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.driverEmail || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Vehicle Details</label>
          {formData.vehicleDetails.map((vehicle, index) => (
            <div key={index} className="vehicle-details">
              <label>Vehicle No: {index + 1}</label>
              <input
                type="text"
                placeholder="Vehicle Number"
                value={vehicle.vehicleNumber || ""}
                onChange={(e) =>
                  handleVehicleDetailsChange(
                    index,
                    "vehicleNumber",
                    e.target.value
                  )
                }
              />
              <input
                type="text"
                placeholder="Vehicle Type"
                value={vehicle.vehicleType || ""}
                onChange={(e) =>
                  handleVehicleDetailsChange(
                    index,
                    "vehicleType",
                    e.target.value
                  )
                }
              />
              {/* Remove Vehicle Button */}
              <button
                type="button"
                className="remove-vehicle-btn"
                onClick={() => handleRemoveVehicleDetail(index)}
              >
                Remove
              </button>
            </div>
          ))}
          {/* Add New Vehicle Button */}
          <button
            type="button"
            className="add-vehicle-btn"
            onClick={handleAddVehicleDetail}
          >
            Add New Vehicle
          </button>
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/view-drivers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDriver;