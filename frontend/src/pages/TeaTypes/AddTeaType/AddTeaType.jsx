import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./AddTeaType.css";

const AddTeaType = () => {
  const [teaTypeData, setTeaTypeData] = useState({
    teaTypeName: "",
    teaTypeDescription: "",
  });

  const navigate = useNavigate();

  // Handle input changes for tea type details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeaTypeData({ ...teaTypeData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teaTypeData.teaTypeName || !teaTypeData.teaTypeDescription) {
      alert("Please fill in all required fields.");
      return;
    }

    const requestBody = {
      teaTypeName: teaTypeData.teaTypeName,
      teaTypeDescription: teaTypeData.teaTypeDescription,
    };

    try {
      const response = await fetch("http://localhost:3001/api/tea-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Tea type added successfully!");
        navigate("/view-tea-types");
      } else {
        console.error("Failed to add tea type:", response);
        alert("Failed to add tea type. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add tea type:", error);
      alert("An error occurred while adding the tea type.");
    }
  };

  return (
    <EmployeeLayout>
      <div className="add-tea-type-container">
        <h2>Add Tea Type</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="teaTypeName">Tea Type Name</label>
            <input
              type="text"
              id="teaTypeName"
              name="teaTypeName"
              value={teaTypeData.teaTypeName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="teaTypeDescription">Tea Type Description</label>
            <textarea
              className="form-control"
              id="teaTypeDescription"
              name="teaTypeDescription"
              rows="4"
              value={teaTypeData.teaTypeDescription}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/view-tea-types")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default AddTeaType;