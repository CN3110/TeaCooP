import React, { useEffect, useState } from "react";
import DriverLayout from "../../../components/Driver/DriverLayout/DriverLayout";
import "./ViewTransportRequests.css";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

const DriverTransportRequests = () => {
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/transportRequests");
      if (!res.ok) throw new Error("Failed to fetch transport requests");
      const data = await res.json();
      setTransportRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching:", err);
      setError("Could not load transport requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleMarkAsDoneClick = (requestId) => {
    setSelectedRequestId(requestId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRequestId(null);
  };

  const confirmMarkAsDone = async () => {
    if (!selectedRequestId) return;

    try {
      const driverId = localStorage.getItem("userId");

      if (!driverId) {
        showSnackbar("Driver ID not found in localStorage.", "error");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/transportRequests/${selectedRequestId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "done", driverId }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      showSnackbar("Status updated to Done!", "success");
      fetchRequests();
    } catch (err) {
      console.error("Update error:", err);
      showSnackbar("Failed to update status.", "error");
    } finally {
      handleDialogClose();
    }
  };

  return (
    <DriverLayout>
      <div className="driver-requests-container">
        <h2>All Transport Requests</h2>

        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="driver-requests-table">
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Date</th>
                <th>Number of Sacks</th>
                <th>Weight (kg)</th>
                <th>Route</th>
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transportRequests.length > 0 ? (
                transportRequests.map((req) => (
                  <tr key={req.requestId}>
                    <td>{req.supplierId}</td>
                    <td>{new Date(req.reqDate).toLocaleDateString()}</td>
                    <td>{req.reqNumberOfSacks}</td>
                    <td>{req.reqWeight}</td>
                    <td>{req.delivery_routeName}</td>
                    <td>{req.reqAddress}</td>
                    <td>{req.status || "Pending"}</td>
                    <td>
                      {req.status === "done" ? (
                        <span className="done-status">✔ Done</span>
                      ) : (
                        <button
                          className="mark-done-btn"
                          onClick={() => handleMarkAsDoneClick(req.requestId)}
                        >
                          Mark as Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No transport requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Are you sure you want to mark this as Done?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={confirmMarkAsDone} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DriverLayout>
  );
};

export default DriverTransportRequests;
