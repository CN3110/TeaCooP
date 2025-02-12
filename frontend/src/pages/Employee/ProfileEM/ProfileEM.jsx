import React, { useState } from "react";
import "./ProfileEM.css";

const ProfileEM = ({ closeModal }) => {
  const [employee, setEmployee] = useState({
    id: "",
    name: "",
    nic: "",
    contact: "",
    password: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        <h2>Employee Profile</h2>

        <div className="profile-details">
          <label>Employee ID:</label>
          <input type="text" value={employee.id} disabled />

          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>NIC:</label>
          <input
            type="text"
            name="nic"
            value={employee.nic}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Contact Number:</label>
          <input
            type="text"
            name="contact"
            value={employee.contact}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter new password"
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {/* Buttons aligned in the same line */}
        <div className="button-group">
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          ) : (
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          )}
          <button className="close-btn" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEM;
