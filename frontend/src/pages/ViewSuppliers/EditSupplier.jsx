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
    landDetails: [],
  });

  // Fetch the selected supplier's data
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/suppliers/${supplierId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Supplier Data:", data); // Debugging log
          setFormData(data);
        } else {
          console.error("Failed to fetch supplier data");
        }
      } catch (error) {
        console.error("Error fetching supplier:", error);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle land details changes
  const handleLandDetailsChange = (index, field, value) => {
    const updatedLandDetails = [...formData.landDetails];
    updatedLandDetails[index][field] = value;
    setFormData({
      ...formData,
      landDetails: updatedLandDetails,
    });
  };

  // Handle adding a new land detail
  const handleAddLandDetail = () => {
    setFormData({
      ...formData,
      landDetails: [
        ...formData.landDetails,
        { landSize: "", landAddress: "" }, // Add a new empty land detail
      ],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSupplier = {
      name: formData.supplierName,
      contact: formData.supplierContactNumber,
      landDetails: formData.landDetails,
    };

    try {
      const response = await fetch(
        `http://localhost:3001/api/suppliers/${formData.supplierId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedSupplier),
        }
      );

      if (response.ok) {
        alert("Supplier updated successfully!");
        navigate("/view-suppliers");
      } else {
        const errorData = await response.json();
        alert(`Failed to update supplier: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating supplier:", error);
      alert("An error occurred while updating the supplier.");
    }
  };

  return (
    <div className="edit-supplier-page">
      <h2>Edit Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Supplier ID</label>
          <input
            type="text"
            name="supplierId"
            value={formData.supplierId || ""}
            onChange={handleInputChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label>Supplier Name</label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="text"
            name="supplierContactNumber"
            value={formData.supplierContactNumber || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Land Details</label>
          {formData.landDetails && formData.landDetails.length > 0 ? (
            formData.landDetails.map((land, index) => (
              <div key={index} className="land-detail">
                <label>Land No: {index + 1}</label> {/* Add Land No label */}
                <input
                  type="text"
                  placeholder="Land Size"
                  value={land.landSize || ""}
                  onChange={(e) =>
                    handleLandDetailsChange(index, "landSize", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Land Address"
                  value={land.landAddress || ""}
                  onChange={(e) =>
                    handleLandDetailsChange(index, "landAddress", e.target.value)
                  }
                />
                
              </div>
            ))
          ) : (
            <p>No land details available</p>
          )}
          {/* Add New Land Button */}
          <button
            type="button"
            className="add-land-btn"
            onClick={handleAddLandDetail}
          >
            Add New Land
          </button>
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/view-suppliers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSupplierPage;