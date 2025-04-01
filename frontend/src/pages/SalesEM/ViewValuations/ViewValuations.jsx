import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
//import "./ViewValuations.css";

const ViewValuations = () => {
  const { lotNumber } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState(null);
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lot details
        const lotResponse = await fetch(`http://localhost:3001/api/lots/${lotNumber}`);
        if (!lotResponse.ok) throw new Error("Failed to fetch lot details");
        const lotData = await lotResponse.json();
        setLot(lotData);

        // Fetch valuations
        const valuationsResponse = await fetch(`http://localhost:3001/api/lots/${lotNumber}/valuations`);
        if (!valuationsResponse.ok) throw new Error("Failed to fetch valuations");
        const valuationsData = await valuationsResponse.json();
        setValuations(valuationsData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [lotNumber]);

  const handleConfirmValuation = async (valuationId) => {
    try {
      const employeeId = "EMP123"; // Replace with actual employee ID from auth
      const response = await fetch(`http://localhost:3001/api/lots/valuations/${valuationId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }),
      });

      if (!response.ok) throw new Error("Failed to confirm valuation");

      // Refresh valuations
      const valuationsResponse = await fetch(`http://localhost:3001/api/lots/${lotNumber}/valuations`);
      const valuationsData = await valuationsResponse.json();
      setValuations(valuationsData);

      alert("Valuation confirmed successfully!");
    } catch (error) {
      alert("Error confirming valuation: " + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <EmployeeLayout>
      <div className="view-valuations-container">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to Lots
        </button>

        <h2>Lot Details</h2>
        {lot && (
          <div className="lot-details">
            <p><strong>Lot Number:</strong> {lot.lotNumber}</p>
            <p><strong>Invoice Number:</strong> {lot.invoiceNumber}</p>
            <p><strong>Manufacturing Date:</strong> {new Date(lot.manufacturingDate).toLocaleDateString()}</p>
            <p><strong>Tea Grade:</strong> {lot.teaGrade}</p>
            <p><strong>No. of Bags:</strong> {lot.noOfBags}</p>
            <p><strong>Net Weight:</strong> {lot.netWeight} kg</p>
            <p><strong>Total Net Weight:</strong> {lot.totalNetWeight} kg</p>
            <p><strong>Employee Valuation:</strong> {lot.valuationPrice} LKR</p>
          </div>
        )}

        <h2>Broker Valuations</h2>
        <table className="valuations-table">
          <thead>
            <tr>
              <th>Broker Name</th>
              <th>Company</th>
              <th>Valuation Price (LKR)</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {valuations.map((valuation) => (
              <tr key={valuation.valuation_id}>
                <td>{valuation.brokerName}</td>
                <td>{valuation.brokerCompanyName}</td>
                <td>{valuation.valuationPrice}</td>
                <td>{new Date(valuation.valuationDate).toLocaleString()}</td>
                <td>{valuation.is_confirmed ? "Confirmed" : "Pending"}</td>
                <td>
                  {!valuation.is_confirmed && (
                    <button
                      onClick={() => handleConfirmValuation(valuation.valuation_id)}
                      className="confirm-button"
                    >
                      Confirm
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewValuations;