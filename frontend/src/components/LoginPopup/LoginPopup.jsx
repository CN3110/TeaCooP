import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./LoginPopup.css";

const LoginPopup = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    userId: "",
    passcode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const url = "http://localhost:3001/api/auth/login";
      const payload = {
        userId: formData.userId,
        passcode: formData.passcode,
      };
  
      const response = await axios.post(url, payload);
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userType", response.data.userType);
  
      if (response.data.needsPassword) {
        // Use navigate instead of window.location
        navigate(`/profile/${formData.userId}`);
      } else {
        navigate(`/${response.data.userType}-dashboard`);
      }
      handleClose();
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              name="userId"
              placeholder="Enter your user ID"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Passcode</Form.Label>
            <Form.Control
              type="password"
              name="passcode"
              placeholder="Enter your passcode"
              value={formData.passcode}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginPopup;