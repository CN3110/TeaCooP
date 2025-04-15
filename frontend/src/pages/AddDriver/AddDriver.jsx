import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./AddDriver.css";

const AddDriver = () => {
  const [driverData, setDriverData] = useState({
    driverId: "Generating...",
    driverName: "",
    driverContactNumber: "",
    driverEmail: "",
    status: "pending",
    notes: "",
    vehicleDetails: [{ vehicleNumber: "", vehicleType: "" }],
  });

  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverData({ ...driverData, [name]: value });
  };

  const handleVehicleDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVehicleDetails = [...driverData.vehicleDetails];
    updatedVehicleDetails[index][name] = value;
    setDriverData({ ...driverData, vehicleDetails: updatedVehicleDetails });
  };

  const addVehicleDetail = () => {
    setDriverData({
      ...driverData,
      vehicleDetails: [...driverData.vehicleDetails, { vehicleNumber: "", vehicleType: "" }],
    });
  };

  const removeVehicleDetail = (index) => {
    const updatedVehicleDetails = driverData.vehicleDetails.filter((_, i) => i !== index);
    setDriverData({ ...driverData, vehicleDetails: updatedVehicleDetails });
  };

  const handleCancel = () => {
    navigate("/view-drivers");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !driverData.driverId ||
      !driverData.driverName ||
      !driverData.driverContactNumber ||
      !driverData.driverEmail
    ) {
      setAlert({
        type: "error",
        message: "Please fill in all required driver fields.",
      });
      return;
    }

    if (
      driverData.vehicleDetails.some(
        (vehicle) => !vehicle.vehicleNumber.trim() || !vehicle.vehicleType.trim()
      )
    ) {
      setAlert({
        type: "error",
        message: "Please fill in all the vehicle details.",
      });
      return;
    }

    const requestBody = {
      
      driverName: driverData.driverName,
      driverContactNumber: driverData.driverContactNumber,
      driverEmail: driverData.driverEmail,
      status: driverData.status,
      notes: driverData.notes,
      vehicleDetails: driverData.vehicleDetails,
    };

    try {
      const response = await fetch("http://localhost:3001/api/drivers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        setAlert({
          type: "success",
          message: "Driver added successfully!",
        });
        setTimeout(() => {
          setAlert(null);
          navigate("/view-drivers");
        }, 2000);
      } else {
        const errorData = await response.json();
        setAlert({
          type: "error",
          message: `Error adding driver: ${errorData.message}`,
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while adding the driver.",
      });
    }
  };

  return (
    <EmployeeLayout>
      <div className="add-driver-container">
        <h2>Add New Driver</h2>

        {alert && (
          <div
            className={`alert ${
              alert.type === "error" ? "alert-error" : "alert-success"
            }`}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="two-column-form">
          <div className="form-column driver-details">
            <div className="form-group">
              <h4>Driver Information</h4>
              <label>Driver ID</label>
              <input
                type="text"
                name="driverId"
                value={driverData.driverId}
                readOnly
                className="read-only-input"
              />
            </div>

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

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="driverContactNumber"
                value={driverData.driverContactNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="driverEmail"
                value={driverData.driverEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={driverData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                name="notes"
                value={driverData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Additional information about the driver..."
              />
            </div>
          </div>

          <div className="form-column vehicle-details">
            <div className="vehicle-details-header">
              <h3>Vehicle Details</h3>
              <button
                type="button"
                className="btn btn-outline-secondary add-vehicle-btn"
                onClick={addVehicleDetail}
              >
                Add Vehicle
              </button>
            </div>

            {driverData.vehicleDetails.map((vehicle, index) => (
              <div key={index} className="vehicle-detail-card">
                <div className="vehicle-card-header">
                  <small>Vehicle No. {index + 1}</small>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm remove-land-btn"
                      onClick={() => removeVehicleDetail(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={vehicle.vehicleNumber}
                    onChange={(e) => handleVehicleDetailsChange(index, e)}
                    required
                  />
                </div>

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

            <div className="form-buttons-container">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Save Driver
              </button>
            </div>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default AddDriver;
