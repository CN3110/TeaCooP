import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./AddEmployee.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    employeeId: "Generating...",
    employeeName: "",
    employeeContact_no: "",
    employeeEmail: "",
    status: "pending",
    notes: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({ ...employeeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If status is 'active', all fields should be filled
    if (employeeData.status === "active") {
      const requiredFields = [
        "employeeName",
        "employeeContact_no",
        "employeeEmail",
      ];
      const missingFields = requiredFields.filter(
        (field) => !employeeData[field]
      );
      if (missingFields.length > 0) {
        showAlert("Please fill in all required fields. When you don't know all the details, save it as pending", "error");
        return;
      }
    }

    // Validations
    const contactPattern = /^(0((7[0-8])|([1-9][0-9]))\d{7})$/;

    if (employeeData.employeeContact_no && !contactPattern.test(employeeData.employeeContact_no)) {
      showAlert(
        "Invalid employee contact number. Please enter a valid contact number.",
        "error"
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      employeeData.employeeEmail && !emailPattern.test(employeeData.employeeEmail)
    ) {
      showAlert("Please enter a valid employee email address.", "error");
      return;
    }

    const namePattern = /^[A-Za-z\s.&'-]+$/;

    if (
      employeeData.employeeName && !namePattern.test(employeeData.employeeName)
    ) {
      showAlert(
        "Employee name should only contain letters and common punctuation.",
        "error"
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      const data = await response.json();
      
      if (response.ok) {
        showAlert("Employee added successfully!", "success");
        setTimeout(() => navigate("/view-employees"), 1500);
      } else {
        showAlert(data.error || "Failed to add employee", "error");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      showAlert("An error occurred while adding the employee.", "error");
    }
  };

  return (
    <EmployeeLayout>
      <div className="add-employee-container">
        <h2>Add Employee</h2>
        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={employeeData.employeeId}
              readOnly={true}
              className="read-only-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="employeeName">Employee Name *</label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={employeeData.employeeName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="employeeContact_no">Contact Number *</label>
            <input
              type="tel"
              id="employeeContact_no"
              name="employeeContact_no"
              value={employeeData.employeeContact_no}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="employeeEmail">Email Address *</label>
            <input
              type="email"
              id="employeeEmail"
              name="employeeEmail"
              value={employeeData.employeeEmail}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={employeeData.status}
              onChange={handleInputChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={employeeData.notes}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/view-employees")}
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
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </EmployeeLayout>
  );
};

export default AddEmployee;