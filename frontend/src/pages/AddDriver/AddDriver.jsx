import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./AddDriver.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

  const [alert, setAlert] = useState({ open: false, type: "info", message: "" });
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateSLContact = (contact) => /^(?:\+94|0)?(?:7[01245678])[0-9]{7}$/.test(contact);

  const showAlert = (message, type = "error") => {
    setAlert({ open: true, type, message });
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { driverName, driverContactNumber, driverEmail } = driverData;

    if (!driverName.trim()) return showAlert("Driver name is required.");

    if (!validateSLContact(driverContactNumber)) return showAlert("Invalid contact number.");

    if (!validateEmail(driverEmail)) return showAlert("Invalid email address.");
    if (
      driverData.vehicleDetails.some(
        (v) => !v.vehicleNumber.trim() || !v.vehicleType.trim()
      )
    ) {
      return showAlert("All vehicle fields must be filled.");
    }

    const requestBody = {
      driverName,
      driverContactNumber,
      driverEmail,
      status: driverData.status,
      notes: driverData.notes,
      vehicleDetails: driverData.vehicleDetails,
    };

    try {
      const response = await fetch("http://localhost:3001/api/drivers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        showAlert("Driver added successfully!", "success");
        setTimeout(() => navigate("/view-drivers"), 1500);
      } else {
        const errorData = await response.json();
        showAlert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      showAlert("Something went wrong while adding the driver.");
    }
  };


  return (
    <EmployeeLayout>
      <div className="add-driver-container">

        {/* Snackbar for alerts */}
        <Snackbar
          open={alert.open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity={alert.type} sx={{ width: "100%" }}>
            {alert.message}
          </Alert>
        </Snackbar> 

        <h2>Add New Driver</h2>  

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
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="driverContactNumber"
                value={driverData.driverContactNumber}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="driverEmail"
                value={driverData.driverEmail}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={driverData.status} onChange={handleInputChange}>
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
                  {index > -1 && (
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
                  />
                </div>

                <div className="form-group">
                  <label>Vehicle Type</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={vehicle.vehicleType}
                    onChange={(e) => handleVehicleDetailsChange(index, e)}
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
