import React, { useState, useEffect } from "react";
import SupplierLayout from "../../../components/Supplier/SupplierLayout/SupplierLayout";
import "./RequestTransport.css";

const RequestTransport = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [lands, setLands] = useState([]);
  const [reqDeliveryData, setReqDeliveryData] = useState({
    supplierId: "",
    reqDate: "",
    reqTime: "",
    reqNumberOfSacks: "",
    reqWeight: "",
    landId: "",
    delivery_routeId: "",
  });

  const [transportRequests, setTransportRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [pendingSubmit, setPendingSubmit] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReqDeliveryData({
      ...reqDeliveryData,
      [name]: value,
    });
  };

  const fetchTransportRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/api/transportRequests");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setTransportRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch transport requests", error);
      setError("Failed to load transport requests. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/deliveryRoutes");
      if (!res.ok) throw new Error("Failed to fetch routes");
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  const fetchLands = async (supplierId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/lands/by-supplier/${supplierId}`);
      if (!res.ok) throw new Error("Failed to fetch lands");
      const data = await res.json();
      setLands(data);
    } catch (err) {
      console.error("Error fetching lands:", err);
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setReqDeliveryData((prev) => ({
        ...prev,
        supplierId: storedUserId,
      }));

      fetchTransportRequests();
      fetchRoutes();
      fetchLands(storedUserId);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPendingSubmit({ ...reqDeliveryData });
    setOpenDialog(true);
  };

  const confirmSubmit = async () => {
    setOpenDialog(false);
    setIsLoading(true);
    setError(null);

    const { reqDate, reqTime } = pendingSubmit;

    const today = new Date().setHours(0, 0, 0, 0);
    const selectedDate = new Date(reqDate).setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("You cannot select a past date.");
      setIsLoading(false);
      return;
    }

    const [hour, minute] = reqTime.split(":").map(Number);
    if (hour < 8 || hour >= 20) {
      setError("Requested time must be between 08:00 and 20:00 (8AM to 8PM). Because Drivers are not available outside these hours.");
      setIsLoading(false);
      return;
    }

    try {
      const formattedDate = new Date(reqDate).toISOString().split("T")[0];
      const requestData = {
        ...pendingSubmit,
        reqDate: formattedDate,
        reqTime: reqTime + ":00",
      };

      const response = await fetch("http://localhost:3001/api/transportRequests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setSnackbarMessage("Transport request submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setReqDeliveryData((prev) => ({
        supplierId: prev.supplierId,
        reqDate: "",
        reqTime: "",
        reqNumberOfSacks: "",
        reqWeight: "",
        landId: "",
        delivery_routeId: "",
      }));

      await fetchTransportRequests();
    } catch (error) {
      console.error("Error submitting request:", error);
      setSnackbarMessage("Failed to submit transport request. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const resetForm = () => {
    setReqDeliveryData((prev) => ({
      supplierId: prev.supplierId,
      reqDate: "",
      reqTime: "",
      reqNumberOfSacks: "",
      reqWeight: "",
      landId: "",
      delivery_routeId: "",
    }));
  };

  return (
    <SupplierLayout>
      <div className="transport-page-container">
                  <div className="transport-page-header">
          <h2>Transport Requests</h2>
          
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="transport-content-container">
          <div className="transport-form-container">
            <div className="form-card">
              <div className="form-card-header">
                <h3>Request New Transport</h3>
               
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Supplier ID</label>
                    <input
                      type="text"
                      name="supplierId"
                      value={reqDeliveryData.supplierId}
                      readOnly
                      className="form-input disabled"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pickup Date</label>
                    <input
                      type="date"
                      name="reqDate"
                      value={reqDeliveryData.reqDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pickup Time</label>
                    <input
                      type="time"
                      name="reqTime"
                      value={reqDeliveryData.reqTime}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Number of Sacks</label>
                    <input
                      type="number"
                      name="reqNumberOfSacks"
                      value={reqDeliveryData.reqNumberOfSacks}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight (kg)</label>
                    <input
                      type="number"
                      name="reqWeight"
                      value={reqDeliveryData.reqWeight}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Delivery Route</label>
                    <select
                      name="delivery_routeId"
                      value={reqDeliveryData.delivery_routeId}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="">-- Select Route --</option>
                      {routes.map((route) => (
                        <option key={route.delivery_routeId} value={route.delivery_routeId}>
                          {route.delivery_routeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Select Land</label>
                    <select
                      name="landId"
                      value={reqDeliveryData.landId}
                      onChange={handleInputChange}
                      required
                      className="form-select"
                    >
                      <option value="">-- Select Land --</option>
                      {lands.map((land) => (
                        <option key={land.landId} value={land.landId}>
                          {land.landAddress}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    disabled={isLoading}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-submit"
                  >
                    {isLoading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="transport-table-container">
            <div className="table-card">
              <div className="table-card-header">
                <h3>My Transport Requests</h3>
                
              </div>
              
              <div className="table-responsive">
                {isLoading ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading transport requests...</p>
                  </div>
                ) : (
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Sacks</th>
                        <th>Weight</th>
                        <th>Route</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transportRequests.length > 0 ? (
                        transportRequests.map((req, index) => (
                          <tr key={index}>
                            <td>{new Date(req.reqDate).toLocaleDateString()}</td>
                            <td>{req.reqTime}</td>
                            <td>{req.reqNumberOfSacks}</td>
                            <td>{req.reqWeight} kg</td>
                            <td>{req.delivery_routeName}</td>
                            <td>
                              <span className={`status-badge ${req.status?.toLowerCase() || 'pending'}`}>
                                {req.status || "Pending"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="no-requests">
                            No transport requests found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog Component */}
      {openDialog && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Confirm Submission</h3>
              <button className="modal-close" onClick={() => setOpenDialog(false)}>×</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to submit this transport request?</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setOpenDialog(false)}>Cancel</button>
              <button className="btn-confirm" onClick={confirmSubmit}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar Component */}
      {snackbarOpen && (
        <div className={`snackbar ${snackbarSeverity}`}>
          <div className="snackbar-content">
            <span>{snackbarMessage}</span>
            <button onClick={handleSnackbarClose}>×</button>
          </div>
        </div>
      )}
    </SupplierLayout>
  );
};

export default RequestTransport;