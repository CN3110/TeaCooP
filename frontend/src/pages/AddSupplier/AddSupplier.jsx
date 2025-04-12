//pending thiyeddi okkom details thiyyenna on naaa... eka hdannaa
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./AddSupplier.css";

const AddSupplier = () => {
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
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/deliveryRoutes"
        );
        if (response.ok) {
          const data = await response.json();
          setRoutes(data);
        } else {
          console.error("Failed to fetch routes");
          setRoutes([]);
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
        setRoutes([]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/suppliers/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(supplierData),
      });

      if (response.ok) {
        const result = await response.json();
        setAlert({
          type: "success",
          message: `Supplier ${result.supplierId} added successfully!`,
        });
        setTimeout(() => navigate("/view-suppliers"), 1500);
      } else {
        const errorData = await response.json();
        setAlert({
          type: "error",
          message: `Failed to add supplier: ${
            errorData.error || "Unknown error"
          }`,
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while submitting the form.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/view-suppliers");
  };

  return (
    <EmployeeLayout>
      <div className="add-supplier-container">
        <h3>Add New Supplier</h3>

        {alert && <div className={`alert ${alert.type}`}>{alert.message}</div>}

        <form onSubmit={handleSubmit} className="two-column-form">
          {/* Left Column - Supplier Details */}
          <div className="form-column supplier-details">
            <h4>Supplier Information</h4>
            
            <div className="form-group">
              <label>Supplier ID</label>
              <input
                type="text"
                name="supplierId"
                value={supplierData.supplierId}
                readOnly
                className="read-only-input"
              />
            </div>

            <div className="form-group">
              <label>Supplier Name *</label>
              <input
                type="text"
                name="name"
                value={supplierData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="text"
                name="contact"
                value={supplierData.contact}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={supplierData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={supplierData.status}
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
                value={supplierData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Additional information about the supplier..."
              />
            </div>
          </div>

          {/* Right Column - Land Details */}
          <div className="form-column land-details">
            <div className="land-details-header">
              <h5>Land Information</h5>
              <button
                type="button"
                className="btn btn-outline-secondary add-land-btn"
                onClick={addLandDetail}
              >
                + Add Land
              </button>
            </div>

            {supplierData.landDetails.map((land, index) => (
              <div key={land.landId} className="land-detail-card">
                <div className="land-card-header">
                  <h5>Land No.{index + 1}</h5>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm remove-land-btn"
                      onClick={() => removeLandDetail(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Size of Land (Acres) *</label>
                  <input
                    type="number"
                    name="landSize"
                    value={land.landSize}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                    step="0.01"
                    min="0"
                    placeholder="e.g., 2.5"
                  />
                </div>

                <div className="form-group">
                  <label>Address of Land *</label>
                  <textarea
                    name="landAddress"
                    value={land.landAddress}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                    rows="2"
                    placeholder="Full address of the land..."
                  />
                </div>

                <div className="form-group">
                  <label>Route *</label>
                  <select
                    name="route"
                    value={land.route}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                  >
                    <option value="">Select Route</option>
                    {routes && routes.length > 0 ? (
                      routes
                        .filter((route) => route.delivery_routeId && route.delivery_routeName)
                        .map((route) => (
                          <option
                            key={`route-${route.delivery_routeId}`}
                            value={route.delivery_routeId}
                          >
                            {route.delivery_routeName}
                          </option>
                        ))
                    ) : (
                      <option value="" disabled>
                        Loading routes...
                      </option>
                    )}
                  </select>
                </div>
                
              </div>
            ))}
            <div className="form-buttons-container">
  <button type="button" className="cancel-btn" onClick={handleCancel}>
    Cancel
  </button>
  <button type="submit" className="submit-btn">
    Save Supplier
  </button>
</div>
            
          </div>

          
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default AddSupplier;