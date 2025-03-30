import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrokerLayout from "../../../components/Broker/BrokerLayout/BrokerLayout";
import 'react-datepicker/dist/react-datepicker.css';
//import './BrokerLotManagement.css';

const BrokerLotManagement = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokerValuations, setBrokerValuations] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState({});

  const navigate = useNavigate();

  // Fetch all lots from the server
  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/lots");
        if (!response.ok) {
          throw new Error("Failed to fetch lots");
        }
        const data = await response.json();
        setLots(data);
        
        // Initialize broker valuations with existing values or empty strings
        const initialValuations = {};
        data.forEach(lot => {
          initialValuations[lot.lotNumber] = lot.brokerValuationPrice || "";
        });
        setBrokerValuations(initialValuations);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLots();
  }, []);

  // Handle broker valuation input changes
  const handleValuationChange = (lotNumber, value) => {
    setBrokerValuations(prev => ({
      ...prev,
      [lotNumber]: value
    }));
  };

  // Handle save broker valuation
  const handleSaveValuation = async (lotNumber) => {
    const valuation = brokerValuations[lotNumber];
    
    if (!valuation || parseFloat(valuation) <= 0) {
      alert("Please enter a valid broker valuation price (greater than 0)");
      return;
    }

    setSaving(prev => ({ ...prev, [lotNumber]: true }));

    try {
      const response = await fetch(`http://localhost:3001/api/lots/${lotNumber}/valuation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brokerValuationPrice: parseFloat(valuation)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update valuation");
      }

      const updatedLot = await response.json();
      
      // Update the local state with the updated lot
      setLots(lots.map(lot => 
        lot.lotNumber === lotNumber ? updatedLot : lot
      ));

      alert("Valuation saved successfully!");
    } catch (error) {
      console.error("Error saving valuation:", error);
      alert("An error occurred while saving the valuation: " + error.message);
    } finally {
      setSaving(prev => ({ ...prev, [lotNumber]: false }));
    }
  };

  // Filter lots based on search term
  const filteredLots = lots.filter(lot => 
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.teaGrade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <BrokerLayout>
      <div className="broker-lot-management-container">
        <h2>Lot Management</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Lot Number, Invoice, or Grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="lots-table-container">
          <table className="lots-table">
            <thead>
              <tr>
                <th>Lot Number</th>
                <th>Invoice Number</th>
                <th>Manufacturing Date</th>
                <th>Tea Grade</th>
                <th>No. of Bags</th>
                <th>Net Weight (kg)</th>
                <th>Total Net Weight (kg)</th>
                <th>Employee Valuation (LKR)</th>
                <th>Broker Valuation (LKR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map((lot) => (
                <tr key={lot.lotNumber}>
                  <td>{lot.lotNumber}</td>
                  <td>{lot.invoiceNumber}</td>
                  <td>{new Date(lot.manufacturingDate).toLocaleDateString()}</td>
                  <td>{lot.teaGrade}</td>
                  <td>{lot.noOfBags}</td>
                  <td>{lot.netWeight} kg</td>
                  <td>{lot.totalNetWeight} kg</td>
                  <td>{lot.valuationPrice.toLocaleString()} LKR</td>
                  <td>
                    <div className="valuation-input-container">
                      <input
                        type="number"
                        value={brokerValuations[lot.lotNumber] || ""}
                        onChange={(e) => handleValuationChange(lot.lotNumber, e.target.value)}
                        min="0.01"
                        step="0.01"
                        className="valuation-input"
                        placeholder="Enter valuation"
                      />
                      <span>LKR/kg</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleSaveValuation(lot.lotNumber)}
                      disabled={saving[lot.lotNumber]}
                      className="save-button"
                    >
                      {saving[lot.lotNumber] ? "Saving..." : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BrokerLayout>
  );
};

export default BrokerLotManagement;