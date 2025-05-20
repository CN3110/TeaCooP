import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./AddBroker.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddBroker = () => {
  const [brokerData, setBrokerData] = useState({
    brokerId: "Generating...",
    brokerName: "",
    brokerContact: "",
    brokerEmail: "",
    status: "pending",
    brokerCompanyName: "",
    brokerCompanyContact: "",
    brokerCompanyEmail: "",
    brokerCompanyAddress: "",
    notes: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setBrokerData({ ...brokerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If status is 'active', all fields should be filled
    if (brokerData.status === "active") {
      const requiredFields = [
        "brokerName",
        "brokerContact",
        "brokerEmail",
        "brokerCompanyName",
        "brokerCompanyContact",
        "brokerCompanyEmail",
        "brokerCompanyAddress",
      ];
      const missingFields = requiredFields.filter(
        (field) => !brokerData[field]
      );
      if (missingFields.length > 0) {
        showAlert(
          "Please fill in all required fields. When you don't know all the details, then save it as pending.",
          "error"
        );
        return;
      }
    }

    // Validations
    const contactPattern = /^(0((7[0-8])|([1-9][0-9]))\d{7})$/;

    if (
      brokerData.brokerContact &&
      !contactPattern.test(brokerData.brokerContact)
    ) {
      showAlert(
        "Invalid broker's contact number. Please enter a valid contact number.",
        "error"
      );
      return;
    }

    if (
      brokerData.brokerCompanyContact &&
      !contactPattern.test(brokerData.brokerCompanyContact)
    ) {
      showAlert(
        "Invalid broker company contact number. Please enter a valid contact number.",
        "error"
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      brokerData.brokerEmail &&
      !emailPattern.test(brokerData.brokerEmail)
    ) {
      showAlert("Please enter a valid broker email address.", "error");
      return;
    }

    if (
      brokerData.brokerCompanyEmail &&
      !emailPattern.test(brokerData.brokerCompanyEmail)
    ) {
      showAlert("Please enter a valid company email address.", "error");
      return;
    }

    const namePattern = /^[A-Za-z\s.&'-]+$/;

    if (
      brokerData.brokerName &&
      !namePattern.test(brokerData.brokerName)
    ) {
      showAlert(
        "Broker name should only contain letters and common punctuation.",
        "error"
      );
      return;
    }

    if (
      brokerData.brokerCompanyName &&
      !namePattern.test(brokerData.brokerCompanyName)
    ) {
      showAlert(
        "Company name should only contain letters and common punctuation.",
        "error"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Get employee ID from localStorage
      const employeeId = localStorage.getItem("userId");

      if (!employeeId) {
        showAlert("Employee authentication required", "error");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:3001/api/brokers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...brokerData,
          addedByEmployeeId: employeeId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        showAlert(
          `${result.brokerId} - ${result.brokerName} Broker added successfully! `,
          "success"
        );
        setTimeout(() => navigate("/view-brokers"), 3000);
      } else {
        const data = await response.json();
        showAlert(data.error || "Failed to add broker", "error");
      }
    } catch (error) {
      console.error("Error adding broker:", error);
      showAlert("An error occurred while adding the broker.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className="add-broker-container">
        <h2>Add Broker</h2>
        <form onSubmit={handleSubmit} className="two-column-form">
          <div className="form-column">
            <h3>Broker Details</h3>
            <div className="form-group">
              <label htmlFor="brokerId">Broker ID</label>
              <input
                type="text"
                id="brokerId"
                name="brokerId"
                value={brokerData.brokerId}
                readOnly={true}
                className="read-only-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="brokerName">Broker Name *</label>
              <input
                type="text"
                id="brokerName"
                name="brokerName"
                value={brokerData.brokerName}
                onChange={handleInputChange}
                required={brokerData.status === "active"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="brokerContact">Broker Contact Number *</label>
              <input
                type="tel"
                id="brokerContact"
                name="brokerContact"
                value={brokerData.brokerContact}
                onChange={handleInputChange}
                required={brokerData.status === "active"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="brokerEmail">Broker Email Address *</label>
              <input
                type="email"
                id="brokerEmail"
                name="brokerEmail"
                value={brokerData.brokerEmail}
                onChange={handleInputChange}
                required={brokerData.status === "active"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={brokerData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="form-column">
            <h3>Company Details</h3>
            <div className="form-group">
              <label htmlFor="brokerCompanyName">Company Name *</label>
              <input
                type="text"
                id="brokerCompanyName"
                name="brokerCompanyName"
                value={brokerData.brokerCompanyName}
                onChange={handleInputChange}
                required={brokerData.status === "active"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="brokerCompanyContact">
                Company Contact Number *
              </label>
              <input
                type="tel"
                id="brokerCompanyContact"
                name="brokerCompanyContact"
                value={brokerData.brokerCompanyContact}
                onChange={handleInputChange}
                required={brokerData.status === "active"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="brokerCompanyEmail">Company Email Address *</label>
              <input
                type="email"
                id="brokerCompanyEmail"
                name="brokerCompanyEmail"
                value={brokerData.brokerCompanyEmail}
                onChange={handleInputChange}
                required={brokerData.status === "active"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="brokerCompanyAddress">Company Address *</label>
              <textarea
                id="brokerCompanyAddress"
                name="brokerCompanyAddress"
                value={brokerData.brokerCompanyAddress}
                onChange={handleInputChange}
                required={brokerData.status === "active"}
              />
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={brokerData.notes}
                onChange={handleInputChange}
              />
            </div>
            
           <div className="form-buttons">
    <button
      type="button"
      className="cancel-button"
      onClick={() => navigate("/view-brokers")}
      disabled={isSubmitting}
    >
      Cancel
    </button>
    <button type="submit" className="submit-button" disabled={isSubmitting}>
      {isSubmitting ? "Saving..." : "Save"}
    </button>
  </div>
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

export default AddBroker;
