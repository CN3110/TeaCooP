import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CreateLot.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const CreateLot = () => {
  const [teaTypes, setTeaTypes] = useState([]);
  const [teaTypeStock, setTeaTypeStock] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [errors, setErrors] = useState({
    teaTypeId: "",
    noOfBags: "",
    netWeight: "",
    valuationPrice: "",
    manufacturingDate: "",
    notes: "",
  });

  const [lotData, setLotData] = useState({
    lotNumber: "Auto Generated...",
    manufacturingDate: new Date(),
    teaTypeId: "",
    noOfBags: "",
    netWeight: "",
    totalNetWeight: "",
    valuationPrice: "",
    notes: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeaTypes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/teaTypes");
        const data = await response.json();
        setTeaTypes(data);
      } catch (error) {
        console.error("Error fetching tea types:", error);
        showAlert("Failed to fetch tea types", "error");
      }
    };

    const fetchTeaTypeStocks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/teaTypeStocks/available"
        );
        const data = await response.json();
        setTeaTypeStock(data);
      } catch (error) {
        console.error("Error fetching available tea stocks:", error);
      }
    };

    fetchTeaTypes();
    fetchTeaTypeStocks();
  }, []);

  const showAlert = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "teaTypeId":
        if (!value) {
          errorMessage = "Tea type is required";
        }
        break;
      case "noOfBags":
        if (!value) {
          errorMessage = "Number of bags is required";
        } else if (parseFloat(value) <= 0) {
          errorMessage = "Number of bags must be greater than zero";
        } else if (!Number.isInteger(parseFloat(value))) {
          errorMessage = "Number of bags must be a whole number";
        }
        break;
      case "netWeight":
        if (!value) {
          errorMessage = "Net weight is required";
        } else if (parseFloat(value) <= 0) {
          errorMessage = "Net weight must be greater than zero";
        }
        break;
      case "valuationPrice":
        if (!value) {
          errorMessage = "Valuation price is required";
        } else if (parseFloat(value) <= 0) {
          errorMessage = "Valuation price must be greater than zero";
        }
        break;
      case "manufacturingDate":
        if (!value) {
          errorMessage = "Manufacturing date is required";
        } else if (new Date(value) > new Date()) {
          errorMessage = "Manufacturing date cannot be in the future";
        }
        break;

      case "notes":
        if (value.length > 255) {
          errorMessage = "Notes must be under 255 characters";
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate the field
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));

    const updatedData = {
      ...lotData,
      [name]: value,
    };

    if (name === "noOfBags" || name === "netWeight") {
      const noOfBags =
        name === "noOfBags" ? parseFloat(value) : parseFloat(lotData.noOfBags);
      const netWeight =
        name === "netWeight"
          ? parseFloat(value)
          : parseFloat(lotData.netWeight);

      if (!isNaN(noOfBags) && !isNaN(netWeight)) {
        updatedData.totalNetWeight = (noOfBags * netWeight).toFixed(2);
      } else {
        updatedData.totalNetWeight = "";
      }
    }

    setLotData(updatedData);
  };

  const handleDateChange = (date) => {
    setLotData({ ...lotData, manufacturingDate: date });
    const errorMessage = validateField("manufacturingDate", date);
    setErrors((prev) => ({ ...prev, manufacturingDate: errorMessage }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    const fieldsToValidate = [
      "teaTypeId",
      "noOfBags",
      "netWeight",
      "valuationPrice",
      "manufacturingDate",
    ];

    fieldsToValidate.forEach((key) => {
      const error = validateField(key, lotData[key]);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlert("Please correct the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);

    const formattedDate = new Date(lotData.manufacturingDate)
      .toISOString()
      .split("T")[0];

    const payload = {
      manufacturingDate: formattedDate,
      teaTypeId: parseInt(lotData.teaTypeId),
      noOfBags: parseFloat(lotData.noOfBags),
      netWeight: parseFloat(lotData.netWeight),
      totalNetWeight: parseFloat(lotData.totalNetWeight),
      valuationPrice: parseFloat(lotData.valuationPrice),
      notes: lotData.notes.trim() || null, // Send as null if empty
    };

    // ADD THIS DEBUG LOG
    console.log("Payload being sent:", payload);

    try {
      const response = await fetch("http://localhost:3001/api/lots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add lot");
      }

      const data = await response.json();
      showAlert("Lot added successfully!");

      // Reset form
      setLotData({
        lotNumber: "Auto Generated...",
        manufacturingDate: new Date(),
        teaTypeId: "",
        noOfBags: "",
        netWeight: "",
        totalNetWeight: "",
        valuationPrice: "",
        notes: "", // Reset
      });

      setErrors({
        teaTypeId: "",
        noOfBags: "",
        netWeight: "",
        valuationPrice: "",
        manufacturingDate: "",
      });
    } catch (error) {
      console.error("Error adding lot:", error);
      showAlert(
        "An error occurred while adding the lot: " + error.message,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  

const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  return (
    <Layout>
      <div className="page-content">
        {/* Available Weights Card */}
        <div className="md:w-1/3 bg-gray-100 p-6 rounded-2xl shadow-md">
          <h2 className="text-lg font-bold mb-3 text-green-800">
            Available Weights
          </h2>
          {teaTypeStock.map((tea, index) => (
            <div
              key={index}
              className="flex justify-between py-1 border-b border-gray-300"
            >
              <span className="font-medium">{tea.teaTypeName}</span>
              <span className="text-gray-700">{tea.availableWeight} kg</span>
            </div>
          ))}
        </div>
        <div className="create-lot-container">
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{
                width: "100%",
                fontWeight: "bold",
                fontSize: "1rem",
                backgroundColor:
                  snackbar.severity === "success"
                    ? "rgb(14, 152, 16)"
                    : snackbar.severity === "error"
                    ? "rgb(211,47,47)"
                    : snackbar.severity === "warning"
                    ? "rgb(237, 201, 72)"
                    : "#1976d2",
                color: "white",
                boxShadow: 3,
              }}
              elevation={6}
              variant="filled"
            >
              {snackbar.message}
            </MuiAlert>
          </Snackbar>

          <h2>Create Lot</h2>
          <form className="lot-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="lot-form-group">
                <label>Lot Number:</label>
                <input
                  type="text"
                  name="lotNumber"
                  value={lotData.lotNumber}
                  onChange={handleInputChange}
                  readOnly
                  className="read-only-input"
                />
              </div>

              <div className="lot-form-group">
                <label>Tea Type:</label>
                <select
                  name="teaTypeId"
                  value={lotData.teaTypeId}
                  onChange={handleInputChange}
                  required
                  className={errors.teaTypeId ? "error" : ""}
                >
                  <option value="">Select Tea Type</option>
                  {teaTypes.map((teaType) => (
                    <option key={teaType.teaTypeId} value={teaType.teaTypeId}>
                      {teaType.teaTypeName}
                    </option>
                  ))}
                </select>
                {errors.teaTypeId && (
                  <div className="error-message">{errors.teaTypeId}</div>
                )}
              </div>

              <div className="lot-form-group">
                <label>Number of Bags:</label>
                <input
                  type="number"
                  name="noOfBags"
                  value={lotData.noOfBags}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  required
                  className={errors.noOfBags ? "error" : ""}
                />
                {errors.noOfBags && (
                  <div className="error-message">{errors.noOfBags}</div>
                )}
              </div>

              <div className="lot-form-group">
                <label>Net Weight per bag(kg) :</label>
                <input
                  type="number"
                  name="netWeight"
                  value={lotData.netWeight}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  required
                  className={errors.netWeight ? "error" : ""}
                />
                {errors.netWeight && (
                  <div className="error-message">{errors.netWeight}</div>
                )}
              </div>

              <div className="lot-form-group">
                <label>Total Net Weight (kg):</label>
                <input
                  type="number"
                  name="totalNetWeight"
                  value={lotData.totalNetWeight}
                  readOnly
                  required
                  className="read-only-input"
                />
              </div>

              <div className="lot-form-group">
                <label>Valuation Price per kg(LKR):</label>
                <input
                  type="number"
                  name="valuationPrice"
                  value={lotData.valuationPrice}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.01"
                  required
                  className={errors.valuationPrice ? "error" : ""}
                />
                {errors.valuationPrice && (
                  <div className="error-message">{errors.valuationPrice}</div>
                )}
              </div>

              <div className="lot-form-group">
                <label>Date of Manufacture:</label>
                <DatePicker
                  selected={lotData.manufacturingDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  required
                  className={errors.manufacturingDate ? "error" : ""}
                />
                {errors.manufacturingDate && (
                  <div className="error-message">
                    {errors.manufacturingDate}
                  </div>
                )}
              </div>
            </div>
            <div className="lot-form-group">
              <label>Notes (optional):</label>
              <textarea
                name="notes"
                value={lotData.notes}
                onChange={handleInputChange}
                maxLength="255"
                rows="3"
                placeholder="Any additional details..."
                className={errors.notes ? "error" : ""}
              ></textarea>
              {errors.notes && (
                <div className="error-message">{errors.notes}</div>
              )}
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Lot"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/view-lots")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateLot;
