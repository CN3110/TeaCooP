import React, { useEffect, useState } from "react";
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'
import "./ViewTransportRequests.css"; // For styling (optional)

const ViewTransportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/transportRequests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching transport requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((req) => req.status === statusFilter);

  return (
    <EmployeeLayout>
    <div className="employee-delivery-container">
      <h2>Delivery Status Overview</h2>

      <div className="filter-controls">
        <label>Filter by Status: </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>
      </div>

      {loading ? (
        <p>Loading deliveries...</p>
      ) : filteredRequests.length === 0 ? (
        <p>No delivery requests found.</p>
      ) : (
        <table className="delivery-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Driver ID</th>
              <th>Date</th>
              <th>Sacks</th>
              <th>Weight (kg)</th>
              <th>Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req._id}>
                <td>{req.supplierId}</td>
                <td>{req.driverId || "N/A"}</td>
                <td>{new Date(req.reqDate).toLocaleDateString()}</td>
                <td>{req.reqNumberOfSacks}</td>
                <td>{req.reqWeight}</td>
                <td>{req.reqAddress}</td>
                <td
                  style={{
                    color: req.status === "done" ? "green" : "#d08400",
                    fontWeight: "bold",
                  }}
                >
                  {req.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </EmployeeLayout>
  );
};

export default ViewTransportRequests;
