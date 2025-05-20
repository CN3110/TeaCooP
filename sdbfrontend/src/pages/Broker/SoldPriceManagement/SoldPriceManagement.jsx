import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BrokerLayout from '../../../components/broker/BrokerLayout/BrokerLayout';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const SoldPriceManagement = () => {
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editingLot, setEditingLot] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const brokerId = localStorage.getItem('userId');

  const fetchConfirmedLots = async () => {
    try {
      setLoading(true);
      setError(null);

      const [confirmedRes, soldRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/valuations/broker/${brokerId}/confirmed`),
        axios.get(`http://localhost:3001/api/soldLots/broker/${brokerId}`)
      ]);

      const soldData = soldRes.data.data || [];

      const soldPricesMap = soldData.reduce((acc, item) => {
        acc[item.lotNumber] = item.soldPrice;
        return acc;
      }, {});

      const mergedData = confirmedRes.data.map(lot => ({
        ...lot,
        soldPrice: soldPricesMap[lot.lotNumber] || '',
        totalSoldPrice: soldPricesMap[lot.lotNumber]
          ? (parseFloat(soldPricesMap[lot.lotNumber]) * lot.totalNetWeight).toFixed(2)
          : ''
      }));

      setConfirmedLots(mergedData);
    } catch (err) {
      console.error('Error fetching confirmed lots:', err);
      setError('Failed to load confirmed lots. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrice = async (lotNumber, price) => {
    try {
      if (!brokerId) throw new Error('User not authenticated');

      const priceValue = parseFloat(price);
      if (!price || isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Please enter a valid price greater than 0');
      }

      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:3001/api/soldLots', {
        lotNumber,
        brokerId,
        soldPrice: priceValue
      });

      if (response.data.success) {
        setSuccessMessage(response.data.message);

        setConfirmedLots(prev =>
          prev.map(item =>
            item.lotNumber === lotNumber
              ? { ...item, soldPrice: priceValue, status: 'sold' }
              : item
          )
        );
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }

      setEditingLot(null);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || err.message || 'Error saving price');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (lotNumber, value) => {
    setConfirmedLots(prev =>
      prev.map(item =>
        item.lotNumber === lotNumber
          ? {
              ...item,
              soldPrice: value,
              totalSoldPrice: value && !isNaN(value)
                ? (parseFloat(value) * item.totalNetWeight).toFixed(2)
                : ''
            }
          : item
      )
    );
  };

  const startEditing = (lotNumber) => {
    setEditingLot(lotNumber);
  };

  const cancelEditing = () => {
    setEditingLot(null);
    fetchConfirmedLots();
  };

  useEffect(() => {
    fetchConfirmedLots();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(confirmedLots.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLots = confirmedLots.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return (
      <BrokerLayout>
        <div className="container mt-5">
          <div className="d-flex justify-content-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
      <div className="container mt-4">
        <h3>Manage Sold Prices</h3>
        <p>Enter the sold prices for your confirmed lots below.</p>
        <div className="card shadow">
          <div className="card-body">

            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {confirmedLots.length === 0 ? (
              <div className="alert alert-info">No confirmed lots available for price entry.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Lot #</th>
                      <th>Tea Type</th>
                      <th>Net Weight (kg)</th>
                      <th>Valuation (LKR/kg)</th>
                      <th>Sold Price (LKR/kg)</th>
                      <th>Total Sold (LKR)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLots.map((lot) => (
                      <tr key={lot.lotNumber}>
                        <td>{lot.lotNumber}</td>
                        <td>{lot.teaTypeName || 'N/A'}</td>
                        <td>{lot.totalNetWeight || 'N/A'}</td>
                        <td>{lot.valuationAmount || 'N/A'}</td>
                        <td>
                          <input
                            type="number"
                            value={lot.soldPrice}
                            onChange={(e) => handleInputChange(lot.lotNumber, e.target.value)}
                            className="form-control"
                            min="0"
                            step="0.01"
                            placeholder="Enter price"
                            disabled={editingLot !== lot.lotNumber && lot.soldPrice}
                          />
                        </td>
                        <td>{lot.totalSoldPrice || '-'}</td>
                        <td>
                          {editingLot === lot.lotNumber || !lot.soldPrice ? (
                            <>
                              <button
                                onClick={() => handleSavePrice(lot.lotNumber, lot.soldPrice)}
                                className="btn btn-success btn-sm me-2"
                              >
                                Save
                              </button>
                              {editingLot === lot.lotNumber && (
                                <button onClick={cancelEditing} className="btn btn-secondary btn-sm">
                                  Cancel
                                </button>
                              )}
                            </>
                          ) : (
                            <button onClick={() => startEditing(lot.lotNumber)} className="btn btn-primary btn-sm">
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Material UI Pagination */}
            {totalPages > 1 && (
              <Stack spacing={2} justifyContent="center" alignItems="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Stack>
            )}

          </div>
        </div>
      </div>
    </BrokerLayout>
  );
};

export default SoldPriceManagement;
