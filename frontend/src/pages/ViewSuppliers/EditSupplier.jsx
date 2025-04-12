//edit ekedi supplier wa disable krama supplierwa table eken remove wenwa, bt mta on eka disabled kyla table eke thiyanna
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditSupplier.css";

const EditSupplierPage = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    supplierId: "",
    supplierName: "",
    supplierContactNumber: "",
    supplierEmail: "",
    status: "pending",
    notes: "",
    landDetails: [],
  });
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const supplierResponse = await fetch(
          `http://localhost:3001/api/suppliers/${supplierId}`
        );
        if (!supplierResponse.ok) throw new Error("Failed to fetch supplier");
        
        const supplierData = await supplierResponse.json();
        
        const routesResponse = await fetch(
          "http://localhost:3001/api/deliveryRoutes"
        );
        const routesData = routesResponse.ok ? await routesResponse.json() : [];
        
        setFormData(supplierData);
        setRoutes(routesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load supplier data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [supplierId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLandDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLandDetails = [...formData.landDetails];
    updatedLandDetails[index][name] = value;
    setFormData({
      ...formData,
      landDetails: updatedLandDetails,
    });
  };

  const handleAddLandDetail = () => {
    setFormData({
      ...formData,
      landDetails: [
        ...formData.landDetails,
        { 
          landSize: "", 
          landAddress: "",
          delivery_routeName: "" 
        },
      ],
    });
  };

  const handleRemoveLandDetail = (index) => {
    if (window.confirm("Are you sure you want to remove this land detail?")) {
      const updatedLandDetails = [...formData.landDetails];
      updatedLandDetails.splice(index, 1);
      setFormData({
        ...formData,
        landDetails: updatedLandDetails,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add confirmation for disabling supplier
    if (formData.status === "disabled") {
      const confirmDisable = window.confirm(
        "Are you sure you want to disable this supplier? The record will be kept but marked as inactive."
      );
      if (!confirmDisable) return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:3001/api/suppliers/${formData.supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.supplierName,
            contact: formData.supplierContactNumber,
            email: formData.supplierEmail,
            status: formData.status,
            notes: formData.notes,
            landDetails: formData.landDetails,
          }),
        }
      );
  
      if (response.ok) {
        alert(`Supplier ${formData.status === "disabled" ? "disabled" : "updated"} successfully!`);
        navigate("/view-suppliers");
      } else {
        const errorData = await response.json();
        alert(`Failed to update supplier: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("An error occurred while updating the supplier.");
    }
  };
  

  if (isLoading) {
    return <div className="loading">Loading supplier data...</div>;
  }

  return (
    <div className="edit-supplier-container">
      <h2>Edit Supplier - {formData.supplierId} {formData.supplierName}</h2>
      
      <form onSubmit={handleSubmit} className="supplier-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Supplier ID</label>
              <input
                type="text"
                value={formData.supplierId}
                readOnly
                className="read-only"
              />
            </div>
            
            <div className="form-group">
              <label>Supplier Name *</label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="supplierContactNumber"
                value={formData.supplierContactNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="supplierEmail"
                value={formData.supplierEmail}
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
                <option value="pending">Pending</option>
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
              placeholder="Additional information about the supplier..."
            />
          </div>
        </div>
        
        <div className="form-section">
          <div className="section-header">
            <h3>Land Details</h3>
            <button
              type="button"
              className="add-land-btn"
              onClick={handleAddLandDetail}
            >
              + Add Land
            </button>
          </div>
          
          {formData.landDetails.length === 0 ? (
            <p className="no-land">No land details available</p>
          ) : (
            formData.landDetails.map((land, index) => (
              <div key={index} className="land-card">
                <div className="land-header">
                  <h4>Land No.{index + 1}</h4>
                  {formData.landDetails.length > 0 && (
                    <button
                      type="button"
                      className="remove-land-btn"
                      onClick={() => handleRemoveLandDetail(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="land-grid">
                  <div className="form-group">
                    <label>Size(Acres) *</label>
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
                    <label>Route *</label>
                    <select
                      name="delivery_routeName"
                      value={land.delivery_routeName || ""}
                      onChange={(e) => handleLandDetailsChange(index, e)}
                      required
                    >
                      <option value="">Select Route</option>
                      {routes.map((route) => (
                        <option
                          key={route.delivery_routeId}
                          value={route.delivery_routeName}
                        >
                          {route.delivery_routeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Address *</label>
                    <textarea
                      name="landAddress"
                      value={land.landAddress}
                      onChange={(e) => handleLandDetailsChange(index, e)}
                      required
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/view-suppliers")}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplierPage;