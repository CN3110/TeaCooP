import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Container, Alert, Card, Spinner, Form, Modal } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import BrokerLayout from "../../../components/Broker/BrokerLayout/BrokerLayout";

const BrokerLotManagement = () => {
  const [lots, setLots] = useState([]);
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [brokerId, setBrokerId] = useState(null);
  const [brokerValuations, setBrokerValuations] = useState({});
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [currentLot, setCurrentLot] = useState(null);
  const [valuationPrice, setValuationPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("available"); // "available" or "confirmed"

  const navigate = useNavigate();

  // Get broker ID from token on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.userType !== 'broker') {
        navigate('/login');
        return;
      }
      setBrokerId(decoded.userId);
    } catch (error) {
      console.error('Invalid token:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all lots and broker's valuations
  useEffect(() => {
    if (!brokerId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all lots
        const lotsResponse = await axios.get('/api/lots', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Fetch broker's existing valuations
        const valuationsResponse = await axios.get(`/api/brokers/${brokerId}/valuations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Create a map of lotNumber to valuation
        const valuationsMap = {};
        valuationsResponse.data.forEach(v => {
          valuationsMap[v.lotNumber] = v.valuationPrice;
        });

        setLots(lotsResponse.data);
        setBrokerValuations(valuationsMap);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch data");
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brokerId, navigate]);

  // Fetch confirmed lots
  const fetchConfirmedLots = async () => {
    try {
      const response = await axios.get(`/api/lots/broker/${brokerId}/confirmed-lots`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setConfirmedLots(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch confirmed lots");
    }
  };

  // Call fetchConfirmedLots when brokerId changes
  useEffect(() => {
    if (brokerId) {
      fetchConfirmedLots();
    }
  }, [brokerId]);

  const handleAddValuation = (lot) => {
    setCurrentLot(lot);
    setValuationPrice(brokerValuations[lot.lotNumber] || "");
    setShowValuationModal(true);
  };

  const submitValuation = async () => {
    if (!valuationPrice || isNaN(valuationPrice) || parseFloat(valuationPrice) <= 0) {
      setError("Please enter a valid valuation price");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await axios.post(
        `/api/lots/${currentLot.lotNumber}/valuations`,
        {
          brokerId,
          valuationPrice: parseFloat(valuationPrice)
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update local state
      setBrokerValuations(prev => ({
        ...prev,
        [currentLot.lotNumber]: valuationPrice
      }));

      setShowValuationModal(false);
      fetchConfirmedLots(); // Refresh confirmed lots after submitting valuation
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit valuation");
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSoldPrice = async (lotNumber) => {
    const soldPrice = prompt("Enter sold price:");
    if (!soldPrice || isNaN(soldPrice)) {
      alert("Please enter a valid number");
      return;
    }

    try {
      await axios.post(
        `/api/lots/${lotNumber}/sold`,
        { brokerId, soldPrice },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchConfirmedLots(); // Refresh the list
      alert("Sold price added successfully!");
    } catch (error) {
      alert("Error adding sold price: " + (error.response?.data?.error || error.message));
    }
  };

  const handleMarkAsPaid = async (saleId) => {
    try {
      await axios.post(
        `/api/lots/sold/${saleId}/mark-paid`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchConfirmedLots(); // Refresh the list
      alert("Payment status updated successfully!");
    } catch (error) {
      alert("Error updating payment status: " + (error.response?.data?.error || error.message));
    }
  };

  const filteredLots = lots.filter(lot => 
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.teaGrade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredConfirmedLots = confirmedLots.filter(lot => 
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.teaGrade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <BrokerLayout>
        <Container className="d-flex justify-content-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </BrokerLayout>
    );
  }

  if (error) {
    return (
      <BrokerLayout>
        <Container className="mt-4">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>{activeTab === "available" ? "Available Tea Lots" : "My Confirmed Lots"}</h2>
          <div>
            <Button 
              variant={activeTab === "available" ? "primary" : "outline-primary"} 
              className="me-2"
              onClick={() => setActiveTab("available")}
            >
              Available Lots
            </Button>
            <Button 
              variant={activeTab === "confirmed" ? "primary" : "outline-primary"}
              onClick={() => setActiveTab("confirmed")}
            >
              Confirmed Lots
            </Button>
          </div>
        </div>
        
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder={`Search by ${activeTab === "available" ? "Lot Number, Invoice, or Tea Grade" : "Lot Number or Tea Grade"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <Card>
          <Card.Body>
            {activeTab === "available" ? (
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>Lot Number</th>
                    <th>Invoice</th>
                    <th>Date</th>
                    <th>Tea Grade</th>
                    <th>Bags</th>
                    <th>Net Weight (kg)</th>
                    <th>Total Weight (kg)</th>
                    <th>My Valuation (LKR/kg)</th>
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
                      <td>{lot.netWeight}</td>
                      <td>{lot.totalNetWeight}</td>
                      <td>
                        {brokerValuations[lot.lotNumber] ? 
                          parseFloat(brokerValuations[lot.lotNumber]).toLocaleString() : 
                          'Not valued'}
                      </td>
                      <td>
                        <Button 
                          variant={brokerValuations[lot.lotNumber] ? "outline-primary" : "primary"}
                          size="sm"
                          onClick={() => handleAddValuation(lot)}
                        >
                          {brokerValuations[lot.lotNumber] ? 'Update' : 'Add'} Valuation
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>Lot Number</th>
                    <th>Tea Grade</th>
                    <th>Bags</th>
                    <th>Total Weight (kg)</th>
                    <th>Confirmed Valuation</th>
                    <th>Sold Price</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConfirmedLots.map((lot) => (
                    <tr key={lot.lotNumber}>
                      <td>{lot.lotNumber}</td>
                      <td>{lot.teaGrade}</td>
                      <td>{lot.noOfBags}</td>
                      <td>{lot.totalNetWeight}</td>
                      <td>{lot.valuationPrice} LKR</td>
                      <td>
                        {lot.soldPrice ? (
                          `${lot.soldPrice} LKR`
                        ) : (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleAddSoldPrice(lot.lotNumber)}
                          >
                            Add Sold Price
                          </Button>
                        )}
                      </td>
                      <td>
                        {lot.paymentStatus === 'paid' ? (
                          <span className="text-success">Paid on {new Date(lot.paymentDate).toLocaleDateString()}</span>
                        ) : lot.soldPrice ? (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleMarkAsPaid(lot.saleId)}
                          >
                            Mark as Paid
                          </Button>
                        ) : (
                          <span className="text-warning">Pending</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={() => navigate(`/broker/view-lot/${lot.lotNumber}`)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>

        {/* Valuation Modal */}
        <Modal show={showValuationModal} onHide={() => setShowValuationModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {brokerValuations[currentLot?.lotNumber] ? 'Update' : 'Add'} Valuation for Lot {currentLot?.lotNumber}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Tea Grade</Form.Label>
              <Form.Control 
                type="text" 
                value={currentLot?.teaGrade || ''} 
                readOnly 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Total Net Weight</Form.Label>
              <Form.Control 
                type="text" 
                value={`${currentLot?.totalNetWeight || 0} kg`} 
                readOnly 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Your Valuation Price (LKR/kg)</Form.Label>
              <Form.Control
                type="number"
                min="0.01"
                step="0.01"
                value={valuationPrice}
                onChange={(e) => setValuationPrice(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowValuationModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={submitValuation}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" />
                  <span className="ms-2">Submitting...</span>
                </>
              ) : (
                brokerValuations[currentLot?.lotNumber] ? 'Update Valuation' : 'Submit Valuation'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </BrokerLayout>
  );
};

export default BrokerLotManagement;