import React, { useEffect, useState } from 'react';
import BrokerLayout from '../../../components/broker/BrokerLayout/BrokerLayout';
import { Table, Button, Form } from 'react-bootstrap';
import { FaCheck } from 'react-icons/fa';
import axios from 'axios';

const ViewNewLots = () => {
  const [lots, setLots] = useState([]);
  const [valuationInputs, setValuationInputs] = useState({});

  // Simulate brokerId for testing
  useEffect(() => {
    if (!localStorage.getItem('brokerId')) {
      localStorage.setItem('brokerId', 'B001'); // Test broker
    }

    fetchLots();
  }, []);

  const fetchLots = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/lots/available');
      setLots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (lotNumber, value) => {
    setValuationInputs((prev) => ({
      ...prev,
      [lotNumber]: value,
    }));
  };

  const submitValuation = async (lotNumber) => {
    const brokerId = localStorage.getItem('brokerId');
    const price = valuationInputs[lotNumber];

    if (!price || isNaN(price)) {
      alert("Please enter a valid valuation price.");
      return;
    }

    try {
        await axios.post(`http://localhost:3001/api/lots/${lotNumber}/valuation`, {
            brokerId,
            valuationPrice: parseFloat(price),
          });
          

      alert('Valuation submitted!');
      fetchLots(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

  return (
    <BrokerLayout>
    <div className="container mt-4">
      <h3>View New Lots</h3>
      <Table striped bordered hover responsive className="mt-3">
        <thead className="table-dark">
          <tr>
            <th>Lot #</th>
            <th>Invoice #</th>
            <th>Grade</th>
            <th>No. of Bags</th>
            <th>Net Weight (kg)</th>
            <th>Total Weight (kg)</th>
            <th>Employee Price (LKR)</th>
            <th>Manufacture Date</th>
            <th>My Valuation (LKR)</th>
            <th>Submit</th>
          </tr>
        </thead>
        <tbody>
          {lots.length > 0 ? lots.map((lot) => (
            <tr key={lot.lotNumber}>
              <td>{lot.lotNumber}</td>
              <td>{lot.invoiceNumber}</td>
              <td>{lot.teaGrade}</td>
              <td>{lot.noOfBags}</td>
              <td>{lot.netWeight}</td>
              <td>{lot.totalNetWeight}</td>
              <td>{lot.valuationPrice}</td>
              <td>{lot.manufacturingDate}</td>
              <td>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={valuationInputs[lot.lotNumber] || ''}
                  onChange={(e) => handleInputChange(lot.lotNumber, e.target.value)}
                />
              </td>
              <td>
                <Button
                  variant="success"
                  onClick={() => submitValuation(lot.lotNumber)}
                >
                  <FaCheck />
                </Button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="10" className="text-center">No new lots available.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
    </BrokerLayout>
  );
};

export default ViewNewLots;
