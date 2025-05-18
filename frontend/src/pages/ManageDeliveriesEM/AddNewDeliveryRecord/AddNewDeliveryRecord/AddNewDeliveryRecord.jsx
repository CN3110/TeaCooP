import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./AddNewDeliveryRecord.css";

// Separate component for the supplier suggestions dropdown
const SupplierAutocomplete = ({ value, onChange, suppliers, onSelect }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  const handleInputChange = (e) => {
    const input = e.target.value;
    onChange(e);
    
    if (input.length > 0) {
      const suggestions = suppliers.filter(
        (s) =>
          s.supplierId.toLowerCase().includes(input.toLowerCase()) ||
          s.supplierName.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions([]);
    }
  };
  
  return (
    <div className="form-group autocomplete">
      <label htmlFor="supplierId">Supplier ID:</label>
      <input
        id="supplierId"
        type="text"
        name="supplierId"
        value={value}
        onChange={handleInputChange}
        autoComplete="off"
        required
        placeholder="Enter supplier ID or name"
        className="form-control"
      />
      {filteredSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {filteredSuggestions.map((supplier) => (
            <li
              key={supplier.supplierId}
              onClick={() => {
                onChange({ target: { name: "supplierId", value: supplier.supplierId } });
                onSelect(supplier);
                setFilteredSuggestions([]);
              }}
            >
              <strong>{supplier.supplierId}</strong> - {supplier.supplierName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Card component for supplier and driver info
const InfoCard = ({ title, data, details, detailsTitle, detailsFields }) => {
  if (!data) return null;
  
  return (
    <div className="info-card">
      <h4>{title}</h4>
      {Object.entries(data).map(([key, value]) => {
        if (typeof value === 'string' && !key.includes('Details')) {
          return (
            <p key={key}>
              <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
            </p>
          );
        }
        return null;
      })}
      
      {details && details.length > 0 && (
        <>
          <h5>{detailsTitle}:</h5>
          <ul className="details-list">
            {details.map((item, idx) => (
              <li key={idx}>
                <h6>{detailsTitle.replace(/s$/, '')} {idx + 1}</h6>
                {detailsFields.map((field) => (
                  <p key={field.key}>
                    <strong>{field.label}:</strong> {item[field.key]} {field.unit || ''}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const AddNewDeliveryRecord = () => {
  const [routeOptions, setRouteOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deliveryData, setDeliveryData] = useState({
    supplierId: "",
    transport: "",
    date: "",
    route: "",
    totalWeight: "",
    totalSackWeight: "",
    forWater: "",
    forWitheredLeaves: "",
    forRipeLeaves: "",
    greenTeaLeaves: "",
    randalu: "",
  });

  const navigate = useNavigate();

  // Helper functions
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

  // Calculate derived values
  const totalDeductions =
    parseFloat(deliveryData.totalSackWeight || 0) +
    parseFloat(deliveryData.forWater || 0) +
    parseFloat(deliveryData.forWitheredLeaves || 0) +
    parseFloat(deliveryData.forRipeLeaves || 0);
    
  const netWeight = parseFloat(deliveryData.totalWeight || 0) - totalDeductions;
  const greenTeaLeavesWeight = netWeight - parseFloat(deliveryData.randalu || 0);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Check supplier exists
    const validSupplier = suppliers.find(
      (s) => s.supplierId === deliveryData.supplierId
    );
    if (!validSupplier) {
      errors.supplierId = "Please select a valid supplier";
    }
    
    // Validate weights
    if (parseFloat(deliveryData.totalWeight) <= 0) {
      errors.totalWeight = "Total weight must be greater than 0";
    }
    
    if (parseFloat(deliveryData.totalWeight) < totalDeductions) {
      errors.totalWeight = "Total weight must be greater than total deductions";
    }
    
    // Validate negative values
    ["totalSackWeight", "forWater", "forRipeLeaves", "forWitheredLeaves", "randalu"].forEach(field => {
      if (parseFloat(deliveryData[field] || 0) < 0) {
        errors[field] = "Value cannot be negative";
      }
    });
    
    // Validate required fields
    ["transport", "route"].forEach(field => {
      if (!deliveryData[field]) {
        errors[field] = "This field is required";
      }
    });
    
    // Validate date
    const today = new Date().toISOString().split("T")[0];
    if (deliveryData.date !== today) {
      errors.date = "Date must be today";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Set today's date
        const today = new Date().toISOString().split("T")[0];
        setDeliveryData((prev) => ({ ...prev, date: today }));
        
        // Fetch routes
        const routesResponse = await fetch("http://localhost:3001/api/deliveryRoutes");
        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          setRouteOptions(routesData);
        } else {
          throw new Error("Failed to fetch routes");
        }
        
        // Fetch drivers
        const driversResponse = await fetch("http://localhost:3001/api/drivers/active");
        if (driversResponse.ok) {
          const driversData = await driversResponse.json();
          setDriverOptions([
            { driverId: "selfTransport", driverName: "Self Transport" },
            ...driversData,
          ]);
        } else {
          throw new Error("Failed to fetch drivers");
        }
        
        // Fetch suppliers
        const suppliersResponse = await fetch("http://localhost:3001/api/suppliers");
        if (suppliersResponse.ok) {
          const suppliersData = await suppliersResponse.json();
          setSuppliers(suppliersData);
        } else {
          throw new Error("Failed to fetch suppliers");
        }
      } catch (error) {
        console.error("Error during initial data fetch:", error);
        showAlert(`Failed to load some data: ${error.message}`, "warning");
      }
    };

    fetchInitialData();
  }, []);

  // Update calculated fields when weights change
  useEffect(() => {
    if (greenTeaLeavesWeight >= 0) {
      setDeliveryData(prev => ({
        ...prev,
        greenTeaLeaves: greenTeaLeavesWeight.toFixed(2)
      }));
    }
  }, [greenTeaLeavesWeight]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setDeliveryData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Handle driver selection
    if (name === "transport") {
      const selected = driverOptions.find((d) => d.driverId === value);
      setSelectedDriver(
        selected?.driverId === "selfTransport" ? null : selected
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showAlert("Please fix the errors in the form", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    const payload = {
      ...deliveryData,
      totalWeight: parseFloat(deliveryData.totalWeight),
      totalSackWeight: parseFloat(deliveryData.totalSackWeight || 0),
      forWater: parseFloat(deliveryData.forWater || 0),
      forWitheredLeaves: parseFloat(deliveryData.forWitheredLeaves || 0),
      forRipeLeaves: parseFloat(deliveryData.forRipeLeaves || 0),
      greenTeaLeaves: parseFloat(deliveryData.greenTeaLeaves || 0),
      randalu: parseFloat(deliveryData.randalu || 0),
    };

    try {
      const response = await fetch("http://localhost:3001/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add delivery");
      }

      showAlert("Delivery added successfully!", "success");
      setTimeout(() => {
        navigate("/view-delivery-records");
      }, 1500);
    } catch (error) {
      showAlert(`An error occurred: ${error.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="add-new-delivery-container">
        <h2 className="page-title">Add New Tea Delivery</h2>
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              fontWeight: "bold",
              fontSize: "1rem",
              backgroundColor:
                snackbar.severity === "success"
                  ? "rgb(14, 152, 16)"
                  : snackbar.severity === "error"
                  ? "rgb(211,47,47)"
                  : snackbar.severity === "warning"
                  ? "rgb(237, 201, 72)"
                  : "#1976d2",
              color: "white",
              boxShadow: 3,
            }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>

        <div className="delivery-form-container">
          <form onSubmit={handleSubmit} className="delivery-form">
            <div className="form-grid">
              <div className="form-section basic-info">
                <h3 className="section-title">Basic Information</h3>
                
                <SupplierAutocomplete
                  value={deliveryData.supplierId}
                  onChange={handleInputChange}
                  suppliers={suppliers}
                  onSelect={setSelectedSupplier}
                />
                {formErrors.supplierId && (
                  <div className="error-message">{formErrors.supplierId}</div>
                )}

                <div className="form-group">
                  <label htmlFor="date">Date:</label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={deliveryData.date}
                    className={`form-control ${formErrors.date ? "error" : ""}`}
                    readOnly
                    disabled
                  />
                  {formErrors.date && (
                    <div className="error-message">{formErrors.date}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="transport">Transport:</label>
                  <select
                    id="transport"
                    name="transport"
                    value={deliveryData.transport}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.transport ? "error" : ""}`}
                    required
                  >
                    <option value="">Select Transport</option>
                    {driverOptions.map((driver) => (
                      <option key={driver.driverId} value={driver.driverId}>
                        {driver.driverName}
                      </option>
                    ))}
                  </select>
                  {formErrors.transport && (
                    <div className="error-message">{formErrors.transport}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="route">Route:</label>
                  <select
                    id="route"
                    name="route"
                    value={deliveryData.route}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.route ? "error" : ""}`}
                    required
                  >
                    <option value="">Select Route</option>
                    {routeOptions.map((route) => (
                      <option
                        key={route.delivery_routeId}
                        value={route.delivery_routeName}
                      >
                        {route.delivery_routeName}
                      </option>
                    ))}
                  </select>
                  {formErrors.route && (
                    <div className="error-message">{formErrors.route}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="totalWeight">Total Weight (kg):</label>
                  <input
                    id="totalWeight"
                    type="number"
                    step="0.01"
                    name="totalWeight"
                    value={deliveryData.totalWeight}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.totalWeight ? "error" : ""}`}
                    placeholder="Enter total weight"
                    required
                  />
                  {formErrors.totalWeight && (
                    <div className="error-message">{formErrors.totalWeight}</div>
                  )}
                </div>
              </div>

              <div className="form-section deductions">
                <h3 className="section-title">Deductions</h3>
                
                <div className="form-group">
                  <label htmlFor="totalSackWeight">Total Sack Weight (kg):</label>
                  <input
                    id="totalSackWeight"
                    type="number"
                    step="0.01"
                    name="totalSackWeight"
                    value={deliveryData.totalSackWeight}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.totalSackWeight ? "error" : ""}`}
                    placeholder="0.00"
                    required
                  />
                  {formErrors.totalSackWeight && (
                    <div className="error-message">{formErrors.totalSackWeight}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="forWater">For Water (kg):</label>
                  <input
                    id="forWater"
                    type="number"
                    step="0.01"
                    name="forWater"
                    value={deliveryData.forWater}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.forWater ? "error" : ""}`}
                    placeholder="0.00"
                    required
                  />
                  {formErrors.forWater && (
                    <div className="error-message">{formErrors.forWater}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="forWitheredLeaves">For Withered Leaves (kg):</label>
                  <input
                    id="forWitheredLeaves"
                    type="number"
                    step="0.01"
                    name="forWitheredLeaves"
                    value={deliveryData.forWitheredLeaves}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.forWitheredLeaves ? "error" : ""}`}
                    placeholder="0.00"
                    required
                  />
                  {formErrors.forWitheredLeaves && (
                    <div className="error-message">{formErrors.forWitheredLeaves}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="forRipeLeaves">For Ripe Leaves (kg):</label>
                  <input
                    id="forRipeLeaves"
                    type="number"
                    step="0.01"
                    name="forRipeLeaves"
                    value={deliveryData.forRipeLeaves}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.forRipeLeaves ? "error" : ""}`}
                    placeholder="0.00"
                    required
                  />
                  {formErrors.forRipeLeaves && (
                    <div className="error-message">{formErrors.forRipeLeaves}</div>
                  )}
                </div>

                <div className="deduction-summary">
                  <div className="summary-item">
                    <span>Total Deductions:</span>
                    <span className="summary-value">{totalDeductions.toFixed(2)} kg</span>
                  </div>
                </div>
              </div>

              <div className="form-section tea-weights">
                <h3 className="section-title">Tea Leaves Weights</h3>
                
                <div className="form-group">
                  <label htmlFor="randalu">Randalu (kg):</label>
                  <input
                    id="randalu"
                    type="number"
                    step="0.01"
                    name="randalu"
                    value={deliveryData.randalu}
                    onChange={handleInputChange}
                    className={`form-control ${formErrors.randalu ? "error" : ""}`}
                    placeholder="0.00"
                    required
                  />
                  {formErrors.randalu && (
                    <div className="error-message">{formErrors.randalu}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="greenTeaLeaves">Green Tea Leaves (kg):</label>
                  <input
                    id="greenTeaLeaves"
                    type="number"
                    name="greenTeaLeaves"
                    value={deliveryData.greenTeaLeaves}
                    className="form-control calculated-field"
                    readOnly
                  />
                </div>
                
                <div className="tea-summary">
                  <div className="summary-item">
                    <span>Net Weight:</span>
                    <span className="summary-value">{(parseFloat(deliveryData.totalWeight || 0) - totalDeductions).toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Delivery"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/view-delivery-records")}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="info-cards-container">
            <InfoCard
              title="Supplier Details"
              data={selectedSupplier}
              details={selectedSupplier?.landDetails}
              detailsTitle="Land Details"
              detailsFields={[
                { key: "landAddress", label: "Address" },
                { key: "landSize", label: "Size", unit: "acres" }
              ]}
            />
            
            <InfoCard
              title="Driver Details"
              data={selectedDriver}
              details={selectedDriver?.vehicleDetails}
              detailsTitle="Vehicle Details"
              detailsFields={[
                { key: "vehicleNumber", label: "Vehicle Number" },
                { key: "vehicleType", label: "Vehicle Type" }
              ]}
            />
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default AddNewDeliveryRecord;