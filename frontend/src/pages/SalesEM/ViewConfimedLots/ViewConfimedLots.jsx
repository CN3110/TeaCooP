import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import { Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "./ViewConfimedLots.css";

const ViewConfirmedLots = () => {
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmedLots = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/api/valuations/confirmed");

        const responseText = await res.text();

        if (!res.ok) {
          let errorData;
          try {
            errorData = JSON.parse(responseText);
          } catch (jsonError) {
            errorData = responseText;
          }
          throw new Error(
            typeof errorData === 'object' 
              ? errorData.message || "Failed to fetch confirmed lots" 
              : errorData || "Failed to fetch confirmed lots"
          );
        }

        const data = JSON.parse(responseText);
        setConfirmedLots(data);
        setSnackbar({ open: true, message: "Confirmed lots loaded!", severity: "success" });
      } catch (error) {
        setError(error.message);
        setSnackbar({ open: true, message: error.message, severity: "error" });
        console.error("Failed to fetch confirmed lots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmedLots();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const viewLotDetails = (lot) => {
    setSelectedLot(lot);
    setIsModalOpen(true);
  };

  const viewValuationDetails = (lotNumber) => {
    navigate(`/view-valuations/${lotNumber}`);
  };

  return (
    <EmployeeLayout>
      <div className="vl-container">
        <h2 className="vl-title">Confirmed Lot Valuations</h2>

        {loading ? (
          <div className="vl-loading">Loading confirmed lots...</div>
        ) : error ? (
          <div className="vl-error">Error: {error}</div>
        ) : confirmedLots.length === 0 ? (
          <div className="vl-empty">No confirmed lot valuations found.</div>
        ) : (
          <div className="vl-table-wrapper">
            <table className="vl-table">
              <thead>
                <tr>
                  <th>Lot Number</th>
                  <th>Tea Type</th>
                  <th>Total Net Weight</th>
                  <th>Broker Name</th>
                  <th>Broker Company</th>
                  <th>Confirmed Valuation (LKR)</th>
                  <th>Confirmed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedLots.map((lot) => (
                  <tr key={lot.valuation_id}>
                    <td>{lot.lotNumber}</td>
                    <td>{lot.teaTypeName}</td>
                    <td>{lot.totalNetWeight}</td>
                    <td>{lot.brokerName}</td>
                    <td>{lot.companyName}</td>
                    <td>{lot.valuationPrice}</td>
                    <td>
                      {new Date(lot.confirmed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="vl-actions">
                        <button onClick={() => viewLotDetails(lot)} className="vl-btn-blue">
                          Lot Details
                        </button>
                        <button onClick={() => viewValuationDetails(lot.lotNumber)} className="vl-btn-green">
                          Valuations
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Material UI Dialog */}
        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <DialogTitle>Lot Details - {selectedLot?.lotNumber}</DialogTitle>
          <DialogContent dividers>
            {selectedLot && (
              <ul>
                <li><strong>Tea Type:</strong> {selectedLot.teaTypeName}</li>
                <li><strong>Net Weight:</strong> {selectedLot.totalNetWeight} kg</li>
                <li><strong>Broker:</strong> {selectedLot.brokerName}</li>
                <li><strong>Company:</strong> {selectedLot.companyName}</li>
                <li><strong>Manufacturing Date:</strong> {new Date(selectedLot.manufacturingDate).toLocaleDateString()}</li>
                <li><strong>Confirmed At:</strong> {new Date(selectedLot.confirmed_at).toLocaleString()}</li>
              </ul>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </EmployeeLayout>
  );
};

export default ViewConfirmedLots;