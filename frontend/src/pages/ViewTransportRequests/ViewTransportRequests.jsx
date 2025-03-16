import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./ViewTransportRequests.css";

const ViewTransportRequests = () => {
  const [searchId, setSearchId] = useState("");
  const [transportRequests, setTransportRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const navigate = useNavigate();

  // Fetch all transport requests from the server
  useEffect(() => {
    const fetchTransportRequests = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/transportRequests");
        if (response.ok) {
          const data = await response.json();
          setTransportRequests(data);
          setFilteredRequests(data); // Initially, show all requests
        } else {
          console.error("Failed to fetch transport requests");
        }
      } catch (error) {
        console.error("Error fetching transport requests:", error);
      }
    };

    fetchTransportRequests();
  }, []);

  // Handle search by supplier ID
  const handleSearch = () => {
    if (searchId.trim() === "") {
      setFilteredRequests(transportRequests); // If search is empty, show all requests
    } else {
      const filtered = transportRequests.filter(request =>
        request.supplierId.toLowerCase().includes(searchId.toLowerCase())
      );
      setFilteredRequests(filtered);
    }
  };

  // Handle input change for search
  const handleInputChange = (e) => {
    setSearchId(e.target.value);
  };

  // Handle key press for search (e.g., pressing Enter)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <EmployeeLayout>
      <div className="view-transport-requests">
        <h3>View Transport Requests</h3>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Supplier ID"
            value={searchId}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>
            <BiSearch />
          </button>
        </div>
        <div className="requests-table">
          <table>
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Number of Sacks</th>
                <th>Weight</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.supplierId}</td>
                  <td>{request.reqDate}</td>
                  <td>{request.reqTime}</td>
                  <td>{request.reqNumberOfSacks}</td>
                  <td>{request.reqWeight}</td>
                  <td>{request.reqAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ViewTransportRequests;