import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "./LoginPopup.css";

const LoginPopup = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    userId: "",
    passcode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = "http://localhost:3001/api/auth/login";
      const payload = {
        userId: formData.userId,
        passcode: formData.passcode,
      };

      const response = await axios.post(url, payload);

      console.log(response.data);
      alert("Login successful!");
      localStorage.setItem("token", response.data.token); // Save token for future requests

      handleClose(); // Close the modal after login
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        aria-label="Close"
        className="modal-header-custom"
      >
        <Modal.Title className="modal-title-custom">Log In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Control
              type="text"
              name="userId"
              placeholder="User ID"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </Form.Group>

          // Change the password input to this:
<Form.Control
    type="password"
    name="passcode"
    placeholder="Enter your passcode or password"
    value={formData.passcode}
    onChange={handleChange}
    required
/>

          <div className="d-flex justify-content-between">
            <Button variant="dark" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log In
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LoginPopup;
