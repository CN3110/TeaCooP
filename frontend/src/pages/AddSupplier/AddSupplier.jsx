import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./AddSupplier.css";

const AddSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    name: "",
    contact: "",
    email: "",
    status: "pending",
    notes: "",
    landDetails: [
      {
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
        const response = await fetch("http://localhost:3001/api/deliveryRoutes");
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
        { landSize: "", landAddress: "", route: "" },
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
        setAlert({ type: "success", message: `Supplier ${result.supplierId} added successfully!` });
        setTimeout(() => navigate("/view-suppliers"), 1500);
      } else {
        const errorData = await response.json();
        setAlert({ type: "error", message: `Failed to add supplier: ${errorData.error || "Unknown error"}` });
      }
    } catch (error) {
      setAlert({ type: "error", message: "An error occurred while submitting the form." });
    }
  };

  const handleCancel = () => {
    navigate("/view-suppliers");
  };

  return (
    <EmployeeLayout>
      <div className="add-supplier-container">
        <h3>Add New Supplier</h3>

        {alert && (
          <div className={`alert ${alert.type}`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Supplier Name */}
          <div className="form-group">
            <label>Supplier Name</label>
            <input
              type="text"
              name="name"
              value={supplierData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              name="contact"
              value={supplierData.contact}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Email Address */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={supplierData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Supplier Status */}
          <div className="form-group">
            <label>Status</label>
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

          {/* Notes */}
          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={supplierData.notes}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          {/* Land Details */}
          <div className="land-details">
            <h4>Land Details</h4>
            {supplierData.landDetails.map((land, index) => (
              <div key={index} className="land-detail-group">
                <div className="form-group">
                  <label>Size of Land (Acres)</label>
                  <input
                    type="number"
                    name="landSize"
                    value={land.landSize}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Address of Land</label>
                  <textarea
                    name="landAddress"
                    value={land.landAddress}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                    rows="2"
                  />
                </div>

                <div className="form-group">
                  <label>Route</label>
                  <select
                    name="route"
                    value={land.route}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                  >
                    <option value="">Select Route</option>
                    {routes && routes.length > 0 ? (
                      routes.map((route) => (
                        <option key={route.routeId} value={route.routeId}>
                          {route.routeName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Loading routes...</option>
                    )}
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addLandDetail}
            >
              Add More Land
            </button>
          </div>

          <div className="form-buttons">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
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

export default AddSupplier;