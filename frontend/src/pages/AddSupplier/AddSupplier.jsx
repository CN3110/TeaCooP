import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./AddSupplier.css";

const AddSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    supplierId: "",
    name: "",
    contact: "",
    landDetails: [
      {
        landNo: "",
        size: "",
        address: "",
      },
    ],
  });

  const navigate = useNavigate();

  // Handle input changes for supplier details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplierData({ ...supplierData, [name]: value });
  };

  // Handle input changes for land details
  const handleLandDetailsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLandDetails = [...supplierData.landDetails];
    updatedLandDetails[index][name] = value;
    setSupplierData({ ...supplierData, landDetails: updatedLandDetails });
  };

  // Add a new land detail field
  const addLandDetail = () => {
    setSupplierData({
      ...supplierData,
      landDetails: [
        ...supplierData.landDetails,
        { landNo: "", size: "", address: "" },
      ],
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Supplier Data:", supplierData);
    alert("Supplier added successfully!");
    navigate("/manage-suppliers");
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/manage-suppliers"); // Redirect to the suppliers list page
  };

  return (
    <EmployeeLayout>
      <div className="add-supplier-container">
        <h3>Add New Supplier</h3>
        <form onSubmit={handleSubmit}>
          {/* Supplier ID */}
          <div className="form-group">
            <label>Supplier ID</label>
            <input
              type="text"
              name="supplierId"
              value={supplierData.supplierId}
              onChange={handleInputChange}
              required
            />
          </div>

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

          {/* Land Details */}
          <div className="land-details">
            <h4>Land Details</h4>
            {supplierData.landDetails.map((land, index) => (
              <div key={index} className="land-detail-group">
                <div className="form-group">
                <small>Land No. {index + 1}</small>
                  
                </div>

                <div className="form-group">
                  <label>Size of Land</label>
                  <input
                    type="text"
                    name="size"
                    value={land.size}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address of Land</label>
                  <input
                    type="text"
                    name="address"
                    value={land.address}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                  />
                </div>
              </div>
            ))}

            {/* Button to add more land details */}
            <button type="button" className="btn btn-outline-secondary" onClick={addLandDetail}> Add More Land</button>
          
             
            
          </div>

          {/* Buttons */}
          <div className="form-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
            >
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