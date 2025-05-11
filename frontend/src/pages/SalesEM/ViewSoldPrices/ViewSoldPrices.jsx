import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeLayout from '../../../components/EmployeeLayout/EmployeeLayout.jsx';

const ViewSoldPrices = () => {
  const [soldLots, setSoldLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSoldLots = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/soldLots/all');
        setSoldLots(response.data.data);
      } catch (err) {
        console.error('Error fetching sold lots:', err);
        setError('Failed to load sold lots data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSoldLots();
  }, []);

  const filteredLots = soldLots.filter(lot => 
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.teaGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.brokerCompanyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <EmployeeLayout>
        <div className="d-flex justify-content-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="mb-0">All Sold Lots</h2>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search lots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {filteredLots.length === 0 ? (
              <div className="alert alert-info">
                {searchTerm ? 'No matching lots found' : 'No sold lots available'}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Lot #</th>
                      <th>Tea Type</th>
                      <th>Net Weight (kg)</th>
                      <th>Broker</th>
                      <th>Company</th>
                      <th>Employee Valuation (LKR/kg)</th>
                      <th>Sold Price (LKR/kg)</th>
                      <th>Total Sold (LKR)</th>
                     
                      <th>Date Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLots.map(lot => (
                      <tr key={lot.saleId}>
                        <td>{lot.lotNumber}</td>
                        <td>{lot.teaTypeName}</td>
                        <td>{lot.totalNetWeight}</td>
                        <td>{lot.brokerName}</td>
                        <td>{lot.brokerCompanyName}</td>
                        <td>{lot.employeeValuation}</td>
                        <td>{lot.soldPrice}</td>
                        <td>{lot.totalSoldPrice}</td>
                        <td>{new Date(lot.soldDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ViewSoldPrices;