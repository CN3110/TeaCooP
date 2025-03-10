import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditTeaType.css";

const EditTeaType = () => {
  const { teaTypeId } = useParams(); // Extract teaTypeId from URL parameters
  const navigate = useNavigate(); // Initialize the navigate function
  const [formData, setFormData] = useState({
    teaTypeName: "",
    teaTypeDescription: "",
  });

  // Debugging log
  console.log("Tea Type ID from URL:", teaTypeId);

  // Fetch the selected tea type's data
  useEffect(() => {
    const fetchTeaType = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/teaTypes/${teaTypeId}` // Use teaTypeId from URL
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Tea Type Data:", data); // Debugging log
          setFormData(data);
        } else {
          console.error("Failed to fetch tea type data");
        }
      } catch (error) {
        console.error("Error fetching tea type:", error);
      }
    };

    if (teaTypeId) {
      fetchTeaType(); // Fetch tea type data only if teaTypeId is defined
    }
  }, [teaTypeId]); // Add teaTypeId as a dependency

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3001/api/teaTypes/${teaTypeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("Tea Type updated successfully");
        navigate("/view-tea-types");
      } else {
        console.error("Tea Type update failed");
      }
    } catch (error) {
      console.error("Error updating tea type:", error);
    }
  };

  return (
    <div className="edit-tea-type-container">
      <h3>Edit Tea Type</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teaTypeName">Tea Type Name</label>
          <input
            type="text"
            id="teaTypeName"
            name="teaTypeName"
            value={formData.teaTypeName || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="teaTypeDescription">Tea Type Description</label>
          <textarea
            id="teaTypeDescription"
            name="teaTypeDescription"
            value={formData.teaTypeDescription}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/view-tea-types")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeaType;