import React, { useEffect, useState } from "react";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./ViewTransportRequests.css";

const ViewTransportRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchDate, setSearchDate] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [driverFilter, setDriverFilter] = useState("all");

  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchRoutes();
    fetchDrivers();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/transportRequests");
      const data = await res.json();
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.reqDate) - new Date(a.reqDate))
        : [];
      setRequests(sorted);
    } catch (error) {
      console.error("Error fetching transport requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/deliveryRoutes");
      const data = await res.json();
      setRoutes(data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/drivers");
      const data = await res.json();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;

    const requestDate = new Date(req.reqDate).toISOString().split("T")[0];
    const matchesDate = !searchDate || requestDate === searchDate;

    const matchesRoute = routeFilter === "all" || req.delivery_routeName === routeFilter;

    const matchesDriver = driverFilter === "all" || req.driverId === driverFilter;

    return matchesStatus && matchesDate && matchesRoute && matchesDriver;
  });

  const totalWeight = filteredRequests.reduce(
    (acc, req) => acc + parseFloat(req.reqWeight || 0),
    0
  );

  return (
    <EmployeeLayout>
      <div className="employee-delivery-container">
        <h2>Delivery Status Overview</h2>

        <div className="summary-card">
          <h3>Total Weight (kg)</h3>
          <p>{totalWeight.toFixed(2)}</p>
        </div>

        <div className="filter-controls">
          <label>Filter by Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>

          <label style={{ marginLeft: "20px" }}>Filter by Date:</label>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />

          <label style={{ marginLeft: "20px" }}>Filter by Route:</label>
          <select value={routeFilter} onChange={(e) => setRouteFilter(e.target.value)}>
            <option value="all">All</option>
            {routes.map((route) => (
              <option key={route.delivery_routeId} value={route.delivery_routeName}>
                {route.delivery_routeName}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: "20px" }}>Filter by Driver:</label>
          <select value={driverFilter} onChange={(e) => setDriverFilter(e.target.value)}>
            <option value="all">All</option>
            {drivers.map((driver) => (
              <option key={driver.driverId} value={driver.driverId}>
                {driver.driverId} - {driver.driverName}
              </option>
            ))}
          </select>

          <button
            className="clear-btn"
            onClick={() => {
              setStatusFilter("all");
              setSearchDate("");
              setRouteFilter("all");
              setDriverFilter("all");
            }}
          >
            Clear Filters
          </button>
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
                <th>Route</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id}>
                  <td>{req.supplierId}</td>
                  <td>{req.driverId}</td>
                  <td>{new Date(req.reqDate).toLocaleDateString()}</td>
                  <td>{req.reqNumberOfSacks}</td>
                  <td>{req.reqWeight}</td>
                  <td>{req.delivery_routeName}</td>
                  <td>{req.landAddress}</td>
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
