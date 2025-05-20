import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Badge,
  Spinner,
  Container,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { format } from "date-fns";
import BrokerLayout from "../../../components/broker/BrokerLayout/BrokerLayout";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const BrokerConfirmLots = () => {
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", bg: "danger" });

  const brokerId = localStorage.getItem("userId");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchConfirmedLots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/valuations/broker/${brokerId}/confirmed`
        );

        setConfirmedLots(response.data);
        setLoading(false);

        if (response.data.length === 0) {
          showToast("You don't have any confirmed lot valuations yet.", "info");
        }
      } catch (err) {
        console.error("Error fetching confirmed lots:", err);
        showToast("Failed to load confirmed lots. Please try again later.", "danger");
        setLoading(false);
      }
    };

    if (brokerId) {
      fetchConfirmedLots();
    }
  }, [brokerId]);

  const showToast = (message, bg = "success") => {
    setToast({ show: true, message, bg });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = confirmedLots.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(confirmedLots.length / rowsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <BrokerLayout>
      <Container className="mt-4">
        <h3>Your Confirmed Lot Valuations</h3>
        <p>These are your valuations that have been confirmed by the MK Tea CooP employees.</p>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive className="mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Lot Number</th>
                  <th>Tea Type</th>
                  <th>Bags</th>
                  <th>Net Weight (kg)</th>
                  <th>Valuation Amount (LKR/kg)</th>
                  <th>Valuation Date</th>
                  <th>Confirmation Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((lot) => (
                    <tr key={lot.valuation_id}>
                      <td>{lot.lotNumber}</td>
                      <td>{lot.teaTypeName || "N/A"}</td>
                      <td>{lot.noOfBags || "N/A"}</td>
                      <td>{lot.totalNetWeight ? `${lot.totalNetWeight} kg` : "N/A"}</td>
                      <td>{lot.valuationAmount ? lot.valuationAmount : "N/A"}</td>
                      <td>{formatDate(lot.valuationDate)}</td>
                      <td>{formatDate(lot.confirmed_at)}</td>
                      <td>
                        <Badge bg="success">Confirmed</Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No confirmed valuations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3">
                <Stack spacing={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </Stack>
              </div>
            )}
          </>
        )}

        {/* Bootstrap Toast */}
        <ToastContainer position="top-center" className="mt-3">
          <Toast
            show={toast.show}
            onClose={() => setToast((prev) => ({ ...prev, show: false }))}
            delay={3000}
            autohide
            bg={toast.bg}
          >
            <Toast.Body className="text-white">{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </BrokerLayout>
  );
};

export default BrokerConfirmLots;
