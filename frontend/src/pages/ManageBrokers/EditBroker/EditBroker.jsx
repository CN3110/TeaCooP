import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./EditBroker.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EditBroker = () => {
  const { brokerId } = useParams();
  const navigate = useNavigate();
  const [brokerData, setBrokerData] = useState({
    brokerId: "",
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

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/brokers/${brokerId}`
        );
        if (response.ok) {
          const data = await response.json();
          // Map the data to match our state structure
          setBrokerData({
            brokerId: data.brokerId,
            brokerName: data.brokerName,
            brokerContact: data.brokerContactNumber || data.brokerContact,
            brokerEmail: data.brokerEmail,
            status: data.status || "pending",
            brokerCompanyName: data.brokerCompanyName,
            brokerCompanyContact: data.brokerCompanyContactNumber || data.brokerCompanyContact,
            brokerCompanyEmail: data.brokerCompanyEmail,
            brokerCompanyAddress: data.brokerCompanyAddress,
            notes: data.notes || "",
          });
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || "Failed to fetch broker data", "error");
        }
      } catch (error) {
        console.error("Error fetching broker:", error);
        showAlert("An error occurred while fetching broker data", "error");
      }
    };

    if (brokerId) {
      fetchBroker();
    }
  }, [brokerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrokerData({ ...brokerData, [name]: value });
  };

  const validateForm = () => {
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
        showAlert("Please fill in all required fields.", "error");
        return false;
      }
    }

    // Contact number validation
    const contactPattern = /^(0((7[0-8])|([1-9][0-9]))\d{7})$/;
    if (brokerData.brokerContact && !contactPattern.test(brokerData.brokerContact)) {
      showAlert(
        "Invalid broker's contact number. Please enter a valid contact number.",
        "error"
      );
      return false;
    }

    if (brokerData.brokerCompanyContact && !contactPattern.test(brokerData.brokerCompanyContact)) {
      showAlert(
        "Invalid broker company contact number. Please enter a valid contact number.",
        "error"
      );
      return false;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (brokerData.brokerEmail && !emailPattern.test(brokerData.brokerEmail)) {
      showAlert("Please enter a valid broker email address.", "error");
      return false;
    }

    if (brokerData.brokerCompanyEmail && !emailPattern.test(brokerData.brokerCompanyEmail)) {
      showAlert("Please enter a valid company email address.", "error");
      return false;
    }

    // Name validation
    const namePattern = /^[A-Za-z\s.&'-]+$/;
    if (brokerData.brokerName && !namePattern.test(brokerData.brokerName)) {
      showAlert(
        "Broker name should only contain letters and common punctuation.",
        "error"
      );
      return false;
    }

    if (brokerData.brokerCompanyName && !namePattern.test(brokerData.brokerCompanyName)) {
      showAlert(
        "Company name should only contain letters and common punctuation.",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/brokers/${brokerId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...brokerData,
            brokerContactNumber: brokerData.brokerContact,
            brokerCompanyContactNumber: brokerData.brokerCompanyContact
          }),
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        showAlert("Broker updated successfully!", "success");
        setTimeout(() => navigate("/view-brokers"), 1500);
      } else {
        showAlert(data.error || "Failed to update broker", "error");
      }
    } catch (error) {
      console.error("Error updating broker:", error);
      showAlert("An error occurred while updating the broker.", "error");
    }
  };

  const userRole = localStorage.getItem('userRole');
  const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;
  
  return (
    <Layout>
      <div className="edit-broker-container">
        <h2>Edit Broker - {brokerData.brokerId} {brokerData.brokerName}</h2>
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
                className="read-only"
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
          </div>

          <div className="form-buttons">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/view-brokers")}
            >
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Save Changes
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
      </Layout>
  );
};

export default EditBroker;