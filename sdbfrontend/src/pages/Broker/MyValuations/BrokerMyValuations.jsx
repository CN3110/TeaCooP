import React, { useEffect, useState } from "react";
import BrokerLayout from "../../../components/broker/BrokerLayout/BrokerLayout";
import { Table, Badge, Button, Modal, Form, Alert, Pagination } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const BrokerMyValuations = () => {
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brokerId, setBrokerId] = useState("");

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentValuation, setCurrentValuation] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [valuationToDelete, setValuationToDelete] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loggedBrokerId = localStorage.getItem("userId");
    if (!loggedBrokerId) {
      setError("Broker user ID not found in local storage.");
      setLoading(false);
      return;
    }
    setBrokerId(loggedBrokerId);
    fetchMyValuations(loggedBrokerId);
  }, []);

  const fetchMyValuations = async (brokerId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/api/valuations/broker/${brokerId}`);
      setValuations(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching valuations:", err);
      setError("Failed to load your valuations. Please try again later.");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditClick = (valuation) => {
    if (valuation.is_confirmed) return;
    setCurrentValuation(valuation);
    setEditPrice(valuation.valuationPrice);
    setEditError("");
    setEditSuccess("");
    setShowEditModal(true);
  };

  const handleDeleteClick = (valuation) => {
    if (valuation.is_confirmed) return;
    setValuationToDelete(valuation);
    setShowDeleteModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editPrice || isNaN(editPrice) || editPrice <= 0) {
      setEditError("Please enter a valid price.");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/valuations/${currentValuation.valuation_id}`, {
        valuationPrice: parseFloat(editPrice),
      });

      setValuations((prev) =>
        prev.map((val) =>
          val.valuation_id === currentValuation.valuation_id
            ? { ...val, valuationPrice: parseFloat(editPrice) }
            : val
        )
      );

      setEditSuccess("Valuation updated successfully!");
      setTimeout(() => {
        setShowEditModal(false);
        setCurrentValuation(null);
      }, 1500);
    } catch (err) {
      console.error("Error updating valuation:", err);
      setEditError("Failed to update valuation. Please try again.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/valuations/${valuationToDelete.valuation_id}`);
      setValuations((prev) =>
        prev.filter((val) => val.valuation_id !== valuationToDelete.valuation_id)
      );
      setShowDeleteModal(false);
      setValuationToDelete(null);
    } catch (err) {
      console.error("Error deleting valuation:", err);
      alert("Failed to delete valuation. Please try again.");
    }
  };

  const totalPages = Math.ceil(valuations.length / itemsPerPage);
  const paginatedValuations = valuations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <BrokerLayout>
        <div className="container mt-4 text-center">
          <h3>Loading your valuations...</h3>
        </div>
      </BrokerLayout>
    );
  }

  if (error) {
    return (
      <BrokerLayout>
        <div className="container mt-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="container mt-4">
        <h3>My Valuation Prices</h3>
        <Table striped bordered hover responsive className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>Lot #</th>
              <th>Tea Type</th>
              <th>Bags</th>
              <th>Weight (kg)</th>
              <th>Valuation Date</th>
              <th>My Price (LKR)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedValuations.length > 0 ? (
              paginatedValuations.map((valuation) => (
                <tr key={valuation.valuation_id}>
                  <td>{valuation.lotNumber}</td>
                  <td>{valuation.teaTypeName}</td>
                  <td>{valuation.noOfBags}</td>
                  <td>{valuation.totalNetWeight}</td>
                  <td>{formatDate(valuation.valuationDate)}</td>
                  <td>{valuation.valuationPrice}</td>
                  <td>
                    {valuation.is_confirmed ? (
                      <Badge bg="success">Confirmed</Badge>
                    ) : (
                      <Badge bg="secondary">Pending</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant=" #023020"
                      size="sm"
                      className="me-2"
                      colour=" #023020"
                      onClick={() => handleEditClick(valuation)}
                      disabled={valuation.is_confirmed}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(valuation)}
                      disabled={valuation.is_confirmed}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  You haven't submitted any valuations yet.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination Controls */}
        {valuations.length > itemsPerPage && (
          <div className="d-flex justify-content-center">
            <Pagination>
              {[...Array(totalPages).keys()].map((pageNum) => (
                <Pagination.Item
                  key={pageNum + 1}
                  active={pageNum + 1 === currentPage}
                  onClick={() => handlePageChange(pageNum + 1)}
                >
                  {pageNum + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Valuation Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger">{editError}</Alert>}
          {editSuccess && <Alert variant="success">{editSuccess}</Alert>}

          {currentValuation && (
            <>
              <p><strong>Lot Number:</strong> {currentValuation.lotNumber}</p>
              <p><strong>Tea Type:</strong> {currentValuation.teaTypeName}</p>

              <Form.Group className="mb-3">
                <Form.Label>Valuation Price (LKR)</Form.Label>
                <Form.Control
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {valuationToDelete && (
            <p>
              Are you sure you want to delete your valuation of <strong>{valuationToDelete.valuationPrice} LKR</strong> for lot <strong>{valuationToDelete.lotNumber}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Valuation
          </Button>
        </Modal.Footer>
      </Modal>
    </BrokerLayout>
  );
};

export default BrokerMyValuations;
