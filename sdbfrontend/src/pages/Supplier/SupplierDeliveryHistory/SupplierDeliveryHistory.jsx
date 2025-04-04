import React, { useState, useEffect } from "react";
import SupplierLayout from "../../../components/supplier/SupplierLayout/SupplierLayout"; 
import "./SupplierDeliveryHistory.css"; // Ensure this file exists
import { BiSearch } from "react-icons/bi";

const SupplierDeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchDate, setSearchDate] = useState("");

  // Get supplier ID from localStorage (or context)
  const supplierId = localStorage.getItem("supplierId"); // Ensure this is set on login

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveries");
        if (!response.ok) throw new Error("Failed to fetch deliveries");

        const data = await response.json();

        // ✅ Filter deliveries for the specific supplier
        const supplierDeliveries = data.filter(
          (record) => record.supplierId === supplierId
        );

        // ✅ Sort by date (latest first)
        const sortedDeliveries = supplierDeliveries.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setDeliveries(sortedDeliveries);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
      }
    };

    fetchDeliveries();
  }, [supplierId]);

  // ✅ Filter by selected date
  const filteredDeliveries = deliveries.filter((delivery) => {
    if (!searchDate) return true; // Show all if no date is selected

    const deliveryDate = new Date(delivery.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    return deliveryDate === searchDate;
  });

  return (
    <SupplierLayout>
      <div className="my-deliveries-container">
        <div className="content-header">
          <h3>My Delivery Records</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="date" // ✅ Date picker instead of text input
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
              <BiSearch className="icon" />
            </div>
          </div>
        </div>

        <table className="deliveries-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transport</th>
              <th>Route</th>
              <th>Total Weight (kg)</th>
              <th>Total Sack Weight (kg)</th>
              <th>For Water (kg)</th>
              <th>Withered Leaves (kg)</th>
              <th>Ripe Leaves (kg)</th>
              <th>Randalu (kg)</th>
              <th>Green Tea Leaves (kg)</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery.deliveryId}>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No delivery records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </SupplierLayout>
  );
};

export default SupplierDeliveryHistory;
