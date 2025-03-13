import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./AddDriver.css";

const AddDriver = () => {
  const [driverData, setDriverData] = useState({
    driverId: "",
    driverName: "",
    contactNumber: "",
    vehicleDetails: [{ vehicleNo: "", vehicleType: "" }],
  });

  const navigate = useNavigate();

  // Handle input changes for driver details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData({ ...driverData, [name]: value });
  };

  // Handle input changes for vehicle details
  const handleVehicleDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVehicleDetails = [...driverData.vehicleDetails];
    updatedVehicleDetails[index][name] = value;
    setDriverData({ ...driverData, vehicleDetails: updatedVehicleDetails });
  };

  // Add a new vehicle detail field
  const addVehicleDetail = () => {
    setDriverData({
      ...driverData,
      vehicleDetails: [
        ...driverData.vehicleDetails,
        { vehicleNo: "", vehicleType: "" },
      ],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!driverData.driverId || !driverData.driverName || !driverData.contactNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate vehicle details
    if (driverData.vehicleDetails.some((vehicle) => !vehicle.vehicleNo || !vehicle.vehicleType)) {
      alert("Please fill in all vehicle details.");
      return;
    }

    // Log the request body for debugging
    const requestBody = {
      driverId: driverData.driverId,
      driverName: driverData.driverName,
      driverContactNumber: driverData.contactNumber,
      vehicleDetails: driverData.vehicleDetails,
    };
    console.log("Request Body:", requestBody);

    try {
      const response = await fetch("http://localhost:3001/api/drivers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Driver added successfully!");
        navigate("/view-drivers");
      } else {
        const errorData = await response.json();
        alert(`Error adding driver: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding driver:", error);
      alert("An error occurred while adding the driver");
    }
  };

  return (
    <EmployeeLayout>
      <div className="add-driver-container">
        <h2>Add New Driver</h2>
        <form onSubmit={handleSubmit}>
          {/* Driver ID */}
          <div className="form-group">
            <label>Driver ID</label>
            <input
              type="text"
              name="driverId"
              value={driverData.driverId}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Driver Name */}
          <div className="form-group">
            <label>Driver Name</label>
            <input
              type="text"
              name="driverName"
              value={driverData.driverName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={driverData.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Vehicle Details */}
          <div className="vehicle-details">
            <h3>Vehicle Details</h3>
            {driverData.vehicleDetails.map((vehicle, index) => (
              <div key={index} className="vehicle-detail-group">
                {/* Vehicle Number Label */}
                <div className="form-group">
                  <small>Vehicle No. {index + 1}</small>
                </div>

                {/* Vehicle No. */}
                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={vehicle.vehicleNo}
                    onChange={(e) => handleVehicleDetailsChange(index, e)}
                    required
                  />
                </div>

                {/* Vehicle Type */}
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={vehicle.vehicleType}
                    onChange={(e) => handleVehicleDetailsChange(index, e)}
                    required
                  />
                </div>
              </div>
            ))}

            {/* Button to add more vehicle details */}
            <button
              type="button"
              className="add-vehicle-btn"
              onClick={addVehicleDetail}
            >
              Add More Vehicle
            </button>
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={() => navigate("/view-drivers")}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default AddDriver;