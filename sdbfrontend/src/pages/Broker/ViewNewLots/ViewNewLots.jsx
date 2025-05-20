import React, { useEffect, useState } from "react";
import BrokerLayout from "../../../components/broker/BrokerLayout/BrokerLayout";
import { Table, Form, Button, Modal, Toast, ToastContainer } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const ViewNewLots = () => {
  const [lots, setLots] = useState([]);
  const [valuationInputs, setValuationInputs] = useState({});
  const [brokerId, setBrokerId] = useState("");
  const [teaTypes, setTeaTypes] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });
  const [showModal, setShowModal] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const lotsPerPage = 5;

  useEffect(() => {
    const loggedBrokerId = localStorage.getItem("userId");
    if (!loggedBrokerId) {
      showToast("Broker user ID not found.", "danger");
      return;
    }
    setBrokerId(loggedBrokerId);
  }, []);

  useEffect(() => {
    if (brokerId) {
      fetchLots();
    }
  }, [brokerId]);

  const fetchLots = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/lots/available-for-broker?brokerId=${brokerId}`);
      console.log("Fetched lots:", res.data);
      setLots(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch lots.", "danger");
    }
  };

  useEffect(() => {
  axios.get('http://localhost:3001/api/teaTypes')
    .then((response) => {
      console.log("Fetched tea types:", response.data);
      setTeaTypes(response.data);
    })
    .catch((error) => {
      console.error("Error fetching tea types:", error);
    });
}, []);

const getTeaTypeName = (id) => {
  const teaType = teaTypes.find((type) => type.teaTypeId === id);
  return teaType ? teaType.teaTypeName : "Unknown";
};


  const handleInputChange = (lotNumber, value) => {
    setValuationInputs((prev) => ({ ...prev, [lotNumber]: value }));
  };

  const handleModalOpen = (lotNumber) => {
    setSelectedLot(lotNumber);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedLot(null);
  };

  const showToast = (message, bg = "success") => {
    setToast({ show: true, message, bg });
  };

  const submitValuation = async () => {
    const lotNumber = selectedLot;
    const price = valuationInputs[lotNumber];

    if (!price || isNaN(price)) {
      showToast("Please enter a valid valuation price.", "warning");
      handleModalClose();
      return;
    }

    try {
      await axios.post(`http://localhost:3001/api/lots/${lotNumber}/valuation`, {
        brokerId,
        valuationPrice: parseFloat(price),
      });

      showToast("Valuation submitted!", "success");

      setLots((prevLots) => prevLots.filter((lot) => lot.lotNumber !== lotNumber));

      setValuationInputs((prev) => {
        const updated = { ...prev };
        delete updated[lotNumber];
        return updated;
      });
    } catch (err) {
      console.error(err);
      showToast("Submission failed.", "danger");
    } finally {
      handleModalClose();
    }
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate paginated data
  const indexOfLastLot = currentPage * lotsPerPage;
  const indexOfFirstLot = indexOfLastLot - lotsPerPage;
  const currentLots = lots.slice(indexOfFirstLot, indexOfLastLot);
  const totalPages = Math.ceil(lots.length / lotsPerPage);

  return (
    <BrokerLayout>
      <div className="container mt-4">
        <h3>View New Lots</h3>
        <Table striped bordered hover responsive className="mt-3">
          <thead className="table-dark">
            <tr>
              <th>Lot #</th>
              <th>Tea Type</th>
              <th>No. of Bags</th>
              <th>Net Weight (kg)</th>
              <th>Total Weight (kg)</th>
              <th>Employee Price (LKR)</th>
              <th>Manufacture Date</th>
              <th>Notes</th>
              <th>My Valuation (LKR)</th>
              <th>Submit</th>
            </tr>
          </thead>
          <tbody>
            {currentLots.length > 0 ? (
              currentLots.map((lot) => (
                <tr key={lot.lotNumber}>
                  <td>{lot.lotNumber}</td>
                  <td>{getTeaTypeName(lot.teaTypeId)}</td>
                  <td>{lot.noOfBags}</td>
                  <td>{lot.netWeight}</td>
                  <td>{lot.totalNetWeight}</td>
                  <td>{lot.valuationPrice}</td>
                  <td>{lot.manufacturingDate.substring(0, 10)}</td>
                  <td>{lot.notes}</td>
                  <td>
                    <Form.Control
                      type="number"
                      placeholder="Enter price"
                      value={valuationInputs[lot.lotNumber] ?? ""}
                      onChange={(e) => handleInputChange(lot.lotNumber, e.target.value)}
                    />
                  </td>
                  <td>
                    <Button variant="success" onClick={() => handleModalOpen(lot.lotNumber)}>
                      <FaCheck />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No new lots available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Material UI Pagination */}
        {lots.length > lotsPerPage && (
          <Stack spacing={2} direction="row" justifyContent="center" className="mt-3">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </Stack>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Valuation Submission</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to submit the valuation price for Lot #{selectedLot}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button variant="success" onClick={submitValuation}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Toast */}
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
      </div>
    </BrokerLayout>
  );
};

export default ViewNewLots;
