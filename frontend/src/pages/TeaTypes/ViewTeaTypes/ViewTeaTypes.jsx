import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewTeaTypes.css";

const ViewTeaTypes = () => {
  const [searchId, setSearchId] = useState("");
  const [teaTypes, setTeaTypes] = useState([]);
  const [filteredTeaTypes, setFilteredTeaTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeaTypes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/tea-types");
        if (response.ok) {
          const data = await response.json();
          setTeaTypes(data);
          setFilteredTeaTypes(data);
        } else {
          console.error("Failed to fetch tea types");
        }
      } catch (error) {
        console.error("Error fetching tea types:", error);
      }
    };

    fetchTeaTypes();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchId(searchTerm);
    const filtered = teaTypes.filter((teaType) =>
      teaType.teaTypeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeaTypes(filtered);
  };

  const handleAddTeaType = () => {
    navigate("/add-tea-type");
  };

  const handleEdit = (teaType) => {
    navigate(`/edit-tea-type/${teaType.teaTypeId}`);
  };

  const handleDelete = async (teaTypeId) => {
    if (window.confirm("Are you sure you want to delete this tea type?")) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/tea-types/${teaTypeId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          const updatedTeaTypes = teaTypes.filter(
            (teaType) => teaType.teaTypeId !== teaTypeId
          );
          setTeaTypes(updatedTeaTypes);
          setFilteredTeaTypes(updatedTeaTypes);
        } else {
          console.error("Failed to delete tea type");
        }
      } catch (error) {
        console.error("Error deleting tea type:", error);
      }
    }
  };

  return (
    <EmployeeLayout>
      <div className="view-tea-types-container">
        <div className="content-header">
          <h3>View Tea Types</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Tea Type"
                value={searchId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            <button className="add-tea-type-btn" onClick={handleAddTeaType}>
              Add Tea Type
            </button>
          </div>
        </div>
        <table className="tea-types-table">
          <thead>
            <tr>
              <th>Tea Type Name</th>
              <th>Tea Type Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeaTypes.map((teaType) => (
              <tr key={teaType.teaTypeId}>
                <td>{teaType.teaTypeName}</td>
                <td>{teaType.teaTypeDescription}</td>
                <td>
                  <button onClick={() => handleEdit(teaType)}>Edit</button>
                  <button onClick={() => handleDelete(teaType.teaTypeId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewTeaTypes;