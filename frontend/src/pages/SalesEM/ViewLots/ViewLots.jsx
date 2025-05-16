import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewLots.css";
import { BiSearch } from "react-icons/bi";

const ViewLots = () => {
  const [lots, setLots] = useState([]);
  const [teaTypes, setTeaTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const lotsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotsResponse = await fetch("http://localhost:3001/api/lots");
        if (!lotsResponse.ok) throw new Error("Failed to fetch lots");
        const lotsData = await lotsResponse.json();

        const teaTypesResponse = await fetch("http://localhost:3001/api/teaTypes");
        if (!teaTypesResponse.ok) throw new Error("Failed to fetch tea types");
        const teaTypesData = await teaTypesResponse.json();

        setLots(lotsData);
        setTeaTypes(teaTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  const getTeaTypeName = (teaTypeId) => {
    const teaType = teaTypes.find(type => type.teaTypeId === teaTypeId);
    return teaType ? teaType.teaTypeName : "Unknown";
  };

  const handleEdit = (lotNumber) => {
    navigate(`/edit-lot/${lotNumber}`);
  };

  const handleDelete = async (lotNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lot?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/lots/${lotNumber}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete lot");

      setLots(lots.filter((lot) => lot.lotNumber !== lotNumber));
      alert("Lot deleted successfully!");
    } catch (error) {
      console.error("Error deleting lot:", error);
      alert("Failed to delete lot. Please try again.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const filteredLots = lots.filter((lot) =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLot = currentPage * lotsPerPage;
  const indexOfFirstLot = indexOfLastLot - lotsPerPage;
  const currentLots = filteredLots.slice(indexOfFirstLot, indexOfLastLot);
  const totalPages = Math.ceil(filteredLots.length / lotsPerPage);

  return (
    <EmployeeLayout>
      <div className="lot-list-container">
        <div className="content-header">
          <h3>Lot List</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Lot Number"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            <button
              className="add-lot-btn"
              onClick={() => navigate("/employee-dashboard-create-lot")}
            >
              Add New Lot
            </button>
          </div>
        </div>

        <table className="lot-table">
          <thead>
            <tr>
              <th>Lot Number</th>
              <th>Manufacturing Date</th>
              <th>Tea Type</th>
              <th>No. of Bags</th>
              <th>Net Weight (kg)</th>
              <th>Total Net Weight (kg)</th>
              <th>Valuation Price (LKR)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLots.map((lot) => (
              <tr key={lot.lotNumber}>
                <td>{lot.lotNumber}</td>
                <td>{new Date(lot.manufacturingDate).toLocaleDateString()}</td>
                <td>{getTeaTypeName(lot.teaTypeId)}</td>
                <td>{lot.noOfBags}</td>
                <td>{lot.netWeight}</td>
                <td>{lot.totalNetWeight}</td>
                <td>{lot.valuationPrice}</td>
                <td>
                  <div className="form-buttons">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(lot.lotNumber)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(lot.lotNumber)}
                    >
                      Delete
                    </button>
                    <button
                      className="view-valuations-button"
                      onClick={() => navigate(`/view-valuations/${lot.lotNumber}`)}
                    >
                      View Valuations
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default ViewLots;
