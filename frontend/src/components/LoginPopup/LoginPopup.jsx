import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import "./LoginPopup.css";

const LoginPopup = ({ show, handleClose }) => {
    const [isSignup, setIsSignup] = useState(false); // Toggle between Signup & Login
    const [formData, setFormData] = useState({
        employeeId: "",
        employeeName: "",
        employeeContactNo: "",
        employeePassword: "",
        employeeConfirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = isSignup ? "http://localhost:3001/api/auth/signup" : "http://localhost:3001/api/auth/login";
            const payload = isSignup
                ? {
                      employeeId: formData.employeeId,
                      employeeName: formData.employeeName,
                      employeeContactNo: formData.employeeContactNo,
                      employeePassword: formData.employeePassword,
                  }
                : {
                      employeeId: formData.employeeId,
                      employeePassword: formData.employeePassword,
                  };

            const response = await axios.post(url, payload);

            console.log(response.data);
            if (isSignup) {
                alert("Employee registered successfully!");
            } else {
                alert("Login successful!");
                localStorage.setItem("token", response.data.token); // Save token for future requests
            }

            handleClose(); // Close the modal after submission
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "An error occurred");
        }
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
                                    name="employeeName"
                                    placeholder="Employee Name"
                                    value={formData.employeeName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Control
                                    type="text"
                                    name="employeeContactNo"
                                    placeholder="Contact No."
                                    value={formData.employeeContactNo}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </>
                    ) : (
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
                    )}

                    <Form.Group className="mb-2">
                        <Form.Control
                            type="password"
                            name="employeePassword"
                            placeholder="Password"
                            value={formData.employeePassword}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {isSignup && (
                        <Form.Group className="mb-2">
                            <Form.Control
                                type="password"
                                name="employeeConfirmPassword"
                                placeholder="Confirm Password"
                                value={formData.employeeConfirmPassword}
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