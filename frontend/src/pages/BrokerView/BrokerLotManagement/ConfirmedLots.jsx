import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrokerLayout from "../../../components/Broker/BrokerLayout/BrokerLayout";
//import "./ConfirmedLots.css";

const BrokerConfirmedLots = () => {
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmedLots = async () => {
      try {
        const brokerId = "BROKER123"; // Replace with actual broker ID from auth //whyyyyy auth
        const response = await fetch(`http://localhost:3001/api/broker/${brokerId}/confirmed-lots`);
        if (!response.ok) throw new Error("Failed to fetch confirmed lots");
        const data = await response.json();
        setConfirmedLots(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchConfirmedLots();
  }, []);

  const handleAddSoldPrice = async (lotNumber) => {
    const soldPrice = prompt("Enter sold price:");
    if (!soldPrice || isNaN(soldPrice)) {
      alert("Please enter a valid number");
      return;
    }
  
    try {
      const response = await axios.post(
        `/api/lots/${lotNumber}/sold`,
        { brokerId, soldPrice },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error("Failed to add sold price");

      // Refresh the list
    const refreshResponse = await axios.get(`/api/lots/broker/${brokerId}/confirmed-lots`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setConfirmedLots(refreshResponse.data);
    alert("Sold price added successfully!");
  } catch (error) {
    alert("Error adding sold price: " + (error.response?.data?.error || error.message));
  }
};

  // Update the handleMarkAsPaid function
const handleMarkAsPaid = async (saleId) => {
  try {
    const response = await axios.post(
      `/api/lots/sold/${saleId}/mark-paid`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

      if (!response.ok) throw new Error("Failed to update payment status");

      // Refresh the list
    const refreshResponse = await axios.get(`/api/lots/broker/${brokerId}/confirmed-lots`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    setConfirmedLots(refreshResponse.data);
    alert("Payment status updated successfully!");
  } catch (error) {
    alert("Error updating payment status: " + (error.response?.data?.error || error.message));
  }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BrokerLayout>
      <div className="confirmed-lots-container">
        <h2>My Confirmed Lots</h2>
        
        <table className="confirmed-lots-table">
          <thead>
            <tr>
              <th>Lot Number</th>
              <th>Tea Grade</th>
              <th>No. of Bags</th>
              <th>Total Net Weight</th>
              <th>Confirmed Valuation</th>
              <th>Sold Price</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {confirmedLots.map((lot) => (
              <tr key={lot.lotNumber}>
                <td>{lot.lotNumber}</td>
                <td>{lot.teaGrade}</td>
                <td>{lot.noOfBags}</td>
                <td>{lot.totalNetWeight} kg</td>
                <td>{lot.valuationPrice} LKR</td>
                <td>
                  {lot.soldPrice ? (
                    `${lot.soldPrice} LKR`
                  ) : (
                    <button
                      onClick={() => handleAddSoldPrice(lot.lotNumber)}
                      className="add-sold-price-button"
                    >
                      Add Sold Price
                    </button>
                  )}
                </td>
                <td>
                  {lot.paymentStatus === 'paid' ? (
                    <span className="paid-status">Paid on {new Date(lot.paymentDate).toLocaleDateString()}</span>
                  ) : lot.soldPrice ? (
                    <button
                      onClick={() => handleMarkAsPaid(lot.saleId)}
                      className="mark-paid-button"
                    >
                      Mark as Paid
                    </button>
                  ) : (
                    <span className="pending-status">Pending</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => navigate(`/broker/view-lot/${lot.lotNumber}`)}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BrokerLayout>
  );
};

export default BrokerConfirmedLots;