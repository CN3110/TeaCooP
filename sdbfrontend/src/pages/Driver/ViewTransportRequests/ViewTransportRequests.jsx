import React, { useEffect, useState } from "react";
import DriverLayout from "../../../components/Driver/DriverLayout/DriverLayout";
import "./ViewTransportRequests.css"; // We'll style it next

const DriverTransportRequests = () => {
  const [transportRequests, setTransportRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all requests
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

  // Update status to "Done"
  const updateStatus = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/transportRequests/${requestId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "done" }), // Status is passed as 'done'
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      alert("Status updated to Done!");
      fetchRequests(); // Refresh the table
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update status.");
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
                <th>Address</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transportRequests.length > 0 ? (
                transportRequests.map((req) => (
                  <tr key={req.requestId}> {/* Use requestId here */}
                    <td>{req.supplierId}</td>
                    <td>{new Date(req.reqDate).toLocaleDateString()}</td>
                    <td>{req.reqNumberOfSacks}</td>
                    <td>{req.reqWeight}</td>
                    <td>{req.reqAddress}</td>
                    <td>{req.status || "Pending"}</td>
                    <td>
                      {req.status === "done" ? ( // Match 'done' in lowercase
                        <span className="done-status">✔ Done</span>
                      ) : (
                        <button
                          className="mark-done-btn"
                          onClick={() => updateStatus(req.requestId)} // Corrected to use requestId
                        >
                          Mark as Done
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No transport requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </DriverLayout>
  );
};

export default DriverTransportRequests;
