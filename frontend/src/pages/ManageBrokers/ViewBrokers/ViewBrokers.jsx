import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewBrokers.css";

const ViewBrokers = () => {
  const [searchId, setSearchId] = useState("");
  const [brokers, setBrokers] = useState([]);
  const [filteredBrokers, setFilteredBrokers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/brokers");
        if (response.ok) {
          const data = await response.json();
          setBrokers(data);
          setFilteredBrokers(data);
        } else {
          console.error("Failed to fetch brokers");
        }
      } catch (error) {
        console.error("Error fetching brokers:", error);
      }
    };

    fetchBrokers();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchId(searchTerm);
    const filtered = brokers.filter((broker) =>
      broker.brokerId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBrokers(filtered);
  };

  const handleAddBroker = () => {
    navigate("/add-broker");
  };

  const handleEdit = (broker) => {
    navigate(`/edit-broker/${broker.brokerId}`);
  };

  const handleDelete = async (brokerId) => {
    if (window.confirm("Are you sure you want to delete this broker?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/brokers/${brokerId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const updatedBrokers = brokers.filter(
            (broker) => broker.brokerId !== brokerId
          );
          setBrokers(updatedBrokers);
          setFilteredBrokers(updatedBrokers);
        } else {
          console.error("Failed to delete broker");
        }
      } catch (error) {
        console.error("Error deleting broker:", error);
      }
    }
  };

  return (
    <EmployeeLayout>
      <div className="view-broker-container">
        <div className="content-header">
          <h3>View Brokers</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Driver ID"
                value={searchId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            <button className="add-broker-btn" onClick={handleAddBroker}>
              Add New Broker
            </button>
          </div>
        </div>
        <table className="brokers-table">
          <thead>
            <tr>
              <th>Broker ID</th>
              <th>Broker Name</th>
              <th>Broker Phone</th>
              <th>Broker Email</th>
              <th>Company Name</th>
              <th>Company Phone</th>
              <th>Company Email</th>
              <th>Company Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrokers.map((broker) => (
              <tr key={broker.brokerId}>
                <td>{broker.brokerId}</td>
                <td>{broker.brokerName}</td>
                <td>{broker.brokerContact}</td>
                <td>{broker.brokerEmail}</td>
                <td>{broker.brokerCompanyName}</td>
                <td>{broker.brokerCompanyContact}</td>
                <td>{broker.brokerCompanyEmail}</td>
                <td>{broker.brokerCompanyAddress}</td>
                <td>
                  <button onClick={() => handleEdit(broker)}>Edit</button>
                  <button onClick={() => handleDelete(broker.brokerId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewBrokers;
