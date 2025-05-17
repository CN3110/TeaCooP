import React, { useState, useEffect } from "react";
import SupplierLayout from "../../../components/supplier/SupplierLayout/SupplierLayout";
import "./RequestTransport.css";

const RequestTransport = () => {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState("");
  const [reqDeliveryData, setReqDeliveryData] = useState({
    supplierId: "",
    reqDate: "",
    reqTime: "",
    reqNumberOfSacks: "",
    reqWeight: "",
    reqAddress: "",
    delivery_routeId: "",
    
  });

  const [transportRequests, setTransportRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    // Fetch supplierId from localStorage and set it
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setReqDeliveryData((prev) => ({
        ...prev,
        supplierId: storedUserId,
      }));
    }

    fetchTransportRequests();
    fetchRoutes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const today = new Date().setHours(0, 0, 0, 0);
  const selectedDate = new Date(reqDeliveryData.reqDate).setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    setError("You cannot select a past date.");
    setIsLoading(false);
    return;
  }

    try {
      const formattedDate = new Date(reqDeliveryData.reqDate)
        .toISOString()
        .split("T")[0];

      const requestData = {
        ...reqDeliveryData,
        reqDate: formattedDate,
        reqTime: reqDeliveryData.reqTime + ":00",
      };

      const response = await fetch(
        "http://localhost:3001/api/transportRequests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Transport request submitted successfully!");
      setReqDeliveryData((prev) => ({
        supplierId: prev.supplierId, // keep the supplierId
        reqDate: "",
        reqTime: "",
        reqNumberOfSacks: "",
        reqWeight: "",
        reqAddress: "",
      }));
      await fetchTransportRequests();
    } catch (error) {
      console.error("Error submitting request:", error);
      setError("Failed to submit transport request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setReqDeliveryData((prev) => ({
      supplierId: prev.supplierId,
      reqDate: "",
      reqTime: "",
      reqNumberOfSacks: "",
      reqWeight: "",
      reqAddress: "",
    }));
  };

  return (
    <SupplierLayout>
      <div className="add-new-delivery-request">
      
        <h3>Requesting Transport</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Supplier ID:</label>
            <input
              type="text"
              name="supplierId"
              value={reqDeliveryData.supplierId}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input
  type="date"
  name="reqDate"
  value={reqDeliveryData.reqDate}
  onChange={handleInputChange}
  required
  min={new Date().toISOString().split("T")[0]} // sets today as the minimum
/>

          </div>
          <div className="form-group">
            <label>Time:</label>
            <input
              type="time"
              name="reqTime"
              value={reqDeliveryData.reqTime}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Number of Sacks:</label>
            <input
              type="number"
              name="reqNumberOfSacks"
              value={reqDeliveryData.reqNumberOfSacks}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
            <label>Weight (kg):</label>
            <input
              type="number"
              name="reqWeight"
              value={reqDeliveryData.reqWeight}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="form-group">
  <label>Delivery Route:</label>
  <select
    name="delivery_routeId"
    value={reqDeliveryData.delivery_routeId}
    onChange={handleInputChange}
    required
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
            <label>Address/Location:</label>
            <input
              type="text"
              name="reqAddress"
              value={reqDeliveryData.reqAddress}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={resetForm} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      <div className="form-separator">
        <h3 style={{ marginTop: "2rem" }}>My Transport Requests</h3>
        {isLoading ? (
          <p>Loading transport requests...</p>
        ) : (
          <table className="transport-requests-table">
            <thead>
  <tr>
    <th>Date</th>
    <th>Route</th>
    <th>Number of Sacks</th>
    <th>Weight (kg)</th>
    <th>Address/Location</th>
    <th>Status</th>
    <th>Driver ID</th>
  </tr>
</thead>
<tbody>
  {transportRequests.length > 0 ? (
    transportRequests.map((req, index) => (
      <tr key={index}>
        <td>{new Date(req.reqDate).toLocaleDateString()}</td>
        <td>{req.delivery_routeName}</td>
        <td>{req.reqNumberOfSacks}</td>
        <td>{req.reqWeight}</td>
        <td>{req.reqAddress}</td>
        <td>{req.status || "Pending"}</td>
        <td>{req.driverId}</td> {/*meka peenne na taam, driver view eka hdal iwar wela meka blnna*/}
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
    </SupplierLayout>
  );
};

export default RequestTransport;
