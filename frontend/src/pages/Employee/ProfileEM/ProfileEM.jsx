import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./ProfileEM.css";

const ProfileEM = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    employeeId: "",
    employeeName: "",
    employeeContact_no: "",
    employeeEmail: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:3001/api/employees/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEmployee({
          ...response.data,
          password: "",
          confirmPassword: ""
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("Failed to load employee data");
        navigate("/login");
      }
    };

    fetchEmployeeData();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isEditing) {
      if (!employee.employeeName) newErrors.employeeName = "Name is required";
      if (!employee.employeeContact_no) newErrors.employeeContact_no = "Contact number is required";
      if (!employee.employeeEmail) newErrors.employeeEmail = "Email is required";
      
      // Only validate passwords if they're being changed
      if (employee.password || employee.confirmPassword) {
        if (employee.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (employee.password !== employee.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");
      const payload = {
        employeeName: employee.employeeName,
        employeeContact_no: employee.employeeContact_no,
        employeeEmail: employee.employeeEmail
      };

      // Only include password in payload if it's being changed
      if (employee.password) {
        payload.password = employee.password;
      }

      await axios.put(`http://localhost:3001/api/employees/${userId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Employee Profile</h2>
      
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="profile-details">
        <div className="form-group">
          <label>Employee ID:</label>
          <input 
            type="text" 
            value={employee.employeeId} 
            disabled 
          />
        </div>

        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="employeeName"
            value={employee.employeeName}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.employeeName ? "error" : ""}
          />
          {errors.employeeName && <span className="error-message">{errors.employeeName}</span>}
        </div>

        <div className="form-group">
          <label>Contact Number:</label>
          <input
            type="text"
            name="employeeContact_no"
            value={employee.employeeContact_no}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.employeeContact_no ? "error" : ""}
          />
          {errors.employeeContact_no && <span className="error-message">{errors.employeeContact_no}</span>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="employeeEmail"
            value={employee.employeeEmail}
            onChange={handleChange}
            disabled={!isEditing}
            className={errors.employeeEmail ? "error" : ""}
          />
          {errors.employeeEmail && <span className="error-message">{errors.employeeEmail}</span>}
        </div>

        {isEditing && (
          <>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                name="password"
                value={employee.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className={errors.password ? "error" : ""}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={employee.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={errors.confirmPassword ? "error" : ""}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </>
        )}
      </div>

      <div className="button-group">
        {!isEditing ? (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
        ) : (
          <>
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
            <button className="cancel-btn" onClick={() => {
              setIsEditing(false);
              setErrors({});
            }}>Cancel</button>
          </>
        )}
        <button className="dashboard-btn" onClick={() => navigate("/employee-dashboard")}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProfileEM;