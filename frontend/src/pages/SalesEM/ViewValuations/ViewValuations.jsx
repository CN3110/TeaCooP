import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const ViewValuations = () => {
  const { lotNumber } = useParams();
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValuationId, setSelectedValuationId] = useState(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error"

  useEffect(() => {
    const fetchValuations = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/api/valuations/lot/${lotNumber}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch valuations");
        }
        const data = await res.json();
        setValuations(data);
        setError(null);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch valuations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchValuations();
  }, [lotNumber]);

  const handleOpenDialog = (valuationId) => {
    setSelectedValuationId(valuationId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedValuationId(null);
  };

  const handleConfirm = async () => {
  try {
    const employeeId = localStorage.getItem("userId");
    if (!employeeId) {
      setSnackbarMessage("Employee ID not found. Please log in again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      handleCloseDialog();
      return;
    }

    // Confirm the valuation (now handles both confirmation and status update)
    const res = await fetch(
      `http://localhost:3001/api/lots/valuations/${selectedValuationId}/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to confirm valuation");
    }

    setSnackbarMessage("Valuation confirmed and lot status updated!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    handleCloseDialog();

    // Reload updated valuations
    const updated = await fetch(
      `http://localhost:3001/api/valuations/lot/${lotNumber}`
    );
    if (!updated.ok) {
      const errorData = await updated.json();
      throw new Error(errorData.message || "Failed to reload valuations");
    }
    const data = await updated.json();
    setValuations(data);
  } catch (error) {
    console.error("Error confirming valuation:", error);
    setSnackbarMessage(`Error: ${error.message}`);
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    handleCloseDialog();
  }
};
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading)
    return (
      <EmployeeLayout>
        <div className="p-6">Loading valuations...</div>
      </EmployeeLayout>
    );

  if (error)
    return (
      <EmployeeLayout>
        <div className="p-6 text-red-500">Error: {error}</div>
      </EmployeeLayout>
    );

  return (
    <EmployeeLayout>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Valuations for Lot {lotNumber}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Back
        </button>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Broker ID</th>
              <th className="border px-4 py-2">Broker Name</th>
              <th className="border px-4 py-2">Company Name</th>
              <th className="border px-4 py-2">Valuation (LKR)</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {valuations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No valuations available for this lot.
                </td>
              </tr>
            ) : (
              valuations.map((v) => (
                <tr key={v.valuation_id}>
                  <td className="border px-4 py-2">{v.brokerId}</td>
                  <td className="border px-4 py-2">{v.brokerName}</td>
                  <td className="border px-4 py-2">{v.companyName}</td>
                  <td className="border px-4 py-2">{v.valuationAmount}</td>
                  <td className="border px-4 py-2">
                    {v.is_confirmed
                      ? "✅ Confirmed"
                      : v.is_rejected
                      ? "❌ Rejected"
                      : "Pending"}
                  </td>
                  <td className="border px-4 py-2">
                    {!v.is_confirmed && !v.is_rejected && (
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => handleOpenDialog(v.valuation_id)}
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Valuation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to confirm this valuation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </EmployeeLayout>
  );
};

export default ViewValuations;
