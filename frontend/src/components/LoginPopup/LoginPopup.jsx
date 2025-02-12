import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./LoginPopup.css";

const LoginPopup = ({ show, handleClose }) => {
  const [isSignup, setIsSignup] = useState(false); // Toggle between Signup & Login
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    contact: "",
    nic: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isSignup ? "Signup Data" : "Login Data", formData);
    handleClose(); // Close modal after submission
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton aria-label="Close" className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          {isSignup ? "Register - Employee" : "Log In"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {isSignup ? (
            <>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  name="employeeId"
                  placeholder="Employee ID"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  name="contact"
                  placeholder="Contact No."
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Control
                  type="text"
                  name="nic"
                  placeholder="NIC"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </>
          ) : (
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
          )}

          <Form.Group className="mb-2">
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {isSignup && (
            <Form.Group className="mb-2">
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <div className="d-flex justify-content-between">
            <Button variant="dark" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {isSignup ? "Register" : "Log In"}
            </Button>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer className="text-center w-100">
        {isSignup ? (
          <p>
            Already have an account?{" "}
            <Button variant="link" onClick={() => setIsSignup(false)}>
              Log In
            </Button>
          </p>
        ) : (
          <p>
            Don't have an account?{" "}
            <Button variant="link" onClick={() => setIsSignup(true)}>
              Register
            </Button>
          </p>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default LoginPopup;
