import React, { useState, useEffect } from "react";
import DriverLayout from "../../../components/Driver/DriverLayout/DriverLayout";
//import "./ViewTransportRequests.css";

const ViewTransportRequests = () => {
  const [transportRequests, setTransportRequests] = useState([]);
  const [filters, setFilters] = useState({
    date: "",
    location: "",
    status: "pending", // Default filter for pending requests
  });

  // Fetch transport requests from the backend
  useEffect(() => {
    const fetchTransportRequests = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/transportRequests");
        if (response.ok) {
          const data = await response.json();
          setTransportRequests(data);
        } else {
          console.error("Failed to fetch transport requests");
        }
      } catch (error) {
        console.error("Error fetching transport requests:", error);
      }
    };

    fetchTransportRequests();
  }, []);

  // Handle accepting a request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/transportRequests/${requestId}/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Request accepted successfully!");
        // Update the request status in the local state
        setTransportRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, status: "accepted" } : request
          )
        );
      } else {
        alert("Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Handle rejecting a request
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/transportRequests/${requestId}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Request rejected successfully!");
        // Update the request status in the local state
        setTransportRequests((prevRequests) =>
          prevRequests.map((request) =>
            request._id === requestId ? { ...request, status: "rejected" } : request
          )
        );
      } else {
        alert("Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  // Filter requests based on selected filters
  const filteredRequests = transportRequests.filter((request) => {
    return (
      (filters.date === "" || request.reqDate === filters.date) &&
      (filters.location === "" || request.reqAddress.includes(filters.location)) &&
      (filters.status === "" || request.status === filters.status)
    );
  });

  return (
    <DriverLayout>
      <div className="view-transport-requests">
        <h3>Transport Requests</h3>

        {/* Filters Section */}
        <div className="filters">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            placeholder="Filter by date"
          />
          <input
            type="text"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="Filter by location"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Transport Requests List */}
        <div className="requests-list">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <div key={request._id} className="request-item">
                <p><strong>Date:</strong> {request.reqDate}</p>
                <p><strong>Time:</strong> {request.reqTime}</p>
                <p><strong>Location:</strong> {request.reqAddress}</p>
                <p><strong>Number of Sacks:</strong> {request.reqNumberOfSacks}</p>
                <p><strong>Weight:</strong> {request.reqWeight} kg</p>
                <p><strong>Status:</strong> {request.status}</p>

                {/* Action Buttons */}
                {request.status === "pending" && (
                  <div className="request-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleAcceptRequest(request._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleRejectRequest(request._id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No transport requests found.</p>
          )}
        </div>
      </div>
    </DriverLayout>
  );
};

export default ViewTransportRequests;