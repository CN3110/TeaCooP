import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./AddSupplier.css";

const AddSupplier = () => {
  const [supplierData, setSupplierData] = useState({
    supplierId: "",
    name: "",
    contact: "",
    email: "", 
    landDetails: [
      {
        landSize: "",
        landAddress: "",
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
        { landSize: "", landAddress: "" },
      ],
    });
  };

  // Handle form submission
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
        alert("Supplier added successfully!");
        navigate("/view-suppliers");
      } else {
        const errorData = await response.json();
        alert(`Failed to add supplier: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting supplier data:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate("/view-suppliers"); // Redirect to the suppliers view page
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
                    name="landSize"
                    value={land.landSize}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Address of Land</label>
                  <input
                    type="text"
                    name="landAddress"
                    value={land.landAddress}
                    onChange={(e) => handleLandDetailsChange(index, e)}
                    required
                  />
                </div>
              </div>
            ))}

            {/* Button to add more land details */}
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addLandDetail}
            >
              Add More Land
            </button>
          </div>

          {/* Buttons */}
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