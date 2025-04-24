import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CreateLot.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const CreateLot = () => {
  const [teaGradeOptions, setTeaGradeOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showAlert = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const [lotData, setLotData] = useState({
    lotNumber: '',
    invoiceNumber: '',
    manufacturingDate: new Date(),
    teaGrade: '',
    noOfBags: '',
    netWeight: '',
    totalNetWeight: '',
    valuationPrice: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeaGrades = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/teaTypes");
        const data = await response.json();
        setTeaGradeOptions(data);
      } catch (error) {
        console.error("Error fetching tea grades:", error);
        showAlert("Failed to fetch tea grades", "error");
      }
    };
    fetchTeaGrades();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...lotData,
      [name]: value,
    };

    if (name === 'noOfBags' || name === 'netWeight') {
      const noOfBags = name === 'noOfBags' ? parseFloat(value) : parseFloat(lotData.noOfBags);
      const netWeight = name === 'netWeight' ? parseFloat(value) : parseFloat(lotData.netWeight);
      if (!isNaN(noOfBags) && !isNaN(netWeight)) {
        updatedData.totalNetWeight = (noOfBags * netWeight).toFixed(2);
      }
    }

    setLotData(updatedData);
  };

  const handleDateChange = (date) => {
    setLotData({ ...lotData, manufacturingDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fields = ["lotNumber", "invoiceNumber", "teaGrade", "noOfBags", "netWeight", "totalNetWeight", "valuationPrice"];
    for (let field of fields) {
      if (!lotData[field]) {
        alert("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }
    }

    const numbers = ["noOfBags", "netWeight", "totalNetWeight", "valuationPrice"];
    for (let field of numbers) {
      if (parseFloat(lotData[field]) <= 0) {
        alert("All numeric fields must be greater than zero.");
        setIsSubmitting(false);
        return;
      }
    }

    const formattedDate = new Date(lotData.manufacturingDate).toISOString().split('T')[0];

    const payload = {
      ...lotData,
      manufacturingDate: formattedDate,
      noOfBags: parseFloat(lotData.noOfBags),
      netWeight: parseFloat(lotData.netWeight),
      totalNetWeight: parseFloat(lotData.totalNetWeight),
      valuationPrice: parseFloat(lotData.valuationPrice),
    };

    try {
      const response = await fetch("http://localhost:3001/api/lots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add lot");
      }

      await response.json();
      showAlert("Lot added successfully!");

      setLotData({
        lotNumber: "",
        invoiceNumber: "",
        manufacturingDate: new Date(),
        teaGrade: "",
        noOfBags: "",
        netWeight: "",
        totalNetWeight: "",
        valuationPrice: "",
      });
    } catch (error) {
      console.error("Error adding lot:", error);
      showAlert("An error occurred while adding the lot: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
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
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Invoice Number:</label>
              <input
                type="text"
                name="invoiceNumber"
                value={lotData.invoiceNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Tea Grade:</label>
              <select
                name="teaGrade"
                value={lotData.teaGrade}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Grade</option>
                {teaGradeOptions.map((teaType) => (
                  <option key={teaType.teaTypeId} value={teaType.teaTypeName}>
                    {teaType.teaTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="lot-form-group">
              <label>Number of Bags:</label>
              <input
                type="number"
                name="noOfBags"
                value={lotData.noOfBags}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Net Weight (kg):</label>
              <input
                type="number"
                name="netWeight"
                value={lotData.netWeight}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Total Net Weight (kg):</label>
              <input
                type="number"
                name="totalNetWeight"
                value={lotData.totalNetWeight}
                readOnly
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Valuation Price (LKR):</label>
              <input
                type="number"
                name="valuationPrice"
                value={lotData.valuationPrice}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Date of Manufacture:</label>
              <DatePicker
                selected={lotData.manufacturingDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
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
    </EmployeeLayout>
  );
};

export default CreateLot;
