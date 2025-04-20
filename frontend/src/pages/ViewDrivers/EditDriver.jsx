import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./EditDriver.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditDriverPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driverId: "",
    driverName: "",
    driverContactNumber: "",
    driverEmail: "",
    status: "active",
    notes: "",
    vehicleDetails: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateSLContact = (contact) => /^(?:\+94|0)?(?:7[01245678])[0-9]{7}$/.test(contact);

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/drivers/${driverId}`);
        if (!response.ok) throw new Error("Failed to fetch driver data");
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error fetching driver:", error);
        showSnackbar("Failed to load driver data.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    if (driverId) fetchDriver();
  }, [driverId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVehicles = [...formData.vehicleDetails];
    updatedVehicles[index][name] = value;
    setFormData({ ...formData, vehicleDetails: updatedVehicles });
  };

  const handleAddVehicleDetail = () => {
    setFormData((prev) => ({
      ...prev,
      vehicleDetails: [...prev.vehicleDetails, { vehicleNumber: "", vehicleType: "" }],
    }));
  };

  const handleRemoveVehicleDetail = (index) => {
    if (window.confirm("Are you sure you want to remove this vehicle?")) {
      const updatedVehicles = [...formData.vehicleDetails];
      updatedVehicles.splice(index, 1);
      setFormData({ ...formData, vehicleDetails: updatedVehicles });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.driverName.trim()) return showSnackbar("Driver name is required.", "warning");
    if (!validateSLContact(formData.driverContactNumber)) return showSnackbar("Invalid contact number.", "warning");
    if (!validateEmail(formData.driverEmail)) return showSnackbar("Invalid email address.", "warning");

    for (let vehicle of formData.vehicleDetails) {
      if (!vehicle.vehicleNumber.trim() || !vehicle.vehicleType.trim()) {
        return showSnackbar("All vehicle details must be filled.", "warning");
      }
    }

    if (formData.status === "disabled") {
      const confirmDisable = window.confirm(
        "Are you sure you want to disable this driver? The record will be kept but marked as inactive."
      );
      if (!confirmDisable) return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/drivers/${driverId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showSnackbar(`Driver ${formData.status === "disabled" ? "disabled" : "updated"} successfully!`, "success");
        setTimeout(() => navigate("/view-drivers"), 1500);
      } else {
        const err = await response.json();
        showSnackbar(`Failed to update driver: ${err.message || "Unknown error"}`, "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showSnackbar("An error occurred while updating the driver.", "error");
    }
  };

  if (isLoading) return <div className="loading">Loading driver data...</div>;

  return (
    <div className="edit-driver-container">
      <h2>Edit Driver - {formData.driverId} {formData.driverName}</h2>

      <form onSubmit={handleSubmit} className="driver-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Driver ID</label>
              <input type="text" value={formData.driverId} readOnly className="read-only" />
            </div>

            <div className="form-group">
              <label>Driver Name *</label>
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="driverContactNumber"
                value={formData.driverContactNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="driverEmail"
                value={formData.driverEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Notes</h3>
          <div className="form-group">
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="4"
              placeholder="Additional information about the driver..."
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Vehicle Details</h3>
            <button type="button" className="add-vehicle-btn" onClick={handleAddVehicleDetail}>
              + Add Vehicle
            </button>
          </div>

          {formData.vehicleDetails.length === 0 ? (
            <p className="no-vehicle">No vehicle details available</p>
          ) : (
            formData.vehicleDetails.map((vehicle, index) => (
              <div key={index} className="vehicle-card">
                <div className="vehicle-header">
                  <h4>Vehicle {index + 1}</h4>
                  <button
                    type="button"
                    className="remove-vehicle-btn"
                    onClick={() => handleRemoveVehicleDetail(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className="vehicle-grid">
                  <div className="form-group">
                    <label>Vehicle Number *</label>
                    <input
                      type="text"
                      name="vehicleNumber"
                      value={vehicle.vehicleNumber}
                      onChange={(e) => handleVehicleDetailsChange(index, e)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Vehicle Type *</label>
                    <input
                      type="text"
                      name="vehicleType"
                      value={vehicle.vehicleType}
                      onChange={(e) => handleVehicleDetailsChange(index, e)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/view-drivers")}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EditDriverPage;
