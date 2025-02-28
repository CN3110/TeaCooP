import React, { useEffect, useState } from "react";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import { BiSearch } from "react-icons/bi"; // Ensure this package is installed
import "./ViewDeliveryRecords.css";
import { Link } from "react-router-dom";

function ViewDeliveryRecords() {
  const [deliveryRecords, setDeliveryRecords] = useState([]);
  const [supplierId, setSupplierId] = useState(""); // State for search input

  // Fetch delivery records from API
  useEffect(() => {
    console.log("Fetching data..."); // Log to verify useEffect is triggered
    fetch("http://localhost:3001/api/deliveries")
      .then((response) => {
        console.log("Response:", response); // Log the response object
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the fetched data
        setDeliveryRecords(data);
      })
      .catch((error) => {
        console.error("Error fetching delivery records:", error); // Log any errors
      });
  }, []);

  // Handle search input change
  const handleSearchChange = (event) => {
    setSupplierId(event.target.value);
  };

  // Handle search submit (Filter results)
  const handleSearchSubmit = () => {
    const filteredRecords = deliveryRecords.filter((record) =>
      record.supplierId.toString().includes(supplierId)
    );
    console.log("Filtered records:", filteredRecords); // Log the filtered records
    setDeliveryRecords(filteredRecords);
  };

  return (
    <EmployeeLayout>
      <div className="view-delivery-container">
        <div className="content-header">
          <h3>View Delivery Records</h3>

          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Supplier ID"
                value={supplierId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" onClick={handleSearchSubmit} />
            </div>
            <div className="add-delivery-btn">
              <Link to="/add-new-delivery-record" className="btn btn-success">
                Add New Delivery Record
              </Link>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Supplier ID</th>
                <th>Date</th>
                <th>Transport</th>
                <th>Route</th>
                <th>Total Weight</th>
                <th>Total Sack Weight</th>
                <th>For Water</th>
                <th>For Withered Leaves</th>
                <th>For Ripe Leaves</th>
                <th>Randalu</th>
                <th>Green Tea Leaves</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(deliveryRecords) && deliveryRecords.length > 0 ? (
                deliveryRecords.map((delivery, index) => (
                  <tr key={index}>
                    <td>{delivery.supplierId}</td>
                    <td>{delivery.date}</td>
                    <td>{delivery.transport}</td>
                    <td>{delivery.route}</td>
                    <td>{delivery.totalWeight}</td>
                    <td>{delivery.totalSackWeight}</td>
                    <td>{delivery.forWater}</td>
                    <td>{delivery.forWitheredLeaves}</td>
                    <td>{delivery.forRipeLeaves}</td>
                    <td>{delivery.randalu}</td>
                    <td>{delivery.greenTeaLeaves}</td>
                    <td>
                      <button className="btn-view">View</button>
                      <button className="btn-edit">Edit</button>
                      <button className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12">No delivery records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </EmployeeLayout>
  );
}

export default ViewDeliveryRecords;

/* 
  handle search function correctly 
    when the user clears the search bar the results should be all the delivery table(normal table)

  create view (popup)
         edit (popup)
         delete  functions 
          
          
*/