import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./AddTeaType.css";

const AddTeaType = () => {
  const [teaTypeData, setTeaTypeData] = useState({
    teaTypeName: "",
    teaTypeDescription: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // can be 'success', 'error', 'warning', 'info'
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeaTypeData({ ...teaTypeData, [name]: value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teaTypeData.teaTypeName || !teaTypeData.teaTypeDescription) {
      showSnackbar("Please fill in all required fields.", "warning");
      return;
    }

    const requestBody = {
      teaTypeName: teaTypeData.teaTypeName,
      teaTypeDescription: teaTypeData.teaTypeDescription,
    };

    try {
      const response = await fetch("http://localhost:3001/api/teaTypes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        showSnackbar("Tea type added successfully!", "success");
        setTimeout(() => navigate("/view-tea-types"), 1500);
      } else {
        console.error("Failed to add tea type:", response);
        showSnackbar("Failed to add tea type. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("An error occurred while adding the tea type.", "error");
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

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </EmployeeLayout>
  );
};

export default AddTeaType;
