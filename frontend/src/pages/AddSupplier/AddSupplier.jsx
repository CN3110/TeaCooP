import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { v4 as uuidv4 } from "uuid";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./AddSupplier.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddSupplier = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const [supplierData, setSupplierData] = useState({
    supplierId: "Generating...",
    name: "",
    contact: "",
    email: "",
    status: "pending",
    notes: "",
    landDetails: [
      {
        landId: uuidv4(),
        landSize: "",
        landAddress: "",
        route: "",
      },
    ],
  });

  const [routes, setRoutes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveryRoutes");
        const data = await response.json();
        if (response.ok) setRoutes(data);
        else showAlert("Failed to fetch routes", "error");
      } catch (error) {
        showAlert("Error fetching routes", "error");
      }
    };
    fetchRoutes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({ ...supplierData, [name]: value });
  };

  const handleLandDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLandDetails = [...supplierData.landDetails];
    updatedLandDetails[index][name] = value;
    setSupplierData({ ...supplierData, landDetails: updatedLandDetails });
  };

  const addLandDetail = () => {
    setSupplierData({
      ...supplierData,
      landDetails: [
        ...supplierData.landDetails,
        {
          landId: uuidv4(),
          landSize: "",
          landAddress: "",
          route: "",
        },
      ],
    });
  };

  const removeLandDetail = (index) => {
    const updatedLandDetails = supplierData.landDetails.filter((_, i) => i !== index);
    setSupplierData({ ...supplierData, landDetails: updatedLandDetails });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { status, name, contact, email, landDetails } = supplierData;
  
    // Always validate status and name
    if (!name.trim() || !/^[A-Za-z\s.&'-]+$/.test(name)) {
      showAlert("Supplier name should only contain letters and common punctuation.", "error");
      return;
    }
  
    // Only require all fields if status is "active"
    if (status === "active") {
      // Validate contact
      const contactPattern = /^(0((7[0-8])|([1-9][0-9]))\d{7})$/;
      if (!contactPattern.test(contact)) {
        showAlert("Invalid contact number. Please enter a valid contact number.", "error");
        return;
      }
  
      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showAlert("Please enter a valid email address.", "error");
        return;
      }
  
      // Validate all land details
      for (let i = 0; i < landDetails.length; i++) {
        const land = landDetails[i];
        if (!land.landSize || parseFloat(land.landSize) <= 0) {
          showAlert(`Enter a valid land size for Land No.${i + 1}.`, "error");
          return;
        }
        if (!land.landAddress.trim()) {
          showAlert(`Please provide an address for Land No.${i + 1}.`, "error");
          return;
        }
        if (!land.route) {
          showAlert(`Select a route for Land No.${i + 1}.`, "error");
          return;
        }
      }
    }

    // Submit if valid
    try {
      setIsSubmitting(true);
      
      // Get employee ID from localStorage
      const employeeId = localStorage.getItem('userId');
      
      if (!employeeId) {
        showAlert("Employee authentication required", "error");
        return;
      }

      const response = await fetch("http://localhost:3001/api/suppliers/add", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...supplierData,
          addedByEmployeeId: employeeId
        }),
      });

      if (response.ok) {
        const result = await response.json();
        showAlert(`Supplier ${result.supplierId} added successfully!`, "success");
        setTimeout(() => navigate("/view-suppliers"), 1500);
      } else {
        const errorData = await response.json();
        showAlert(`Failed to add supplier: ${errorData.error || "Unknown error"}`, "error");
      }
    } catch (error) {
      showAlert("An error occurred while submitting the form.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/view-suppliers");

  
return (
    <EmployeeLayout>
      <div className="add-supplier-container">
        <h3>Add New Supplier</h3>

        <form onSubmit={handleSubmit} className="two-column-form">
          {/* Supplier Info */}
          <div className="form-column supplier-details">
            <h4>Supplier Information</h4>

            <div className="form-group">
              <label>Supplier ID</label>
              <input type="text" value={supplierData.supplierId} readOnly className="read-only-input" />
            </div>

            <div className="form-group">
              <label>Supplier Name </label>
              <input type="text" name="name" value={supplierData.name} onChange={handleInputChange} required />
            </div>

            <div className="form-group">
              <label>Contact Number </label>
              <input type="text" name="contact" value={supplierData.contact} onChange={handleInputChange} required={supplierData.status === "active"}/>
            </div>

            <div className="form-group">
              <label>Email Address </label>
              <input type="email" name="email" value={supplierData.email} onChange={handleInputChange} required={supplierData.status === "active"}/>
            </div>

            <div className="form-group">
              <label>Status </label>
              <select name="status" value={supplierData.status} onChange={handleInputChange} required>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                {/*<option value="disabled">Disabled</option> disabled aywa save krnne ai */}
              </select>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={supplierData.notes} onChange={handleInputChange} rows="3" />
            </div>
          </div>

          {/* Land Info */}
          <div className="form-column land-details">
            <div className="land-details-header">
              <h5>Land Information</h5>
              <button type="button" onClick={addLandDetail} className="btn btn-outline-secondary add-land-btn">
                + Add Land
              </button>
            </div>

            {supplierData.landDetails.map((land, index) => (
              <div key={land.landId} className="land-detail-card">
                <div className="land-card-header">
                  <h5>Land No.{index + 1}</h5>
                  {index > 0 && (
                    <button type="button" onClick={() => removeLandDetail(index)} className="btn btn-outline-danger btn-sm">
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Size of Land (Acres)</label>
                  <input
                    type="number"
                    name="landSize"
                    value={land.landSize}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required={supplierData.status === "active"}                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Address of Land</label>
                  <textarea
                    name="landAddress"
                    value={land.landAddress}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required={supplierData.status === "active"}
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Route</label>
                  <select
                    name="route"
                    value={land.route}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required={supplierData.status === "active"}
                  >
                    <option value="">Select Route</option>
                    {routes.map((route) => (
                      <option key={route.delivery_routeId} value={route.delivery_routeId}>
                        {route.delivery_routeName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            <div className="form-buttons-container">
              <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Supplier"}
              </button>
            </div>
          </div>
        </form>

        <Snackbar
  open={snackbar.open}
  autoHideDuration={3000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
  <MuiAlert
    elevation={6}
    variant="filled"
    onClose={handleCloseSnackbar}
    severity={snackbar.severity}
    sx={{ width: '100%' }}
  >
    {snackbar.message}
  </MuiAlert>
</Snackbar>

      </div>
    </EmployeeLayout>
  );
};

export default AddSupplier;
