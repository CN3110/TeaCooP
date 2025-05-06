import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewConfimedLots.css";

const ViewConfirmedLots = () => {
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfirmedLots = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3001/api/valuations/confirmed");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch confirmed lots");
        }
        const data = await res.json();
        setConfirmedLots(data);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch confirmed lots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedLots();
  }, []);

  const viewLotDetails = (lot) => {
    setSelectedLot(lot);
    setIsModalOpen(true);
  };

  const viewValuationDetails = (lotNumber) => {
    navigate(`/view-valuations/${lotNumber}`);
  };

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="vl-loading">Loading confirmed lots...</div>
      </EmployeeLayout>
    );
  }

  if (error) {
    return (
      <EmployeeLayout>
        <div className="vl-error">Error: {error}</div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="vl-container">
        <h2 className="vl-title">Confirmed Lot Valuations</h2>

        {confirmedLots.length === 0 ? (
          <div className="vl-empty">No confirmed lot valuations found.</div>
        ) : (
          <div className="vl-table-wrapper">
            <table className="vl-table">
              <thead>
                <tr>
                  <th>Lot Number</th>
                  <th>Tea Grade</th>
                  <th>Total Net Weight</th>
                  <th>Broker Name</th>
                  <th>Broker Company</th>
                  <th>Confirmed Valuation (LKR)</th>
                  <th>Confirmed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {confirmedLots.map((lot) => (
                  <tr key={lot.valuation_id}>
                    <td>{lot.lotNumber}</td>
                    <td>{lot.teaGrade}</td>
                    <td>{lot.totalNetWeight}</td>
                    <td>{lot.brokerName}</td>
                    <td>{lot.companyName}</td>
                    <td>{lot.valuationAmount}</td>
                    <td>
                      {new Date(lot.confirmed_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="vl-actions">
                        <button onClick={() => viewLotDetails(lot)} className="vl-btn-blue">
                          Lot Details
                        </button>
                        <button onClick={() => viewValuationDetails(lot.lotNumber)} className="vl-btn-green">
                          Valuations
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {isModalOpen && selectedLot && (
          <div className="vl-modal-overlay">
            <div className="vl-modal">
              <h3>Lot Details - {selectedLot.lotNumber}</h3>
              <ul>
                <li><strong>Tea Grade:</strong> {selectedLot.teaGrade}</li>
                <li><strong>Net Weight:</strong> {selectedLot.totalNetWeight} kg</li>
                <li><strong>Broker:</strong> {selectedLot.brokerName}</li>
                <li><strong>Company:</strong> {selectedLot.companyName}</li>
                <li><strong>Invoice No:</strong> {selectedLot.invoiceNumber}</li>
                <li><strong>Manufacturing Date:</strong> {new Date(selectedLot.manufacturingDate).toLocaleDateString()}</li>
                <li><strong>Confirmed At:</strong> {new Date(selectedLot.confirmed_at).toLocaleString()}</li>
              </ul>
              <div className="vl-modal-footer">
                <button onClick={() => setIsModalOpen(false)} className="vl-btn-red">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default ViewConfirmedLots;
