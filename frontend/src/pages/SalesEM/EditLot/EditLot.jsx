import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./EditLot.css";

const EditLot = () => {
  const { lotNumber } = useParams();
  const navigate = useNavigate();

  const [lotData, setLotData] = useState({
    lotNumber: "",
    manufacturingDate: "",
    teaTypeId: "",
    noOfBags: "",
    netWeight: "",
    totalNetWeight: "",
    valuationPrice: "",
    notes: "",
  });

  const [teaTypes, setTeaTypes] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teaTypesResponse = await fetch("http://localhost:3001/api/teaTypes");
        if (!teaTypesResponse.ok) throw new Error("Failed to fetch tea types");
        const teaTypesData = await teaTypesResponse.json();
        setTeaTypes(teaTypesData);

        const lotResponse = await fetch(`http://localhost:3001/api/lots/${lotNumber}`);
        if (!lotResponse.ok) throw new Error("Failed to fetch lot data");
        const lotData = await lotResponse.json();

        setLotData({
          ...lotData,
          manufacturingDate: lotData.manufacturingDate.split("T")[0],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert("Failed to load data. Please try again.", "error");
      }
    };

    fetchData();
  }, [lotNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLotData({ ...lotData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !lotData.lotNumber ||
      !lotData.manufacturingDate ||
      !lotData.teaTypeId ||
      !lotData.noOfBags ||
      !lotData.netWeight ||
      !lotData.totalNetWeight ||
      !lotData.valuationPrice 
    ) {
      showAlert("Please fill in all required fields.", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/lots/${lotNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lotData,
          teaTypeId: Number(lotData.teaTypeId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update lot");
      }

      showAlert("Lot updated successfully!", "success");

      setTimeout(() => {
        navigate("/view-lots");
      }, 1500);
    } catch (error) {
      console.error("Error updating lot:", error);
      showAlert("An error occurred while updating the lot: " + error.message, "error");
    }
  };

  
const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  return (
    <Layout>
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

      <div className="edit-lot-container">
        <h2>Edit Lot</h2>
        <form className="edit-lot-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Lot Number:</label>
              <input
                type="text"
                name="lotNumber"
                value={lotData.lotNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Manufacturing Date:</label>
              <input
                type="date"
                name="manufacturingDate"
                value={lotData.manufacturingDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tea Type:</label>
              <select
                name="teaTypeId"
                value={lotData.teaTypeId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Tea Type</option>
                {teaTypes.map((teaType) => (
                  <option key={teaType.teaTypeId} value={teaType.teaTypeId}>
                    {teaType.teaTypeName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>No. of Bags:</label>
              <input
                type="number"
                name="noOfBags"
                value={lotData.noOfBags}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
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

            <div className="form-group">
              <label>Total Net Weight (kg):</label>
              <input
                type="number"
                name="totalNetWeight"
                value={lotData.totalNetWeight}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
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
            <div className="form-group">
              <label>Notes (optional):</label>
              <textarea
                name="notes"
                value={lotData.notes}
                onChange={handleInputChange}
                maxLength="255"
                rows="3"
                placeholder="Any additional details..."
                
              ></textarea>
              
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Update Lot
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
    </Layout>
  );
};

export default EditLot;
